
// Supabase specific integration for authentication
import { supabase } from '@/utils/supabaseClient';
import { users, updateUsersArray, passwords } from './authUtils';
import { User, UserRole } from './authTypes';

export const fetchSupabaseUsers = async (): Promise<void> => {
  try {
    // Zamiast korzystać z admin API, wykorzystamy istniejących użytkowników
    // z lokalnego magazynu, ponieważ nie mamy uprawnień administratora
    console.log("Using local users instead of fetching from Supabase admin API");
    
    // Sprawdź aktualnego użytkownika
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Znajdź lub dodaj użytkownika do lokalnego magazynu
      const existingUserIndex = users.findIndex(u => u.email === user.email);
      
      if (existingUserIndex === -1) {
        // Jeśli użytkownik nie istnieje lokalnie, dodajmy go
        const role: UserRole = user.email === 'patryk.idzikowski@interia.pl' ? 'admin' : 'user';
        
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
          lastLogin: user.last_sign_in_at || new Date().toISOString(),
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
