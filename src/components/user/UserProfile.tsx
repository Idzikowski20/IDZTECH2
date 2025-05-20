import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useUsers } from '../../hooks/useUsers'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const profileSchema = z.object({
  first_name: z.string().min(1, 'Imię jest wymagane'),
  last_name: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().email('Nieprawidłowy adres email')
})

type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Aktualne hasło jest wymagane'),
  new_password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Hasła nie są identyczne',
  path: ['confirm_password']
})

type PasswordFormData = z.infer<typeof passwordSchema>

export function UserProfile() {
  const { currentUser, isLoadingCurrentUser, updateProfile, updatePassword, signOut } = useUsers()
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: currentUser?.first_name ?? '',
      last_name: currentUser?.last_name ?? '',
      email: currentUser?.email ?? ''
    }
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data)
      setProfileMessage({ type: 'success', message: 'Profil został zaktualizowany' })
    } catch (error) {
      setProfileMessage({ type: 'error', message: 'Wystąpił błąd podczas aktualizacji profilu' })
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword.mutateAsync(data.new_password)
      setPasswordMessage({ type: 'success', message: 'Hasło zostało zmienione' })
      passwordForm.reset()
    } catch (error) {
      setPasswordMessage({ type: 'error', message: 'Wystąpił błąd podczas zmiany hasła' })
    }
  }

  if (isLoadingCurrentUser) {
    return <div>Ładowanie...</div>
  }

  if (!currentUser) {
    return <div>Nie zalogowano</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profil użytkownika</CardTitle>
          <CardDescription>Zarządzaj swoimi danymi osobowymi</CardDescription>
        </CardHeader>
        <CardContent>
          {profileMessage && (
            <Alert variant={profileMessage.type === 'success' ? 'default' : 'destructive'} className="mb-4">
              {profileMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{profileMessage.message}</AlertDescription>
            </Alert>
          )}

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Zapisz zmiany</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zmiana hasła</CardTitle>
          <CardDescription>Zmień swoje hasło</CardDescription>
        </CardHeader>
        <CardContent>
          {passwordMessage && (
            <Alert variant={passwordMessage.type === 'success' ? 'default' : 'destructive'} className="mb-4">
              {passwordMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{passwordMessage.message}</AlertDescription>
            </Alert>
          )}

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aktualne hasło</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nowe hasło</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potwierdź nowe hasło</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Zmień hasło</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => signOut.mutate()}>
            Wyloguj się
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 