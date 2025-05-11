
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("AuthProvider initialized, current path:", location.pathname);
  
  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsAuthenticated(!!currentSession?.user);
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
        setUser(currentSession?.user || null);
        setIsAuthenticated(!!currentSession?.user);
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
