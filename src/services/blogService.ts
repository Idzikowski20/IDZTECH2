
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
  meta_title: string;
  meta_description: string;
  meta_tags: string;
  created_at: string;
  updated_at: string;
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
  
  return data || [];
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
  }
  
  return data;
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
  
  return data;
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
  
  return data;
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
