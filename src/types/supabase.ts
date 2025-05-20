export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          meta_title: string | null
          meta_description: string | null
          meta_tags: string[] | null
          author_id: string
          published: boolean
          published_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_tags?: string[] | null
          author_id: string
          published?: boolean
          published_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_tags?: string[] | null
          author_id?: string
          published?: boolean
          published_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: 'admin' | 'editor' | 'user'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'user'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'user'
        }
      }
    }
    Enums: {
      user_role: 'admin' | 'editor' | 'user'
    }
  }
} 