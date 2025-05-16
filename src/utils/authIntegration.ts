import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authStore from './authStore';
import { ExtendedUserProfile } from '@/utils/AuthProvider';
import { User, UserRole } from './authTypes';

// Check which authentication method is available and use it
export const integrateAuth = async () => {
  try {
    // First check if we have a Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Using Supabase authentication');
      
      // Get profile data if available
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      return { 
        provider: 'supabase', 
        session,
        user: {
          ...session.user,
          name: userData?.name || session.user.user_metadata?.name || null,
          lastName: userData?.lastName || session.user.user_metadata?.lastName || null,
          profilePicture: userData?.profilePicture || session.user.user_metadata?.profilePicture || null,
          bio: userData?.bio || session.user.user_metadata?.bio || null,
          jobTitle: userData?.jobTitle || session.user.user_metadata?.jobTitle || null,
          role: userData?.role || session.user.user_metadata?.role || 'user',
          // Needed for compatibility with local auth
          createdAt: userData?.created_at || session.user.created_at || new Date().toISOString()
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    // If Supabase signup works, create a user entry
    if (data.user && !error) {
      console.log('Registered user with Supabase');
      
      // Create user entry
      const { error: userError } = await supabase.from('users').upsert({
        id: data.user.id,
        email: data.user.email,
        name: name,
        created_at: new Date().toISOString()
      });
      
      if (userError) {
        console.error("Error creating user:", userError);
      }
      
      return true;
    }
    
    // If the error is because signups are disabled or other Supabase error, try local auth
    if (error) {
      console.log('Supabase signups error, using local auth:', error.message);
      const success = await authStore.useAuth.getState().register(email, name, password);
      
      if (success) {
        console.log('Registered user with local auth');
        return true;
      }
    }
    
    // If we get here, registration failed
    console.error("Registration failed");
    return false;
  } catch (error) {
    console.error('Error during registration:', error);
    return false;
  }
};

// Handle login through both systems
export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Attempting login with:', email);
    
    // First try Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    // If Supabase login works, return success
    if (data.session && !error) {
      console.log('Logged in with Supabase');
      
      // Check if user entry exists, if not create it
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      if (!userData) {
        const { error: userError } = await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          created_at: new Date().toISOString()
        });
        
        if (userError) {
          console.error("Error creating user during login:", userError);
        }
      }
      
      return { 
        success: true, 
        provider: 'supabase',
        data,
        error: null
      };
    }
    
    // Try local auth if Supabase fails
    if (!data.session || error) {
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
    console.log('Login failed for:', email);
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
      // Get the user email first
      const { data: userDataAuth } = await supabase.auth.getUser();
      const email = userDataAuth?.user?.email || '';
      
      // Update Supabase user entry
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: userId,
          email: email, // Add required email field
          ...userData,
          updated_at: new Date().toISOString()
        });
      
      if (userError) {
        console.error("Error updating user:", userError);
        return { success: false, error: userError };
      }
      
      // Also update user metadata
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

// Fetch all users from Supabase
export const fetchAllUsers = async () => {
  try {
    console.log('Fetching all users from Supabase users table');
    
    // Fetch all users from the users table
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return users || [];
  } catch (error) {
    console.error('Error in fetchAllUsers:', error);
    return [];
  }
};

// Add the missing functions for user management

/**
 * Add a new user to the system
 */
export const addUser = async (userData: any, password: string) => {
  try {
    console.log('Adding new user:', userData);
    
    // Create user in Supabase
    const { data: { user }, error } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
      options: {
        data: {
          name: userData.name,
          lastName: userData.lastName,
          role: userData.role
        }
      }
    });
    
    if (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
    
    // Create user entry
    if (user) {
      const { error: userError } = await supabase.from('users').upsert({
        id: user.id,
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        role: userData.role,
        jobTitle: userData.jobTitle,
        profilePicture: userData.profilePicture,
        bio: userData.bio,
        created_at: new Date().toISOString()
      });
      
      if (userError) {
        console.error('Error creating user:', userError);
        return { success: false, error: userError };
      }
    }
    
    return { success: true, id: user?.id };
  } catch (error) {
    console.error('Error in addUser:', error);
    return { success: false, error };
  }
};

/**
 * Update a user's role
 */
export const updateUserRole = async (userId: string, role: UserRole) => {
  try {
    console.log('Updating role for user:', userId, 'to', role);
    
    // Update the user with the new role
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string) => {
  try {
    console.log('Deleting user:', userId);
    
    // Delete user entry from users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }
    
    // Note: In a production system, you would use supabase admin to delete the actual auth.users entry,
    // or have a server-side function that handles this
    
    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return false;
  }
};
