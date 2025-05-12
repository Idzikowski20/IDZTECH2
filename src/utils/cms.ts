
import { supabase } from './supabaseClient';

// Types for CMS content
export interface CMSContent {
  id: string;
  page_id: string;
  section_id: string;
  content_type: 'text' | 'html' | 'image' | 'video';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  meta_keywords: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

// Functions to get CMS content
export const getCMSContent = async (pageId: string, sectionId: string): Promise<CMSContent | null> => {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('page_id', pageId)
      .eq('section_id', sectionId)
      .single();
    
    if (error) {
      console.error('Error fetching CMS content:', error);
      return null;
    }
    
    return data as CMSContent;
  } catch (error) {
    console.error('Error in getCMSContent:', error);
    return null;
  }
};

// Function to get all pages
export const getCMSPages = async (): Promise<CMSPage[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching CMS pages:', error);
      return [];
    }
    
    return data as CMSPage[];
  } catch (error) {
    console.error('Error in getCMSPages:', error);
    return [];
  }
};

// Function to update CMS content (for admins/moderators)
export const updateCMSContent = async (
  content: Partial<CMSContent> & { page_id: string, section_id: string }
): Promise<boolean> => {
  try {
    // Check if content exists
    const { data: existingContent } = await supabase
      .from('cms_content')
      .select('id')
      .eq('page_id', content.page_id)
      .eq('section_id', content.section_id)
      .single();
    
    let result;
    
    if (existingContent) {
      // Update existing content
      result = await supabase
        .from('cms_content')
        .update({
          content: content.content,
          content_type: content.content_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingContent.id);
    } else {
      // Insert new content
      result = await supabase
        .from('cms_content')
        .insert({
          page_id: content.page_id,
          section_id: content.section_id,
          content: content.content,
          content_type: content.content_type || 'text',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    if (result.error) {
      console.error('Error updating CMS content:', result.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCMSContent:', error);
    return false;
  }
};

// Function to check if user is admin/moderator
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .in('role', ['admin', 'moderator'])
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking user roles:', error);
    return false;
  }
};
