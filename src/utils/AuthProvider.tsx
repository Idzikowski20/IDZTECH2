
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Najpierw ustaw nasłuchiwanie zmian stanu autoryzacji
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Aktualizacja czasu ostatniego logowania w profilu, jeśli to zalogowanie
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => {
            updateLastLogin(currentSession.user.id);
          }, 0);
        }
      }
    );

    // Następnie sprawdź istniejącą sesję
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      // Aktualizacja czasu ostatniego logowania dla istniejącej sesji
      if (currentSession?.user) {
        updateLastLogin(currentSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funkcja do aktualizacji czasu ostatniego logowania
  const updateLastLogin = async (userId: string) => {
    try {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Błąd aktualizacji czasu logowania:', error);
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      // Set the session expiration based on rememberMe
      const options = {
        email, 
        password,
        options: {
          // If rememberMe is true, set session to expire in 30 days, otherwise default (1 hour)
          expiresIn: rememberMe ? 60 * 60 * 24 * 30 : undefined
        }
      };

      console.log('Attempting to sign in with:', { email, rememberMe });
      const { error } = await supabase.auth.signInWithPassword(options);
      
      if (error) {
        console.error('SignIn error:', error);
      } else {
        console.log('SignIn successful');
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected SignIn error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Błąd wylogowania:', error);
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
