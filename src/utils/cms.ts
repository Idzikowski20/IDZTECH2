
import { supabase } from "@/integrations/supabase/client";

// Define proper types for CMS data
export interface CMSContent {
  id?: string;
  title: string;
  content: string;
  page_slug: string;
  section_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CMSPage {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Function to fetch all CMS content
export async function getAllContent() {
  const { data, error } = await supabase
    .from("cms_content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching CMS content:", error);
    throw error;
  }

  return data as CMSContent[];
}

// Get content by page slug
export async function getContentByPage(pageSlug: string) {
  const { data, error } = await supabase
    .from("cms_content")
    .select("*")
    .eq("page_slug", pageSlug);

  if (error) {
    console.error(`Error fetching content for page ${pageSlug}:`, error);
    throw error;
  }

  return data as CMSContent[];
}

// Get specific content by ID
export async function getContentById(id: string) {
  const { data, error } = await supabase
    .from("cms_content")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching content with ID ${id}:`, error);
    throw error;
  }

  return data as CMSContent;
}

// Save or update CMS content
export async function saveContent(content: CMSContent) {
  let operation;

  if (content.id) {
    // Update existing content
    operation = supabase
      .from("cms_content")
      .update({
        title: content.title,
        content: content.content,
        page_slug: content.page_slug,
        section_id: content.section_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", content.id);
  } else {
    // Insert new content
    operation = supabase.from("cms_content").insert([
      {
        title: content.title,
        content: content.content,
        page_slug: content.page_slug,
        section_id: content.section_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  const { data, error } = await operation;

  if (error) {
    console.error("Error saving CMS content:", error);
    throw error;
  }

  return data;
}

// Delete CMS content
export async function deleteContent(id: string) {
  const { data, error } = await supabase
    .from("cms_content")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting content with ID ${id}:`, error);
    throw error;
  }

  return data;
}

// Get all pages
export async function getAllPages() {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching CMS pages:", error);
    throw error;
  }

  return data as CMSPage[];
}

// Get page by slug
export async function getPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which we might expect
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw error;
  }

  return data as CMSPage | null;
}

// Save or update CMS page
export async function savePage(page: CMSPage) {
  let operation;

  if (page.id) {
    // Update existing page
    operation = supabase
      .from("cms_pages")
      .update({
        title: page.title,
        slug: page.slug,
        description: page.description,
        is_published: page.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", page.id);
  } else {
    // Insert new page
    operation = supabase.from("cms_pages").insert([
      {
        title: page.title,
        slug: page.slug,
        description: page.description,
        is_published: page.is_published !== undefined ? page.is_published : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  const { data, error } = await operation;

  if (error) {
    console.error("Error saving CMS page:", error);
    throw error;
  }

  return data;
}

// Delete CMS page
export async function deletePage(id: string) {
  const { data, error } = await supabase
    .from("cms_pages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting page with ID ${id}:`, error);
    throw error;
  }

  return data;
}
