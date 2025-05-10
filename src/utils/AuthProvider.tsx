
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Extended user type to include profile properties
interface ExtendedUser extends User {
  name?: string;
  lastName?: string;
  profilePicture?: string;
  role?: string;
  bio?: string;
  jobTitle?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Sync fetch to get profile data after login
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, lastName, profilePicture')
              .eq('id', currentSession.user.id)
              .maybeSingle();
            
            // Extend the user object with profile data
            const extendedUser: ExtendedUser = {
              ...currentSession.user,
              name: profile?.name || '',
              lastName: profile?.lastName || '',
              profilePicture: profile?.profilePicture || ''
            };
            
            setUser(extendedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(currentSession.user as ExtendedUser);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
        
        // Update last login time if this is a sign in event
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            updateLastLogin(currentSession.user.id);
          }, 0);
        }
      }
    );

    // Then check existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, lastName, profilePicture')
              .eq('id', currentSession.user.id)
              .maybeSingle();
            
            // Extend the user object with profile data
            const extendedUser: ExtendedUser = {
              ...currentSession.user,
              name: profile?.name || '',
              lastName: profile?.lastName || '',
              profilePicture: profile?.profilePicture || ''
            };
            
            setUser(extendedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(currentSession.user as ExtendedUser);
            setIsAuthenticated(true);
          }
        }
        
        setSession(currentSession);
        setLoading(false);
        
        // Update last login time for existing session
        if (currentSession?.user) {
          updateLastLogin(currentSession.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to update last login time
  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating login time:', error);
    }
  };

  const signIn = async (email: string, password: string, remember = false) => {
    console.log("Attempting sign in with:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      console.log("Sign in response:", data, error);
      
      // If remember me is checked and login was successful
      if (remember && !error && data.session) {
        // The session expiry is handled by Supabase through browser localStorage
        console.log("Remember me enabled");
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
