
import { supabase } from '@/integrations/supabase/client';

// Function to get the current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error.message);
    return {
      session: null,
      user: null
    };
  }
  return {
    session: session,
    user: session?.user || null
  };
};

// Function to sign in
export const signIn = async (email: string, password: string, remember?: boolean) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error("Sign-in error:", error.message);
      return { error: error.message };
    }

    if (remember && data) {
      // Set the session to be persisted "forever"
      supabase.auth.setSession(data.session);
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error("Unexpected sign-in error:", err.message);
    return { error: err.message };
  }
};

// Function to sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out error:", error.message);
    }
  } catch (err: any) {
    console.error("Unexpected sign-out error:", err.message);
  }
};

// Function to reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      console.error("Password reset error:", error.message);
      return { error: error.message };
    }

    return { error: null };
  } catch (err: any) {
    console.error("Unexpected password reset error:", err.message);
    return { error: err.message };
  }
};

// Function to update password
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password update error:", error.message);
      return { error: error.message };
    }

    return { error: null };
  } catch (err: any) {
    console.error("Unexpected password update error:", err.message);
    return { error: err.message };
  }
};

// Function to refresh user data
export const refreshUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error refreshing user:", error.message);
      return;
    }

    if (data.user) {
      // The user data is automatically updated in the Supabase auth state.
      console.log("User data refreshed successfully.");
    }
  } catch (err: any) {
    console.error("Unexpected error refreshing user:", err.message);
  }
};
