import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { User, UserUpdate } from '../lib/supabase'

export function useUsers() {
  const queryClient = useQueryClient()

  // Pobieranie aktualnego użytkownika
  const { data: currentUser, isLoading: isLoadingCurrentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return null

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error
      return data as User
    }
  })

  // Aktualizacja profilu użytkownika
  const updateProfile = useMutation({
    mutationFn: async (updates: UserUpdate) => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Nie zalogowano')

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
  })

  // Aktualizacja hasła
  const updatePassword = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
    }
  })

  // Wylogowanie
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
    }
  })

  return {
    currentUser,
    isLoadingCurrentUser,
    updateProfile,
    updatePassword,
    signOut
  }
} 