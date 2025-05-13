
import { supabase } from "@/integrations/supabase/client";
import { sanityClient } from "@/lib/sanity";

// Function to fetch user profile data - tries Sanity first, falls back to Supabase
export const fetchUserProfile = async (userId: string) => {
  try {
    // First try to get user from Sanity
    const query = `*[_type == "user" && (supabaseId == $userId || _id == $userId)][0]{
      name, 
      lastName, 
      profilePicture, 
      bio, 
      jobTitle,
      role
    }`;
    
    const sanityUser = await sanityClient.fetch(query, { userId });
    
    if (sanityUser) {
      return sanityUser;
    }
    
    // Fall back to Supabase during transition
    const { data, error } = await supabase
      .from('profiles')
      .select('name, lastName, profilePicture, bio, jobTitle, role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
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
    // Create in Sanity
    const sanityUser = {
      _type: 'user',
      supabaseId: userId,
      name: name || email.split('@')[0],
      email: email,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    await sanityClient.create(sanityUser);
    
    // Also create in Supabase for transition period
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        name: name || email.split('@')[0],
      });
    
    if (error) {
      console.error('Error creating user profile in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return false;
  }
};

// Function to get user avatar
export const getUserAvatar = async (userId: string) => {
  try {
    // Try Sanity first
    const query = `*[_type == "user" && (supabaseId == $userId || _id == $userId)][0].profilePicture`;
    const profilePicture = await sanityClient.fetch(query, { userId });
    
    if (profilePicture) {
      return profilePicture;
    }
    
    // Fall back to Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('profilePicture')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user avatar from Supabase:', error);
      return null;
    }
    
    return data?.profilePicture || null;
  } catch (error) {
    console.error('Error in getUserAvatar:', error);
    return null;
  }
};
