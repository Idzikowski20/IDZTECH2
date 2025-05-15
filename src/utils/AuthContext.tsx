
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{data: any, error: any}>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Set up auth state listener FIRST (before checking session)
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Use synchronous state updates to prevent deadlocks
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Don't fetch profile data here to avoid Supabase deadlocks
        setLoading(false);
      }
    );
    
    // Check for existing session AFTER setting up the listener
    // Use a small timeout to prevent conflicts with the auth state listener
    setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        console.log("Got session:", currentSession ? "Yes" : "No");
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });
    }, 100);
    
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
      navigate('/login');
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

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
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
