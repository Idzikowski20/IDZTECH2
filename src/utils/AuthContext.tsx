import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

// Extended user profile interface to include additional fields
export interface ExtendedUserProfile {
  name?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  jobTitle?: string | null;
}

export interface AuthContextType {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{data: any, error: any}>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  refreshUserStats: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Use synchronous state updates
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
        setLoading(false);
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got session:", currentSession ? "Yes" : "No");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession?.user);
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Błąd logowania",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Zalogowano pomyślnie",
          description: "Witamy z powrotem!",
        });
      }

      return { data, error };
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast({
        title: "Wylogowano pomyślnie",
      });
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
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

  const updateProfile = async (data: Partial<ExtendedUserProfile>) => {
    try {
      if (!user) return;
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: data
      });

      if (error) throw error;
      
      // Update local state
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

  // Add the register method
  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          }
        }
      });

      if (error) {
        toast({
          title: "Błąd rejestracji",
          description: error.message || "Wystąpił nieoczekiwany błąd",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Rejestracja udana",
        description: "Teraz możesz się zalogować",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
      return false;
    }
  };

  // Add the refreshUserStats method
  const refreshUserStats = () => {
    // Import the actual function to avoid circular dependencies
    const { refreshUserStats: refreshStats } = require('./authStatsFunctions');
    refreshStats();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        register,
        refreshUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
