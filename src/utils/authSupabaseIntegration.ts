// Supabase specific integration for authentication
import { supabase } from '@/utils/supabaseClient';
import { users, updateUsersArray, passwords } from './authUtils';
import { User, UserRole } from './authTypes';

export const fetchSupabaseUsers = async (): Promise<void> => {
  try {
    const { data: supaUsers, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Error fetching Supabase users:", error);
      return;
    }

    if (supaUsers) {
      // Map Supabase users to our user format
      const mappedUsers: User[] = supaUsers.users.map(supaUser => {
        // Check if user already exists in our local store
        const existingUser = users.find(u => u.email === supaUser.email);
        
        if (existingUser) {
          return {
            ...existingUser,
            id: supaUser.id,
            email: supaUser.email || existingUser.email,
            lastLogin: supaUser.last_sign_in_at || existingUser.lastLogin,
            createdAt: supaUser.created_at || existingUser.createdAt,
          };
        }

        // Create a new user if they don't exist
        const role: UserRole = supaUser.email === 'patryk.idzikowski@interia.pl' ? 'admin' : 'user';
        
        return {
          id: supaUser.id,
          email: supaUser.email || '',
          name: supaUser.user_metadata?.name || supaUser.email?.split('@')[0] || 'User',
          role,
          profilePicture: supaUser.user_metadata?.avatar_url || '',
          lastName: supaUser.user_metadata?.last_name || '',
          bio: '',
          jobTitle: '',
          postsCreated: 0,
          totalViews: 0,
          createdAt: supaUser.created_at || new Date().toISOString(),
          lastLogin: supaUser.last_sign_in_at || new Date().toISOString(),
          commentsCount: 0,
          likesCount: 0,
          stats: {
            views: 0,
            posts: 0,
            comments: 0,
            likes: 0,
            pointsTotal: 0,
            pointsThisMonth: 0,
            lastUpdated: new Date().toISOString()
          }
        };
      });

      // Update our users array with the mapped users
      updateUsersArray(mappedUsers);
    }
  } catch (error) {
    console.error("Error in fetchSupabaseUsers:", error);
  }
};

export const supabaseSignIn = async (email: string, password: string) => {
  try {
    const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data: supaData, error: supaError };
  } catch (error) {
    console.error('Supabase login error:', error);
    return { data: null, error };
  }
};

export const supabaseSignUp = async (email: string, password: string, userData: any) => {
  try {
    const { data: supaData, error: supaError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    return { data: supaData, error: supaError };
  } catch (error) {
    console.error('Supabase registration error:', error);
    return { data: null, error };
  }
};

export const supabaseSignOut = async () => {
  return supabase.auth.signOut();
};

export const supabaseUpdatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  } catch (error) {
    console.error("Error in supabaseUpdatePassword:", error);
    return { error };
  }
};

export const supabaseCreateUser = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: userData,
    });
    
    return { data, error };
  } catch (error) {
    console.error("Error in supabaseCreateUser:", error);
    return { data: null, error };
  }
};

export const supabaseUpdateUserRole = async (userId: string, role: UserRole) => {
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: role } }
    );
    
    return { data, error };
  } catch (error) {
    console.error("Error in supabaseUpdateUserRole:", error);
    return { data: null, error };
  }
};

export const supabaseDeleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    return { error };
  } catch (error) {
    console.error("Error in supabaseDeleteUser:", error);
    return { error };
  }
};

export const supabaseResetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  } catch (error) {
    console.error("Error in supabaseResetPassword:", error);
    return { error };
  }
};
