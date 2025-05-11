
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedUserProfile } from "@/contexts/AuthContext";
import { fetchUserProfile } from "@/utils/profileUtils";

export const useAuthState = (navigate: any, location: any) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  console.log("useAuthState initialized, current path:", location.pathname);

  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // Create a flag to prevent duplicate initializations
    let initiated = false;
    let processingAuth = false;

    // First set up auth state listener (before checking session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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
                  // Fetch additional profile data if user is logged in
                  const profileData = await fetchUserProfile(currentSession.user.id);
                  
                  // Merge Supabase user with profile data
                  setUser({
                    ...currentSession.user,
                    name: profileData?.name || null,
                    lastName: profileData?.lastName || null,
                    profilePicture: profileData?.profilePicture || null,
                    bio: profileData?.bio || null,
                    jobTitle: profileData?.jobTitle || null
                  });
                  
                  setIsAuthenticated(true);
                  
                  // Handle redirection on login
                  if (event === 'SIGNED_IN' && location.pathname === '/login') {
                    console.log("Redirecting to /admin after login");
                    navigate('/admin');
                  }
                } catch (error) {
                  console.error("Error processing auth state change:", error);
                } finally {
                  processingAuth = false;
                }
              }, 0);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setSession(null);
            processingAuth = false;
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
          processingAuth = false;
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      if (initiated) return;
      
      try {
        console.log("Getting session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session data:", currentSession ? "Session exists" : "No session");
        
        if (currentSession?.user) {
          initiated = true;
          setSession(currentSession);
          
          // Fetch additional profile data if user is logged in
          const profileData = await fetchUserProfile(currentSession.user.id);
          
          // Merge Supabase user with profile data
          setUser({
            ...currentSession.user,
            name: profileData?.name || null,
            lastName: profileData?.lastName || null,
            profilePicture: profileData?.profilePicture || null,
            bio: profileData?.bio || null,
            jobTitle: profileData?.jobTitle || null
          });
          
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
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
