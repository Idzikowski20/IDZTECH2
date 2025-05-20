import { useState, useEffect, useRef, useCallback } from "react";
import { User } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuthState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authInProgress = useRef(false);

  console.log("useAuthState initialized, current path:", location.pathname);

  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // Create flags to manage state
    let processingAuth = false;
    const abortController = new AbortController();

    // First set up auth state listener (before checking session)
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        console.log("Auth state changed:", currentUser ? "User logged in" : "User logged out");
        
        if (processingAuth) return;
        processingAuth = true;
        
        try {
          if (currentUser) {
            // Create a basic session object for compatibility
            const currentSession = {
              user: currentUser,
              access_token: await currentUser.getIdToken()
            };
            
            setSession(currentSession);
            
            // Use setTimeout to avoid potential auth deadlock
            setTimeout(async () => {
              try {
                if (abortController.signal.aborted) return;
                
                // Create extended user profile
                const userData = {
                  ...currentUser,
                  name: currentUser.displayName || null,
                } as User & ExtendedUserProfile;
                
                setUser(userData);
                setIsAuthenticated(true);
              } catch (error) {
                console.error("Error processing auth state change:", error);
              } finally {
                processingAuth = false;
                setLoading(false);
              }
            }, 0);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setSession(null);
            processingAuth = false;
            setLoading(false);
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          processingAuth = false;
          setLoading(false);
        }
      }
    );

    return () => {
      abortController.abort();
      unsubscribe();
      authInProgress.current = false;
    };
  }, []);

  const signIn = async (email: string, password: string, remember = false) => {
    try {
      console.log("Attempting to sign in:", email);
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      toast.success("Zalogowano pomyślnie", {
        description: "Witamy z powrotem!"
      });
      
      return { data: userCredential, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast.error("Błąd logowania", {
        description: error.message || "Nieprawidłowy email lub hasło"
      });
      return { error };
    }
  };

  const signOut = useCallback(async () => {
    try {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success("Wylogowano pomyślnie");
      
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, [navigate]);

  const resetPassword = async (email: string) => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
      
      toast.success("Email został wysłany", {
        description: "Sprawdź swoją skrzynkę pocztową, aby zresetować hasło"
      });
      
      return { error: null };
    } catch (error) {
      console.error("Password reset error:", error);
      
      toast.error("Błąd resetowania hasła", {
        description: "Nie udało się wysłać emaila z resetowaniem hasła"
      });
      
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { updatePassword: firebaseUpdatePassword } = await import('firebase/auth');
      
      if (!auth.currentUser) {
        throw new Error("No user is currently logged in");
      }
      
      await firebaseUpdatePassword(auth.currentUser, newPassword);
      
      toast.success("Hasło zaktualizowane", {
        description: "Twoje hasło zostało pomyślnie zmienione"
      });
      
      return { error: null };
    } catch (error) {
      console.error("Password update error:", error);
      
      toast.error("Błąd aktualizacji hasła", {
        description: "Nie udało się zmienić hasła"
      });
      
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};
