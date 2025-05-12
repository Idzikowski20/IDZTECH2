
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authStore from './authStore';
import { ExtendedUserProfile } from '@/utils/AuthProvider';

// Check which authentication method is available and use it
export const integrateAuth = async () => {
  try {
    // First check if we have a Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Using Supabase authentication');
      return { 
        provider: 'supabase', 
        session,
        user: {
          ...session.user,
          name: session.user.user_metadata?.name || null,
          lastName: session.user.user_metadata?.lastName || null,
          profilePicture: session.user.user_metadata?.profilePicture || null,
          bio: session.user.user_metadata?.bio || null,
          jobTitle: session.user.user_metadata?.jobTitle || null
        }
      };
    } else {
      // Check if we have a local auth session
      const localUser = await authStore.useAuth.getState().getCurrentUser();
      
      if (localUser) {
        console.log('Using local authentication');
        return { 
          provider: 'local', 
          session: null,
          user: {
            ...localUser,
            name: localUser.name || null,
            lastName: localUser.lastName || null,
            profilePicture: localUser.profilePicture || null,
            bio: localUser.bio || null,
            jobTitle: localUser.jobTitle || null
          }
        };
      }
    }
    
    return { provider: null, session: null, user: null };
  } catch (error) {
    console.error('Error integrating authentication:', error);
    return { provider: null, session: null, user: null };
  }
};

// Handle registration through both systems
export const registerUser = async (email: string, name: string, password: string) => {
  try {
    // First try Supabase
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    // If Supabase signup works, return success
    if (session && !error) {
      console.log('Registered user with Supabase');
      return true;
    }
    
    // If the error is because signups are disabled, try local auth
    if (error && error.message === "Signups not allowed for this instance") {
      console.log('Supabase signups disabled, using local auth');
      const success = await authStore.useAuth.getState().register(email, name, password);
      
      if (success) {
        console.log('Registered user with local auth');
        return true;
      }
    }
    
    // If we get here, registration failed
    return false;
  } catch (error) {
    console.error('Error during registration:', error);
    return false;
  }
};

// Handle login through both systems
export const loginUser = async (email: string, password: string) => {
  try {
    // First try Supabase
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // If Supabase login works, return success
    if (session && !error) {
      console.log('Logged in with Supabase');
      return { 
        success: true, 
        provider: 'supabase',
        data: { session },
        error: null
      };
    }
    
    // Try local auth if Supabase fails
    if (!session || error) {
      console.log('Supabase login failed, trying local auth');
      const success = await authStore.useAuth.getState().login(email, password);
      
      if (success) {
        console.log('Logged in with local auth');
        const user = await authStore.useAuth.getState().getCurrentUser();
        
        return { 
          success: true, 
          provider: 'local', 
          data: { user },
          error: null
        };
      }
    }
    
    // If we get here, login failed
    return { 
      success: false, 
      provider: null, 
      data: null, 
      error: error || { message: 'Invalid credentials' } 
    };
  } catch (error) {
    console.error('Error during login:', error);
    return { 
      success: false, 
      provider: null,
      data: null,
      error 
    };
  }
};

// Update user profile in the appropriate system
export const updateUserProfile = async (userId: string, userData: Partial<ExtendedUserProfile>) => {
  try {
    // First check if user exists in Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && session.user.id === userId) {
      // Update Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      return { success: !error, error };
    } else {
      // Update local user
      const success = await authStore.useAuth.getState().updateUser(userId, userData);
      return { success, error: success ? null : new Error('Failed to update user') };
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};
