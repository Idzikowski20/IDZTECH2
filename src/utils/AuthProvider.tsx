import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { User, Session } from "@supabase/supabase-js";
import { integrateAuth, registerUser, loginUser, updateUserProfile } from "./authIntegration";

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
  register: (email: string, name: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updateProfile: (data: Partial<ExtendedUserProfile>) => Promise<void>;
  getCurrentUser: () => (User & ExtendedUserProfile) | null;
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
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (currentSession) {
          console.log("Session exists in auth state change");
          setSession(currentSession);
          
          // Fetch profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          setUser({
            ...currentSession.user,
            name: profileData?.name || currentSession.user.user_metadata?.name || null,
            lastName: profileData?.lastName || currentSession.user.user_metadata?.lastName || null,
            profilePicture: profileData?.profilePicture || currentSession.user.user_metadata?.profilePicture || null,
            bio: profileData?.bio || currentSession.user.user_metadata?.bio || null,
            jobTitle: profileData?.jobTitle || currentSession.user.user_metadata?.jobTitle || null
          });
          setIsAuthenticated(true);
        } else {
          console.log("No session in auth state change");
          
          // Check for local auth before clearing state
          setTimeout(async () => {
            try {
              const localAuth = await integrateAuth();
              
              if (localAuth.user && localAuth.provider === 'local') {
                setUser(localAuth.user as User & ExtendedUserProfile);
                setIsAuthenticated(true);
              } else {
                setSession(null);
                setUser(null);
                setIsAuthenticated(false);
              }
              
              if (isMounted) setLoading(false);
            } catch (error) {
              console.error("Error checking local auth:", error);
              if (isMounted) {
                setSession(null);
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
              }
            }
          }, 0);
        }
      }
    );
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        
        const authResult = await integrateAuth();
        
        if (authResult.user && isMounted) {
          console.log("Found auth session with provider:", authResult.provider);
          
          if (authResult.provider === 'supabase') {
            setSession(authResult.session);
          }
          
          setUser(authResult.user as User & ExtendedUserProfile);
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
  
  // Get current user function
  const getCurrentUser = () => {
    return user;
  };
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      
      setLoading(true);
      const result = await loginUser(email, password);
      
      if (result.error) {
        console.error("Sign in error:", result.error);
        setLoading(false);
        return { error: result.error };
      }
      
      if (result.provider === 'supabase') {
        console.log("Sign in successful with Supabase:", result.data.session?.user?.id);
        // Auth state listener will handle setting the user and session
      } else if (result.provider === 'local') {
        console.log("Sign in successful with local auth:", result.data.user?.id);
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return { data: result.data, error: null };
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
      const { data: { session, user }, error } = await supabase.auth.signUp({
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
      
      // Create profile
      if (user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          name: userData.name,
          created_at: new Date().toISOString()
        });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      console.log("Sign up successful:", user?.id);
      return { data: { session, user }, error: null };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      setLoading(false);
      return { error };
    }
  };

  // Register function (local fallback for when Supabase signups are disabled)
  const register = async (email: string, name: string, password: string) => {
    try {
      setLoading(true);
      
      // Try to sign up with Supabase first
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            full_name: name
          }
        }
      });
      
      if (error) {
        console.log("Supabase registration error, falling back to local auth:", error);
        // Fall back to local auth registration
        const success = await registerUser(email, name, password);
        setLoading(false);
        return success;
      }
      
      // If Supabase registration succeeded, create a profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          created_at: new Date().toISOString()
        });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error in register function:", error);
      setLoading(false);
      return false;
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Try to sign out from Supabase first
      await supabase.auth.signOut();
      
      // Also clean up local auth state
      try {
        const localAuthStore = await import('./authStore');
        await localAuthStore.useAuth.getState().logout();
      } catch (e) {
        console.error("Error signing out from local auth:", e);
      }
      
      // Clear auth state
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
      
      // Make sure we have the user's email for the profile update
      const userEmail = user.email || '';
      
      // Update Supabase profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: userEmail, // Add required email field
          ...data
        });
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }
      
      // Also update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: data
      });
      
      if (userError) {
        console.error("Error updating user metadata:", userError);
        // Continue anyway since we updated the profile
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
    register,
    resetPassword,
    updateProfile,
    getCurrentUser,
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
