
import { useState, useEffect, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUserProfile } from "@/utils/AuthProvider";

export const useAuthState = (navigate: any, location: any) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const authInProgress = useRef(false);

  console.log("useAuthState initialized, current path:", location.pathname);

  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // Create flags to manage state
    let processingAuth = false;
    const abortController = new AbortController();

    // First set up auth state listener (before checking session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (processingAuth) return;
        processingAuth = true;
        
        try {
          if (currentSession) {
            setSession(currentSession);
            
            if (currentSession?.user) {
              // Use setTimeout to avoid potential Supabase auth deadlock
              setTimeout(async () => {
                try {
                  if (abortController.signal.aborted) return;
                  
                  // Use user metadata instead of profiles table
                  const userData = {
                    ...currentSession.user,
                    name: currentSession.user.user_metadata?.name || null,
                  } as User & ExtendedUserProfile;
                  
                  setUser(userData);
                  setIsAuthenticated(true);
                  
                  // Handle login redirection after a delay to prevent loops
                  if (event === 'SIGNED_IN') {
                    console.log("Sign-in event detected");
                    // Don't auto-redirect from the login page to prevent loops
                    authInProgress.current = false;
                  }
                } catch (error) {
                  console.error("Error processing auth state change:", error);
                } finally {
                  processingAuth = false;
                  setLoading(false);
                }
              }, 0);
            }
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

    // Check for existing session
    const checkSession = async () => {
      if (authInProgress.current) return;
      authInProgress.current = true;
      
      try {
        console.log("Getting session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session data:", currentSession ? "Session exists" : "No session");
        
        if (currentSession?.user) {
          setSession(currentSession);
          
          // Use user metadata from session
          const userData = {
            ...currentSession.user,
            name: currentSession.user.user_metadata?.name || null,
          } as User & ExtendedUserProfile;
          
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        authInProgress.current = false;
        setLoading(false);
      }
    };
    
    // Add a slight delay before checking session to ensure proper initialization
    const timer = setTimeout(() => {
      if (!abortController.signal.aborted) {
        checkSession();
      }
    }, 100);

    return () => {
      abortController.abort();
      clearTimeout(timer);
      subscription.unsubscribe();
      authInProgress.current = false;
    };
  }, [navigate, toast, location.pathname]);

  const signIn = async (email: string, password: string, remember = false) => {
    try {
      console.log("Attempting to sign in:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        toast({
          title: "Błąd logowania",
          description: error.message || "Nieprawidłowy email lub hasło",
          variant: "destructive"
        });
        return { error };
      } 
      
      // Successful login
      toast({
        title: "Zalogowano pomyślnie",
        description: "Witamy z powrotem!"
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast({
        title: "Wylogowano pomyślnie"
      });
      
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    } catch (error) {
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
