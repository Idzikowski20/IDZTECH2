
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

// Function to enable RLS on CMS tables
export const enableRLSOnCMSTables = async (): Promise<{success: boolean; message: string}> => {
  try {
    // Enable RLS on cms_content table
    const { error: contentError } = await supabase.rpc('enable_rls_on_cms_content');
    
    if (contentError) {
      console.error('Error enabling RLS for cms_content:', contentError);
      return { success: false, message: `Error for cms_content: ${contentError.message}` };
    }
    
    // Enable RLS on cms_pages table
    const { error: pagesError } = await supabase.rpc('enable_rls_on_cms_pages');
    
    if (pagesError) {
      console.error('Error enabling RLS for cms_pages:', pagesError);
      return { success: false, message: `Error for cms_pages: ${pagesError.message}` };
    }
    
    return { success: true, message: 'RLS has been successfully enabled for CMS tables' };
  } catch (error: any) {
    console.error('Error enabling RLS:', error);
    return { success: false, message: `An error occurred: ${error.message}` };
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

// Function to get a single page by slug
export const getCMSPageBySlug = async (slug: string): Promise<CMSPage | null> => {
  try {
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching CMS page by slug:', error);
      return null;
    }
    
    return data as CMSPage;
  } catch (error) {
    console.error('Error in getCMSPageBySlug:', error);
    return null;
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

// Function to create or update a page
export const createOrUpdateCMSPage = async (page: Partial<CMSPage> & { slug: string }): Promise<CMSPage | null> => {
  try {
    // Check if page exists
    const { data: existingPage } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('slug', page.slug)
      .single();
    
    let result;
    
    if (existingPage) {
      // Update existing page
      result = await supabase
        .from('cms_pages')
        .update({
          title: page.title,
          meta_description: page.meta_description,
          meta_keywords: page.meta_keywords,
          status: page.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPage.id)
        .select();
    } else {
      // Insert new page
      result = await supabase
        .from('cms_pages')
        .insert({
          title: page.title || 'New Page',
          slug: page.slug,
          meta_description: page.meta_description || '',
          meta_keywords: page.meta_keywords || '',
          status: page.status || 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
    }
    
    if (result.error) {
      console.error('Error creating/updating CMS page:', result.error);
      return null;
    }
    
    return (result.data && result.data[0]) ? result.data[0] as CMSPage : null;
  } catch (error) {
    console.error('Error in createOrUpdateCMSPage:', error);
    return null;
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
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return data.role === 'admin' || data.role === 'moderator';
  } catch (error) {
    console.error('Error checking user roles:', error);
    return false;
  }
};

// Make specific user an admin (required for our fixes)
export const makeUserAdmin = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email);
    
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
    const { error } = await supabase
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

// Function to fetch all contents for a page
export const getAllCMSContentForPage = async (pageId: string): Promise<CMSContent[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('page_id', pageId);
    
    if (error) {
      console.error('Error fetching page contents:', error);
      return [];
    }
    
    return data as CMSContent[];
  } catch (error) {
    console.error('Error in getAllCMSContentForPage:', error);
    return [];
  }
};

// Initialize default pages if they don't exist
export const initializeDefaultPages = async (): Promise<boolean> => {
  try {
    // Create homepage if it doesn't exist
    const homePage = await createOrUpdateCMSPage({
      title: 'Strona Główna',
      slug: 'home',
      meta_description: 'Strona główna IDZ.TECH',
      status: 'published'
    });
    
    if (!homePage) return false;
    
    // Create about page if it doesn't exist
    await createOrUpdateCMSPage({
      title: 'O Nas',
      slug: 'about',
      meta_description: 'O firmie IDZ.TECH',
      status: 'published'
    });
    
    // Create contact page if it doesn't exist
    await createOrUpdateCMSPage({
      title: 'Kontakt',
      slug: 'contact',
      meta_description: 'Skontaktuj się z IDZ.TECH',
      status: 'published'
    });
    
    return true;
  } catch (error) {
    console.error('Error in initializeDefaultPages:', error);
    return false;
  }
};
