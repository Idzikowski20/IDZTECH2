import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authStore from './authStore';
import { ExtendedUserProfile } from '@/contexts/AuthContext';
import { User, UserRole } from './authTypes';
import { ensureValidRole } from './roleUtils';

// Type for valid database user roles
type ValidUserRole = 'admin' | 'user' | 'moderator' | 'blogger';

// Map between the UserRole type in our app and the database roles
const mapRoleToDbRole = (role: UserRole): UserRole => {
  return role;
};

// Function to sign in
export const signIn = async (email: string, password: string, remember?: boolean): Promise<{ error: any }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Sign-in error:", error.message);
      return { error: error.message };
    }

    if (remember) {
      // Set the session to be persisted "forever"
      supabase.auth.setSession(data.session);
    }
    return { error: null };
  } catch (err: any) {
    console.error("Unexpected sign-in error:", err.message);
    return { error: err.message };
  }
};

// Function to sign out
export const signOut = async (): Promise<void> => {
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
export const resetPassword = async (email: string): Promise<{ error: any }> => {
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
export const updatePassword = async (newPassword: string): Promise<{ error: any }> => {
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

// Update the updateProfile function to handle the role type conversion
export const updateProfile = async (data: Partial<ExtendedUserProfile>): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    if (!user) throw new Error('No user is currently logged in');
    
    // Process the role to ensure it's a valid UserRole enum value
    const processedData: Partial<ExtendedUserProfile> = { ...data };
    if (data.role !== undefined) {
      processedData.role = ensureValidRole(data.role);
    }
    
    // Now update the metadata with properly typed data
    await supabase.auth.updateUser({
      data: processedData
    });
    
    // After updating the profile, refresh the user stats
    await refreshUser();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Function to refresh user data
export const refreshUser = async (): Promise<void> => {
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
