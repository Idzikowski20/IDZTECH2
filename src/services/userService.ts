
import { supabase } from '@/utils/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  jobTitle?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

// Pobierz profil użytkownika
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Zaktualizuj profil użytkownika
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
  
  return data;
};

// Załaduj dane użytkownika z auth
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
  
  if (user) {
    // Pobierz również profil
    const profile = await getUserProfile(user.id);
    return { ...user, profile };
  }
  
  return null;
};
