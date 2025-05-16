import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '../lib/supabase'

export function useBlogPosts() {
  const queryClient = useQueryClient()

  // Pobieranie wszystkich postów
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, users(first_name, last_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (BlogPost & { users: { first_name: string | null; last_name: string | null } })[]
    }
  })

  // Pobieranie pojedynczego posta
  const getPost = (slug: string) => {
    return useQuery({
      queryKey: ['blog-post', slug],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, users(first_name, last_name)')
          .eq('slug', slug)
          .single()

        if (error) throw error
        return data as BlogPost & { users: { first_name: string | null; last_name: string | null } }
      },
      enabled: !!slug
    })
  }

  // Tworzenie nowego posta
  const createPost = useMutation({
    mutationFn: async (newPost: BlogPostInsert) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    }
  })

  // Aktualizacja posta
  const updatePost = useMutation({
    mutationFn: async ({ id, ...updates }: BlogPostUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
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

  // Usuwanie posta
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