import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brak wymaganych zmiennych środowiskowych dla Supabase')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Typy dla tabel w bazie danych
export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']

// Typy dla poszczególnych tabel
export type BlogPost = Tables['blog_posts']['Row']
export type BlogPostInsert = Tables['blog_posts']['Insert']
export type BlogPostUpdate = Tables['blog_posts']['Update']

export type User = Tables['users']['Row']
export type UserInsert = Tables['users']['Insert']
export type UserUpdate = Tables['users']['Update'] 