
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authStore from './authStore';
import { ExtendedUserProfile } from '@/contexts/AuthContext';
import { User, UserRole } from './authTypes';

// Type for valid database user roles
type ValidUserRole = 'admin' | 'editor' | 'user';

// Map between the UserRole type in our app and the database roles
const mapRoleToDbRole = (role: UserRole): ValidUserRole => {
  switch(role) {
    case 'admin': return 'admin';
    case 'moderator': 
    case 'blogger': return 'editor'; // Map moderator and blogger to editor
    default: return 'user';
  }
};

// Fixed: Function to safely convert string to UserRole
const safeUserRole = (role: string | undefined | null): UserRole => {
  if (role === 'admin' || role === 'moderator' || role === 'blogger' || role === 'user') {
    return role as UserRole;
  }
  return 'user';
};

// Check which authentication method is available and use it
export const integrateAuth = async () => {
  try {
    // First check if we have a Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Using Supabase authentication');
      
      // Get profile data if available
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      return { 
        provider: 'supabase', 
        session,
        user: {
          ...session.user,
          // Map database fields correctly to application fields
          name: profileData?.first_name || session.user.user_metadata?.name || null,
          lastName: profileData?.last_name || session.user.user_metadata?.lastName || null,
          profilePicture: profileData?.avatar_url || session.user.user_metadata?.profilePicture || null,
          bio: session.user.user_metadata?.bio || null, // Bio not in users table, get from metadata
          jobTitle: session.user.user_metadata?.jobTitle || null, // jobTitle not in users table, get from metadata
          role: profileData?.role || session.user.user_metadata?.role || 'user',
          // Needed for compatibility with local auth
          createdAt: profileData?.created_at || session.user.created_at || new Date().toISOString()
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
    
    // If Supabase signup works, create a profile
    if (data.user && !error) {
      console.log('Registered user with Supabase');
      
      // Create user entry
      const { error: profileError } = await supabase.from('users').upsert({
        id: data.user.id,
        email: data.user.email,
        first_name: name,
        created_at: new Date().toISOString()
      });
      
      if (profileError) {
        console.error("Error creating user:", profileError);
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
      
      // Check if profile exists, if not create it
      const { data: profileData } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      if (!profileData) {
        const { error: profileError } = await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.name || email.split('@')[0],
          created_at: new Date().toISOString()
        });
        
        if (profileError) {
          console.error("Error creating profile during login:", profileError);
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
      const { data } = await supabase.auth.getUser();
      const userMetaData = data?.user;
      const email = userMetaData?.email || '';
      
      // Convert application field names to database field names
      const dbUserData = {
        id: userId,
        email: email,
        first_name: userData.name,
        last_name: userData.lastName,
        avatar_url: userData.profilePicture,
        // Only include role if it's a valid value for our schema
        ...(userData.role ? { role: mapRoleToDbRole(safeUserRole(userData.role as string)) } : {})
      };
      
      // Update Supabase profile
      const { error: profileError } = await supabase
        .from('users')
        .upsert(dbUserData);
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
        return { success: false, error: profileError };
      }
      
      // Also update user metadata in Supabase Auth
      // Fix the type mismatch by explicitly defining the user metadata shape
      const userMetadata: Record<string, any> = {};
      
      // Copy allowed properties to user metadata object 
      if (userData.name !== undefined) userMetadata.name = userData.name;
      if (userData.lastName !== undefined) userMetadata.lastName = userData.lastName;
      if (userData.profilePicture !== undefined) userMetadata.profilePicture = userData.profilePicture;
      if (userData.bio !== undefined) userMetadata.bio = userData.bio;
      if (userData.jobTitle !== undefined) userMetadata.jobTitle = userData.jobTitle;
      if (userData.role !== undefined) userMetadata.role = safeUserRole(userData.role as string);
      
      const { error } = await supabase.auth.updateUser({
        data: userMetadata
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
    console.log('Fetching all users from Supabase users');
    
    // Fetch all profiles from the users table
    const { data: profiles, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    
    return profiles || [];
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
    
    // Map role to valid database enum value
    const role = mapRoleToDbRole(userData.role);
    
    // Create user in Supabase
    const { data: { user }, error } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
      options: {
        data: {
          name: userData.name,
          lastName: userData.lastName,
          role: userData.role // Keep original role in metadata
        }
      }
    });
    
    if (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    }
    
    // Create profile
    if (user) {
      const { error: profileError } = await supabase.from('users').upsert({
        id: user.id,
        email: userData.email,
        first_name: userData.name,
        last_name: userData.lastName,
        role: role,
        avatar_url: userData.profilePicture,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { success: false, error: profileError };
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
    
    // Map the role to valid database enum value
    const dbRole = mapRoleToDbRole(role);
    
    // Update the profile with the new role
    const { error } = await supabase
      .from('users')
      .update({ role: dbRole })
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
    
    // We can't directly delete users from auth.users with the client SDK
    // But we can delete their profile, which is effectively the same for our purposes
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user profile:', error);
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
