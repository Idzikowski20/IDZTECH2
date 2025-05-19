
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Sample fallback data - used when Supabase connection fails
const fallbackPosts: BlogPost[] = [
  {
    id: 'fallback-1',
    title: 'Co to jest SEO i dlaczego jest ważne dla biznesu',
    slug: 'co-to-jest-seo',
    content: '<p>SEO (Search Engine Optimization) to zestaw praktyk mających na celu zwiększenie widoczności strony internetowej w wynikach wyszukiwania. Dowiedz się więcej o tym, jak SEO może pomóc Twojemu biznesowi.</p>',
    featured_image: '/lovable-uploads/97ac4bd6-784a-468e-8520-021492b8878d.png',
    summary: 'Podstawy SEO i jego wpływ na marketing internetowy',
    excerpt: 'Podstawy SEO i jego wpływ na marketing internetowy',
    categories: ['SEO', 'Marketing'],
    tags: ['pozycjonowanie', 'google', 'marketing cyfrowy'],
    created_at: '2025-01-15T10:00:00Z',
    published: true,
    published_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'fallback-2',
    title: 'Najlepsze praktyki optymalizacji strony na urządzenia mobilne',
    slug: 'optymalizacja-mobile',
    content: '<p>W dzisiejszych czasach większość ruchu w internecie pochodzi z urządzeń mobilnych. Dowiedz się, jak zoptymalizować swoją stronę, aby była przyjazna dla użytkowników mobile.</p>',
    featured_image: '/lovable-uploads/af7b17cd-510f-468f-a8b1-5b0c5be88c9f.png',
    summary: 'Jak projektować strony przyjazne urządzeniom mobilnym',
    excerpt: 'Jak projektować strony przyjazne urządzeniom mobilnym',
    categories: ['UX/UI', 'Web Development'],
    tags: ['mobile', 'responsywność', 'ux'],
    created_at: '2025-02-20T14:30:00Z',
    published: true,
    published_at: '2025-02-20T14:30:00Z'
  },
  {
    id: 'fallback-3',
    title: 'Znaczenie contentu wysokiej jakości w strategii SEO',
    slug: 'content-seo',
    content: '<p>Content jest królem - to stare powiedzenie jest nadal aktualne. Dowiedz się, jak tworzyć treści, które podobają się zarówno Google, jak i użytkownikom.</p>',
    featured_image: '/lovable-uploads/4eaa25a8-fb84-4c19-ae4f-8536407401c1.png',
    summary: 'Jak tworzyć treści, które pozycjonują się w Google',
    excerpt: 'Jak tworzyć treści, które pozycjonują się w Google',
    categories: ['Content Marketing', 'SEO'],
    tags: ['treści', 'blog', 'content marketing'],
    created_at: '2025-03-10T09:15:00Z',
    published: true,
    published_at: '2025-03-10T09:15:00Z'
  }
];

export function useBlogPosts() {
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      console.log('Fetching blog posts...');
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, content, featured_image, summary, excerpt, categories, tags, created_at, published, published_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blog posts:', error);
          toast.error('Błąd podczas pobierania postów');
          // Return fallback data when Supabase fails
          return fallbackPosts;
        }
        
        console.log('Blog posts fetched:', data);
        return (data?.length > 0 ? data : fallbackPosts) as BlogPost[];
      } catch (err) {
        console.error('Exception fetching blog posts:', err);
        toast.error('Błąd podczas pobierania postów, używam danych lokalnych');
        // Return fallback data when an exception occurs
        return fallbackPosts;
      }
    },
    retry: 2, // Increase retries
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000), // Exponential backoff
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  // Fetch single post by slug
  const getPost = (slug: string) => {
    return useQuery({
      queryKey: ['blog-post', slug],
      queryFn: async () => {
        console.log(`Fetching blog post with slug: ${slug}`);
        
        // For fallback posts, check if we have it locally first
        if (slug && fallbackPosts.some(p => p.slug === slug)) {
          const fallbackPost = fallbackPosts.find(p => p.slug === slug);
          if (fallbackPost) return fallbackPost;
        }
        
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug, content, featured_image, summary, excerpt, categories, tags, created_at, published, published_at')
            .eq('slug', slug)
            .maybeSingle();

          if (error) {
            console.error('Error fetching blog post:', error);
            toast.error('Błąd podczas pobierania postu');
            throw error;
          }
          
          if (!data && fallbackPosts.some(p => p.slug === slug)) {
            return fallbackPosts.find(p => p.slug === slug) as BlogPost;
          }
          
          console.log('Blog post fetched:', data);
          return data as BlogPost;
        } catch (err) {
          console.error('Exception fetching blog post:', err);
          
          // If it's a fallback post slug, return it
          if (fallbackPosts.some(p => p.slug === slug)) {
            return fallbackPosts.find(p => p.slug === slug) as BlogPost;
          }
          
          toast.error('Błąd podczas pobierania postu');
          throw err;
        }
      },
      enabled: !!slug,
      retry: 1,
      refetchOnWindowFocus: false
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

      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postWithAuthorId)
          .select()
          .single();

        if (error) {
          console.error('Error creating post:', error);
          toast.error('Błąd podczas tworzenia postu');
          throw error;
        }
        
        toast.success('Post dodany!');
        return data;
      } catch (err) {
        console.error('Exception creating post:', err);
        toast.error('Błąd podczas tworzenia postu');
        throw err;
      }
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
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postWithAuthorId)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating post:', error);
          toast.error('Błąd podczas aktualizacji postu');
          throw error;
        }
        
        toast.success('Post zaktualizowany!');
        return data;
      } catch (err) {
        console.error('Exception updating post:', err);
        toast.error('Błąd podczas aktualizacji postu');
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', data.slug] });
    }
  });

  // Delete post
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting post:', error);
          toast.error('Błąd podczas usuwania postu');
          throw error;
        }
        
        toast.success('Post usunięty!');
      } catch (err) {
        console.error('Exception deleting post:', err);
        toast.error('Błąd podczas usuwania postu');
        throw err;
      }
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
