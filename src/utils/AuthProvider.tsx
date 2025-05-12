import React, { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";

// Define extended user profile interface
export interface ExtendedUserProfile {
  name?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  jobTitle?: string | null;
}

// Define auth context type
export interface AuthContextType {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updatePassword: (newPassword: string) => Promise<{ error?: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
}

// Create auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Profile update function
  const updateProfile = async (data: Partial<ExtendedUserProfile>) => {
    try {
      if (!user?.id) return;
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          lastName: data.lastName,
          profilePicture: data.profilePicture,
          bio: data.bio,
          jobTitle: data.jobTitle,
        }
      });
      
      if (error) {
        toast({
          title: "Błąd aktualizacji profilu",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil został pomyślnie zaktualizowany",
      });
    } catch (error: any) {
      toast({
        title: "Błąd aktualizacji profilu",
        description: error.message || "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("Setting up auth state in AuthProvider");
    
    // Function to fetch additional profile data
    const fetchUserProfile = async (currentUser: User) => {
      try {
        // Merge profile data with user
        return {
          ...currentUser,
          name: currentUser.user_metadata?.name || null,
          lastName: currentUser.user_metadata?.lastName || null,
          profilePicture: currentUser.user_metadata?.profilePicture || null,
          bio: currentUser.user_metadata?.bio || null,
          jobTitle: currentUser.user_metadata?.jobTitle || null,
        };
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return currentUser;
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Update session state
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential Supabase auth deadlock
          setTimeout(async () => {
            try {
              // Fetch profile data and update user state
              const extendedUser = await fetchUserProfile(currentSession.user);
              setUser(extendedUser);
              setIsAuthenticated(true);
            } catch (error) {
              console.error("Error processing auth state change:", error);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("Getting session in AuthProvider");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Session data:", currentSession ? "Session exists" : "No session");
        
        if (currentSession?.user) {
          setSession(currentSession);
          
          // Fetch profile data
          const extendedUser = await fetchUserProfile(currentSession.user);
          setUser(extendedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };
    
    // Add a slight delay before checking session
    const timer = setTimeout(() => {
      checkSession();
    }, 100);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [toast]);

  // Sign In function
  const signIn = async (email: string, password: string, remember = false) => {
    try {
      console.log("Attempting to sign in:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        return { error };
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  // Sign Out function
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

  // Reset Password function
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

  // Update Password function
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Auth context value
  const value: AuthContextType = {
    user,
    session,
    loading,
    isLoading: loading, // Alias for backward compatibility
    isAuthenticated,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
