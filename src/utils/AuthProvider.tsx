
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

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
    // Najpierw ustaw nasłuchiwanie zmian stanu autoryzacji
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile data to get name and profile picture
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, profilePicture')
            .eq('id', currentSession.user.id)
            .single();
          
          // Extend the user object with profile data
          const extendedUser: ExtendedUser = {
            ...currentSession.user,
            name: profile?.name || '',
            profilePicture: profile?.profilePicture || ''
          };
          
          setUser(extendedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        
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
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Fetch user profile data to get name and profile picture
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, profilePicture')
          .eq('id', currentSession.user.id)
          .single();
        
        // Extend the user object with profile data
        const extendedUser: ExtendedUser = {
          ...currentSession.user,
          name: profile?.name || '',
          profilePicture: profile?.profilePicture || ''
        };
        
        setUser(extendedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
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

  const signIn = async (email: string, password: string, remember = false) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      // If remember me is checked, set session expiry to 30 days
      if (remember && !error) {
        // The session expiry is handled by Supabase automatically based on the expiresIn value
        // Note: Setting session expiry needs to be done on the server side or through config
        // This is handled through browser localStorage retention
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
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
