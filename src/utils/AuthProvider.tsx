
import React, { useState, useEffect, createContext, useContext } from "react";
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
  signIn: (email: string, password: string) => Promise<{ data?: any, error?: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ data?: any, error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & ExtendedUserProfile) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    console.log("Setting up auth provider");
    
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (currentSession) {
          console.log("Session exists in auth state change");
          setSession(currentSession);
          setUser({
            ...currentSession.user,
            name: currentSession.user.user_metadata?.name || null,
            lastName: currentSession.user.user_metadata?.lastName || null,
            profilePicture: currentSession.user.user_metadata?.profilePicture || null,
            bio: currentSession.user.user_metadata?.bio || null,
            jobTitle: currentSession.user.user_metadata?.jobTitle || null
          });
          setIsAuthenticated(true);
        } else {
          console.log("No session in auth state change");
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      }
    );
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data } = await supabase.auth.getSession();
        
        if (data.session && isMounted) {
          console.log("Existing session found:", data.session.user.id);
          setSession(data.session);
          setUser({
            ...data.session.user,
            name: data.session.user.user_metadata?.name || null,
            lastName: data.session.user.user_metadata?.lastName || null,
            profilePicture: data.session.user.user_metadata?.profilePicture || null,
            bio: data.session.user.user_metadata?.bio || null,
            jobTitle: data.session.user.user_metadata?.jobTitle || null
          });
          setIsAuthenticated(true);
        } else {
          console.log("No existing session found");
        }
        
        if (isMounted) setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMounted) setLoading(false);
      }
    };
    
    // Add a slight delay to ensure proper initialization
    setTimeout(() => {
      if (!isMounted) return;
      checkSession();
    }, 100);
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      
      // Use a small delay to prevent potential auth race conditions
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Sign in error:", error);
        setLoading(false);
        return { error };
      }
      
      console.log("Sign in successful:", data?.user?.id);
      // Don't set loading to false here - let the auth state change handle it
      return { data };
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      setLoading(false);
      return { error };
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, userData: any = {}) => {
    try {
      console.log("Attempting to sign up with email:", email);
      
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      setLoading(false);
      
      if (error) {
        console.error("Sign up error:", error);
        return { error };
      }
      
      console.log("Sign up successful:", data?.user?.id);
      return { data };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      setLoading(false);
      return { error };
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setLoading(false);
    } catch (error) {
      console.error("Sign out error:", error);
      setLoading(false);
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
      console.error("Password reset error:", error);
      return { error };
    }
  };
  
  // Profile update function
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
  
  // Auth context value
  const value = {
    user,
    session,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updateProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
