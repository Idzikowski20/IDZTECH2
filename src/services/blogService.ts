
import { supabase } from '@/utils/supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featured_image: string;
  date: string;
  categories: string[];
  tags: string[];
  views: number;
  author_id: string;
  created_at: string;
  updated_at: string;
  // Make SEO fields optional with ? since they might not exist in older records
  meta_title?: string;
  meta_description?: string;
  meta_tags?: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role?: string;
  jobTitle?: string;
}

// Pobierz wszystkie posty
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
  
  // Ensure all posts have the required SEO fields
  return (data || []).map(post => ({
    ...post,
    meta_title: post.meta_title || post.title,
    meta_description: post.meta_description || post.summary,
    meta_tags: post.meta_tags || (post.tags ? post.tags.join(', ') : '')
  } as BlogPost));
};

// Pobierz post według sluga
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Kod dla "nie znaleziono"
      return null;
    }
    console.error('Error fetching post:', error);
    throw new Error('Failed to fetch post');
  }
  
  // Zwiększenie liczby wyświetleń
  if (data) {
    await incrementPostViews(data.id);
    
    // Ensure the post has the required SEO fields
    return {
      ...data,
      meta_title: data.meta_title || data.title,
      meta_description: data.meta_description || data.summary,
      meta_tags: data.meta_tags || (data.tags ? data.tags.join(', ') : '')
    } as BlogPost;
  }
  
  return null;
};

// Zwiększ licznik wyświetleń
export const incrementPostViews = async (postId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_post_views', { post_id: postId });
  
  if (error) {
    console.error('Error incrementing views:', error);
  }
};

// Pobierz autora posta
export const getAuthorById = async (authorId: string): Promise<BlogAuthor | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authorId)
    .single();
  
  if (error) {
    console.error('Error fetching author:', error);
    return null;
  }
  
  return data;
};

// Utwórz nowy post
export const createPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      views: 0,
      date: post.date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  // Aktualizacja sitemap
  try {
    await updateSitemap(post.slug);
  } catch (err) {
    console.error('Error updating sitemap:', err);
  }
  
  // Ensure the post has the required SEO fields
  return {
    ...data,
    meta_title: data.meta_title || data.title,
    meta_description: data.meta_description || data.summary,
    meta_tags: data.meta_tags || (data.tags ? data.tags.join(', ') : '')
  } as BlogPost;
};

// Zaktualizuj istniejący post
export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      ...post,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }

  // Aktualizacja sitemap
  if (post.slug) {
    try {
      await updateSitemap(post.slug);
    } catch (err) {
      console.error('Error updating sitemap:', err);
    }
  }
  
  // Ensure the post has the required SEO fields
  return {
    ...data,
    meta_title: data.meta_title || data.title,
    meta_description: data.meta_description || data.summary,
    meta_tags: data.meta_tags || (data.tags ? data.tags.join(', ') : '')
  } as BlogPost;
};

// Usuń post
export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

// Aktualizacja sitemap.xml
const updateSitemap = async (slug: string): Promise<void> => {
  // Wywołaj edge function, która zaktualizuje sitemap.xml
  const { error } = await supabase.functions.invoke('update-sitemap', {
    body: { slug }
  });
  
  if (error) {
    console.error('Error updating sitemap:', error);
    throw new Error('Failed to update sitemap');
  }
};
