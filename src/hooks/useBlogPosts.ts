
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define a simpler type for blog posts without author_id and updated_at
type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  featured_image: string
  summary: string | null
  excerpt: string | null
  categories: string[] | null
  tags: string[] | null
  created_at: string
  published: boolean
  published_at: string | null
}

export function useBlogPosts() {
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      console.log('Fetching blog posts...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, featured_image, summary, excerpt, categories, tags, created_at, published, published_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      
      console.log('Blog posts fetched:', data);
      return data as BlogPost[];
    }
  });

  // Fetch single post by slug
  const getPost = (slug: string) => {
    return useQuery({
      queryKey: ['blog-post', slug],
      queryFn: async () => {
        console.log(`Fetching blog post with slug: ${slug}`);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, content, featured_image, summary, excerpt, categories, tags, created_at, published, published_at')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching blog post:', error);
          throw error;
        }
        
        console.log('Blog post fetched:', data);
        return data as BlogPost;
      },
      enabled: !!slug
    });
  };

  // Create new post - adding a hardcoded author_id for compatibility
  const createPost = useMutation({
    mutationFn: async (newPost: Omit<BlogPost, 'id'>) => {
      // Create a post object with author_id for compatibility with Supabase
      const postWithAuthorId = {
        ...newPost,
        author_id: '00000000-0000-0000-0000-000000000000' // Dummy ID
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postWithAuthorId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    }
  });

  // Update post - no need for author_id
  const updatePost = useMutation({
    mutationFn: async ({ id, ...updates }: BlogPost) => {
      const postWithAuthorId = {
        ...updates,
        author_id: '00000000-0000-0000-0000-000000000000' // Dummy ID for compatibility
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postWithAuthorId)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', data.slug] });
    }
  });

  // Delete post
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    }
  });

  return {
    posts,
    isLoadingPosts,
    error,
    getPost,
    createPost,
    updatePost,
    deletePost
  };
}
