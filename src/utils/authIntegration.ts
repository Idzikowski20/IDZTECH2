
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authStore from './authStore';
import { ExtendedUserProfile } from '@/utils/AuthProvider';
import { User, UserRole } from './authTypes';
import { sanityClient } from '@/lib/sanity';

// Check which authentication method is available and use it
export const integrateAuth = async () => {
  try {
    // First check if we have a Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Using Supabase authentication');
      
      // Get profile data from Sanity if available
      const query = `*[_type == "user" && supabaseId == $userId][0]`;
      const sanityUser = await sanityClient.fetch(query, { userId: session.user.id });
      
      return { 
        provider: 'supabase', 
        session,
        user: {
          ...session.user,
          name: sanityUser?.name || session.user.user_metadata?.name || null,
          lastName: sanityUser?.lastName || session.user.user_metadata?.lastName || null,
          profilePicture: sanityUser?.profilePicture || session.user.user_metadata?.profilePicture || null,
          bio: sanityUser?.bio || session.user.user_metadata?.bio || null,
          jobTitle: sanityUser?.jobTitle || session.user.user_metadata?.jobTitle || null,
          role: sanityUser?.role || session.user.user_metadata?.role || 'user',
          // Needed for compatibility with local auth
          createdAt: sanityUser?.createdAt || session.user.created_at || new Date().toISOString()
        }
      };
    } else {
      // Check if we have a local auth session
      const localUser = await authStore.useAuth.getState().getCurrentUser();
      
      if (localUser) {
        console.log('Using local authentication');
        
        // Try to get Sanity data for this user
        if (localUser.id) {
          const query = `*[_type == "user" && _id == $userId][0]`;
          const sanityUser = await sanityClient.fetch(query, { userId: localUser.id });
          
          if (sanityUser) {
            return { 
              provider: 'local', 
              session: null,
              user: {
                ...localUser,
                name: sanityUser.name || localUser.name || null,
                lastName: sanityUser.lastName || localUser.lastName || null,
                profilePicture: sanityUser.profilePicture || localUser.profilePicture || null,
                bio: sanityUser.bio || localUser.bio || null,
                jobTitle: sanityUser.jobTitle || localUser.jobTitle || null,
                role: sanityUser.role || localUser.role || 'user'
              }
            };
          }
        }
        
        return { 
          provider: 'local', 
          session: null,
          user: localUser
        };
      }
    }
    
    return { provider: null, session: null, user: null };
  } catch (error) {
    console.error('Error integrating authentication:', error);
    return { provider: null, session: null, user: null };
  }
};

// Create Sanity user from Supabase user
export const createSanityUser = async (user: any) => {
  try {
    // Check if user already exists
    const query = `*[_type == "user" && supabaseId == $userId][0]`;
    const existingUser = await sanityClient.fetch(query, { userId: user.id });
    
    if (!existingUser) {
      // Create new user document
      const newUser = {
        _type: 'user',
        supabaseId: user.id,
        name: user.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        lastName: user.lastName || user.user_metadata?.lastName || '',
        email: user.email,
        role: user.role || user.user_metadata?.role || 'user',
        profilePicture: user.profilePicture || user.user_metadata?.profilePicture || '',
        bio: user.bio || user.user_metadata?.bio || '',
        jobTitle: user.jobTitle || user.user_metadata?.jobTitle || '',
        createdAt: new Date().toISOString()
      };
      
      return await sanityClient.create(newUser);
    }
    
    return existingUser;
  } catch (error) {
    console.error('Error creating Sanity user:', error);
    return null;
  }
};

// Update user profile in Sanity and/or Supabase
export const updateUserProfile = async (userId: string, userData: Partial<ExtendedUserProfile>) => {
  try {
    // First try to update Sanity
    const query = `*[_type == "user" && (supabaseId == $userId || _id == $userId)][0]`;
    const sanityUser = await sanityClient.fetch(query, { userId });
    
    if (sanityUser) {
      await sanityClient
        .patch(sanityUser._id)
        .set({
          name: userData.name,
          lastName: userData.lastName,
          profilePicture: userData.profilePicture,
          bio: userData.bio,
          jobTitle: userData.jobTitle,
          role: userData.role
        })
        .commit();
    } else {
      // If user doesn't exist in Sanity yet, create them
      await createSanityUser({ id: userId, ...userData });
    }
    
    // Also update Supabase profile for backward compatibility 
    // during the transition period
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session && session.user.id === userId) {
      // Get the user email
      const { data: userData: supabaseUserData } = await supabase.auth.getUser();
      const email = supabaseUserData?.user?.email || '';
      
      // Update Supabase profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email,
          ...userData
        });
      
      if (profileError) {
        console.error("Error updating Supabase profile:", profileError);
      }
      
      // Also update user metadata
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) {
        console.error("Error updating Supabase user metadata:", error);
      }
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// Fetch all users from Sanity
export const fetchAllUsers = async () => {
  try {
    console.log('Fetching all users from Sanity');
    
    // Fetch all users from Sanity
    const query = `*[_type == "user"]`;
    const sanityUsers = await sanityClient.fetch(query);
    
    return sanityUsers || [];
  } catch (error) {
    console.error('Error fetching users from Sanity:', error);
    
    // Fall back to Supabase if Sanity fails (during transition)
    try {
      console.log('Falling back to Supabase profiles');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching profiles from Supabase:', error);
        return [];
      }
      
      return profiles || [];
    } catch (supabaseError) {
      console.error('Error in Supabase fallback:', supabaseError);
      return [];
    }
  }
};

