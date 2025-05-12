
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

// Funkcja do włączenia RLS na tabelach CMS
export const enableRLSOnCMSTables = async (): Promise<{success: boolean; message: string}> => {
  try {
    // Włącz RLS na tabeli cms_content
    const { error: contentError } = await supabase.rpc('enable_rls_on_cms_content');
    
    if (contentError) {
      console.error('Błąd przy włączaniu RLS dla cms_content:', contentError);
      return { success: false, message: `Błąd dla cms_content: ${contentError.message}` };
    }
    
    // Włącz RLS na tabeli cms_pages
    const { error: pagesError } = await supabase.rpc('enable_rls_on_cms_pages');
    
    if (pagesError) {
      console.error('Błąd przy włączaniu RLS dla cms_pages:', pagesError);
      return { success: false, message: `Błąd dla cms_pages: ${pagesError.message}` };
    }
    
    return { success: true, message: 'RLS zostało pomyślnie włączone dla tabel CMS' };
  } catch (error: any) {
    console.error('Błąd podczas włączania RLS:', error);
    return { success: false, message: `Wystąpił błąd: ${error.message}` };
  }
};

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
          content: content.content || '',
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
      .from('profiles')
      .select('role')
      .eq('id', userId)
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

// Make specific user an admin (required for our fixes)
export const makeUserAdmin = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email)
      .select();
    
    if (error) {
      console.error('Error making user admin:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in makeUserAdmin:', error);
    return false;
  }
};

// Delete all users except one admin
export const deleteAllUsersExceptAdmin = async (adminEmail: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .neq('email', adminEmail);
      
    if (error) {
      console.error('Error deleting users:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteAllUsersExceptAdmin:', error);
    return false;
  }
};
