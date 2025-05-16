
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { getUserProfile, UserProfile } from '@/services/userService';

// Extend User type to include profile data
export interface ExtendedUser extends User {
  name?: string;
  lastName?: string;
  profilePicture?: string;
  jobTitle?: string;
  bio?: string;
  role?: string;
  profile?: UserProfile;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  register: (email: string, password: string, name?: string) => Promise<{ error: any | null, user: any | null }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any | null }>;
  resetPassword: (password: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Update user state with profile data
  const updateUserWithProfile = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    try {
      const profile = await fetchUserProfile(authUser.id);
      
      const extendedUser: ExtendedUser = {
        ...authUser,
        ...profile,
        profile,
      };
      
      setUser(extendedUser);
    } catch (error) {
      console.error('Error updating user with profile:', error);
      setUser(authUser as ExtendedUser);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      await updateUserWithProfile(authUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  useEffect(() => {
    async function loadUserFromSession() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        await updateUserWithProfile(currentSession.user);
      }
      
      setLoading(false);
    }
    
    loadUserFromSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      setSession(newSession);
      
      if (newSession?.user) {
        await updateUserWithProfile(newSession.user);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error("Login error:", error);
      return { error };
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      return { error, user: data.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { error, user: null };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { error };
    }
  };

  const resetPassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error };
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!session,
    user,
    session,
    loading,
    login,
    register,
    logout,
    refreshUser,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