// Update a user's role in Sanity
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log('Updating role for user:', userId, 'to', role);
    
    // First check if user exists in Sanity
    const query = `*[_type == "user" && (supabaseId == $userId || _id == $userId)][0]`;
    const sanityUser = await sanityClient.fetch(query, { userId });
    
    if (sanityUser) {
      // Update role in Sanity
      await sanityClient
        .patch(sanityUser._id)
        .set({ role })
        .commit();
      
      // Also update in Supabase for backwards compatibility during transition
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user role in Supabase:', error);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

// Delete a user from Sanity
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    console.log('Deleting user:', userId);
    
    // First check if user exists in Sanity
    const query = `*[_type == "user" && (supabaseId == $userId || _id == $userId)][0]`;
    const sanityUser = await sanityClient.fetch(query, { userId });
    
    if (sanityUser) {
      // Delete from Sanity
      await sanityClient.delete(sanityUser._id);
      
      // Also delete from Supabase for backwards compatibility
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user profile from Supabase:', error);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Add a new user to Sanity
export const addUser = async (userData: any): Promise<{success: boolean, id?: string, error?: any}> => {
  try {
    console.log('Adding new user to Sanity:', userData);
    
    // Create user in Sanity
    const newUser = {
      _type: 'user',
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role || 'user',
      jobTitle: userData.jobTitle || '',
      profilePicture: userData.profilePicture || '',
      bio: userData.bio || '',
      createdAt: new Date().toISOString()
    };
    
    const createdUser = await sanityClient.create(newUser);
    
    if (!createdUser) {
      throw new Error('Failed to create user in Sanity');
    }
    
    return { success: true, id: createdUser._id };
  } catch (error) {
    console.error('Error in addUser:', error);
    return { success: false, error };
  }
};

// Ensure patryk.idzikowski has admin permissions
export const ensureAdminPermissions = async () => {
  try {
    // Search for patryk.idzikowski by email pattern
    const query = `*[_type == "user" && email match "*patryk.idzikowski*"][0]`;
    const user = await sanityClient.fetch(query);
    
    if (user) {
      // Ensure user has admin role
      if (user.role !== 'admin' && user.role !== 'administrator') {
        await sanityClient
          .patch(user._id)
          .set({ role: 'admin' })
          .commit();
        
        console.log('Updated patryk.idzikowski to admin role');
      }
    } else {
      // Create the admin user if not found
      const newAdmin = {
        _type: 'user',
        name: 'Patryk',
        lastName: 'Idzikowski',
        email: 'patryk.idzikowski@example.com', // Update with correct email
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      await sanityClient.create(newAdmin);
      console.log('Created admin user for patryk.idzikowski');
    }
    
    // Also ensure Supabase permissions are set correctly
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', '%patryk.idzikowski%')
      .single();
    
    if (data && data.role !== 'admin' && data.role !== 'administrator') {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.id);
      
      console.log('Updated Supabase role for patryk.idzikowski');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring admin permissions:', error);
    return false;
  }
};

// Delete admin@idztech.pl user
export const deleteAdminUser = async () => {
  try {
    // Check Sanity first
    const query = `*[_type == "user" && email == "admin@idztech.pl"][0]`;
    const sanityUser = await sanityClient.fetch(query);
    
    if (sanityUser) {
      await sanityClient.delete(sanityUser._id);
      console.log('Deleted admin@idztech.pl from Sanity');
    }
    
    // Also check Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@idztech.pl')
      .single();
    
    if (data) {
      await supabase
        .from('profiles')
        .delete()
        .eq('id', data.id);
      
      console.log('Deleted admin@idztech.pl from Supabase');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting admin@idztech.pl:', error);
    return false;
  }
};
