
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

// Extended user profile interface to include additional fields
export interface ExtendedUserProfile {
  name?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  jobTitle?: string | null;
}

interface AuthContextType {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("AuthProvider initialized, current path:", location.pathname);
  
  // Function to fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, lastName, profilePicture, bio, jobTitle')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Update the user profile in the database and local state
  const updateProfile = async (profileData: Partial<ExtendedUserProfile>) => {
    if (!user?.id) {
      console.error('Cannot update profile: No user is logged in');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Błąd aktualizacji profilu",
          description: error.message || "Nie udało się zaktualizować profilu",
          variant: "destructive"
        });
        throw error;
      }

      // Update the local state
      setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...profileData };
      });

      toast({
        title: "Profil zaktualizowany",
        description: "Twoje dane zostały pomyślnie zaktualizowane"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
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
        
        setLoading(false);
        
        // Handle redirection on login
        if (event === 'SIGNED_IN') {
          toast({
            title: "Zalogowano pomyślnie",
            description: "Witamy z powrotem!"
          });
          
          // Use setTimeout to break the potential synchronous loop
          if (location.pathname === '/login') {
            console.log("Redirecting to /admin after login");
            setTimeout(() => {
              navigate('/admin');
            }, 0);
          }
        }
      }
    );
    
    // Then check existing session
    const checkSession = async () => {
      try {
        console.log("Getting session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session data:", currentSession ? "Session exists" : "No session");
        
        setSession(currentSession);
        
        if (currentSession?.user) {
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
      } 
      
      return { error };
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
      
      // Use setTimeout to avoid potential router issues
      setTimeout(() => {
        navigate('/');
      }, 0);
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

  const value = {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
