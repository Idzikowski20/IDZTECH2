
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { signIn, signOut, resetPassword, updatePassword, updateProfile, refreshUser } from './authIntegration';
import { ExtendedUserProfile } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: (User & ExtendedUserProfile) | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: typeof signIn;
  signOut: typeof signOut;
  resetPassword: typeof resetPassword;
  updatePassword: typeof updatePassword;
  updateProfile: typeof updateProfile;
  getCurrentUser: () => (User & ExtendedUserProfile) | null;
  refreshUser: typeof refreshUser;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.info("Setting up auth provider");

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.info("Auth state changed:", event);
      
      if (currentSession) {
        console.info("Session exists in auth state change");
        setSession(currentSession);
        setUser(currentSession.user as (User & ExtendedUserProfile));
      } else {
        setSession(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Then check for existing session
    const initializeAuth = async () => {
      console.info("Checking for existing session");
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.info("Found existing session:", currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user as (User & ExtendedUserProfile));
        } else {
          console.info("No existing session found");
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getCurrentUser = () => {
    return user;
  };

  const authContextValue: AuthContextProps = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getCurrentUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthProvider;
