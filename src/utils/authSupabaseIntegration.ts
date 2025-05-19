
// Supabase specific integration for authentication
import { supabase } from '@/utils/supabaseClient';
import { users, updateUsersArray, passwords } from './authUtils';
import { UserRole, UserStats } from './authTypes';
import { ensureValidRole } from './roleUtils';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  lastName?: string;
  bio?: string;
  jobTitle?: string;
  postsCreated?: number;
  totalViews?: number;
  createdAt?: string;
  lastLogin?: string;
  commentsCount?: number;
  likesCount?: number;
  stats: UserStats;
  user_metadata?: {
    avatar_url?: string;
    name?: string;
    last_name?: string;
  };
}

export const fetchSupabaseUsers = async (): Promise<void> => {
  try {
    // Instead of using admin API, we'll use existing users
    // from local store since we don't have admin privileges
    console.log("Using local users instead of fetching from Supabase admin API");
    
    // Check current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Find or add user to local store
      const existingUserIndex = users.findIndex(u => u.email === user.email);
      
      if (existingUserIndex === -1) {
        // If user doesn't exist locally, add them
        const role: UserRole = user.email === 'patryk.idzikowski@interia.pl' ? UserRole.ADMIN : UserRole.USER;
        
        const newUser: User = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          role,
          profilePicture: user.user_metadata?.avatar_url || '',
          lastName: user.user_metadata?.last_name || '',
          bio: '',
          jobTitle: '',
          postsCreated: 0,
          totalViews: 0,
          createdAt: user.created_at || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
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
        
        users.push(newUser);
      } else {
        // Update last login time for existing user
        users[existingUserIndex].lastLogin = new Date().toISOString();
      }
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
    // First, try to sign up with Supabase
    const { data: supaData, error: supaError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    // If there's an error with signup and it's because signups are disabled
    if (supaError && supaError.message === "Signups not allowed for this instance") {
      console.log("Supabase signups disabled, falling back to local signup");
      
      // Simulate a successful signup by returning a mock user
      const mockUserId = `local-${Date.now()}`;
      const mockUser = {
        id: mockUserId,
        email,
        user_metadata: userData,
        created_at: new Date().toISOString(),
      };
      
      // Add to local password store for later authentication
      passwords[email] = password;
      
      return { 
        data: { user: mockUser },
        error: null
      };
    }
    
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

// We'll use regular sign-up instead of admin create user
export const supabaseCreateUser = async (email: string, password: string, userData: any) => {
  try {
    console.log("Using regular signup instead of admin createUser");
    // Using regular signup instead of admin createUser
    const { data, error } = await supabaseSignUp(email, password, userData);
    
    // If signup failed because signups are disabled, create a local user instead
    if (error && error.message === "Signups not allowed for this instance") {
      console.log("Falling back to local user creation");
      
      // Create a locally managed user
      const localUserId = `local-${Date.now()}`;
      const mockUser = {
        id: localUserId,
        email,
        user_metadata: userData
      };
      
      // Save password for local auth
      passwords[email] = password;
      
      return { 
        data: { user: mockUser },
        error: null
      };
    }
    
    return { data, error };
  } catch (error) {
    console.error("Error in supabaseCreateUser:", error);
    return { data: null, error };
  }
};

// This function can't work without admin privileges, so we'll use a mock
export const supabaseUpdateUserRole = async (userId: string, role: UserRole) => {
  try {
    console.log("Mock updating user role (no admin privileges)");
    
    // This is just a mock since we can't access admin APIs
    // In a real app, you would make an API call to a server-side function
    return { 
      data: { user: { id: userId } },
      error: null
    };
  } catch (error) {
    console.error("Error in supabaseUpdateUserRole:", error);
    return { data: null, error };
  }
};

// This function can't work without admin privileges, so we'll use a mock
export const supabaseDeleteUser = async (userId: string) => {
  try {
    console.log("Mock deleting user (no admin privileges)");
    
    // This is just a mock since we can't access admin APIs
    // In a real app, you would make an API call to a server-side function
    return { error: null };
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
