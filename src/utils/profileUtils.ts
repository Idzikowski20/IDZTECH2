
import { supabase } from "@/integrations/supabase/client";

// Function to fetch user data and extract profile information from metadata
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error fetching user data:', authError);
      return null;
    }
    
    if (authData?.user) {
      return {
        name: authData.user.user_metadata?.name,
        lastName: authData.user.user_metadata?.lastName,
        profilePicture: authData.user.user_metadata?.profilePicture,
        bio: authData.user.user_metadata?.bio,
        jobTitle: authData.user.user_metadata?.jobTitle,
        role: authData.user.user_metadata?.role || 'user'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Function to create/update user metadata
export const createUserProfile = async (userId: string, email: string, name: string | null = null) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        email,
        name,
        created_at: new Date().toISOString()
      }
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
