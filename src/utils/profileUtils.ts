import { supabase } from "@/integrations/supabase/client";

// Function to fetch user data from users table
export const fetchUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('name, lastName, profilePicture, bio, jobTitle')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    return null;
  }
};

// Function to create a new user if one doesn't exist
export const createUser = async (userId: string, email: string, name: string | null = null) => {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error creating user:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createUser:', error);
    return false;
  }
};
