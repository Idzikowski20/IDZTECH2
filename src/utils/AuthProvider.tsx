
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
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

// Create auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  // Simplified profile update function
  const updateProfile = async (data: Partial<ExtendedUserProfile>) => {
    try {
      if (!user?.id) return;
      
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

  // Password reset function
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

  // Initialize auth - simplified version to avoid auth deadlocks
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user as User & ExtendedUserProfile);
          setIsAuthenticated(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };
    
    // Set up auth change listener with simplified approach
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user as User & ExtendedUserProfile);
        setIsAuthenticated(true);
      } else {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Simple sign in function - with better error handling
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Logging in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { error };
      }
      
      console.log("Login successful:", data);
      return { data };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
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
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Auth context value
  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
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
