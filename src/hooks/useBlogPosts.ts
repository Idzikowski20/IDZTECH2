
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/types/supabase'

// Update the type definitions to remove updated_at and author_id
type BlogPost = Pick<Database['public']['Tables']['blog_posts']['Row'], 
  'id' | 'title' | 'slug' | 'content' | 'featured_image' | 
  'excerpt' | 'categories' | 'tags' | 'created_at' | 'published' | 'published_at'>

type BlogPostInsert = Pick<Database['public']['Tables']['blog_posts']['Insert'], 
  'id' | 'title' | 'slug' | 'content' | 'featured_image' | 
  'excerpt' | 'categories' | 'tags' | 'created_at' | 'published' | 'published_at'>

type BlogPostUpdate = Pick<Database['public']['Tables']['blog_posts']['Update'], 
  'id' | 'title' | 'slug' | 'content' | 'featured_image' | 
  'excerpt' | 'categories' | 'tags' | 'created_at' | 'published' | 'published_at'>

export function useBlogPosts() {
  const queryClient = useQueryClient()

  // Fetch all posts - removing author_id and updated_at from the select
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, featured_image, excerpt, categories, tags, created_at, published, published_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as BlogPost[]
    }
  })

  // Fetch single post by slug - removing author_id and updated_at from the select
  const getPost = (slug: string) => {
    return useQuery({
      queryKey: ['blog-post', slug],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, content, featured_image, excerpt, categories, tags, created_at, published, published_at')
          .eq('slug', slug)
          .single()

        if (error) throw error
        return data as BlogPost
      },
      enabled: !!slug
    })
  }

  // Create new post - no need to send author_id
  const createPost = useMutation({
    mutationFn: async (newPost: BlogPostInsert) => {
      // Create a new post record with only the allowed fields
      const postToInsert = {
        title: newPost.title,
        slug: newPost.slug,
        content: newPost.content,
        featured_image: newPost.featured_image,
        excerpt: newPost.excerpt,
        categories: newPost.categories,
        tags: newPost.tags,
        created_at: newPost.created_at,
        published: newPost.published,
        published_at: newPost.published_at
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postToInsert)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    }
  })

  // Update post - omit updated_at (it's handled by supabase) and author_id
  const updatePost = useMutation({
    mutationFn: async ({ id, ...updates }: BlogPostUpdate & { id: string }) => {
      // Create an update object with only the allowed fields
      const postUpdates = {
        title: updates.title,
        slug: updates.slug,
        content: updates.content,
        featured_image: updates.featured_image,
        excerpt: updates.excerpt,
        categories: updates.categories,
        tags: updates.tags,
        published: updates.published,
        published_at: updates.published_at
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .update(postUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      queryClient.invalidateQueries({ queryKey: ['blog-post', data.slug] })
    }
  })

  // Delete post
  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    }
  })

  return {
    posts,
    isLoadingPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
  }
}
