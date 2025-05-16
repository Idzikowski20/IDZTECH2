
import { supabase } from "@/integrations/supabase/client";

// Function to fetch user profile data from profiles table
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, lastName, profilePicture, bio, jobTitle')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Function to create a new profile if one doesn't exist
export const createUserProfile = async (userId: string, email: string, name: string | null = null) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        name
      });
    
    if (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return false;
  }
};
