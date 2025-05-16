
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/AuthProvider';
import { updateUserProfile, UserProfile } from '@/services/userService';

const profileSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki').optional(),
  lastName: z.string().optional(),
  email: z.string().email('Wprowadź poprawny adres email').optional(),
  jobTitle: z.string().optional(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof profileSchema>;

const UserProfileComponent = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      jobTitle: user?.jobTitle || '',
      bio: user?.bio || '',
    },
  });

  // Aktualizuj formularz, gdy user się zmienia
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || '',
      });

      if (user.profilePicture) {
        setProfilePicturePreview(user.profilePicture);
      }
    }
  }, [user, form]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Utwórz tymczasowy URL dla podglądu
      const fileUrl = URL.createObjectURL(file);
      setProfilePicturePreview(fileUrl);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user || !user.id) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany, aby zaktualizować profil",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let profilePictureUrl = user.profilePicture || '';
      
      // Jeśli wybrano nowe zdjęcie profilowe, przekonwertuj je na base64
      if (profilePicture) {
        profilePictureUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(profilePicture);
        });
      }

      // Przygotuj dane do aktualizacji
      const profileData: Partial<UserProfile> = {
        ...values,
        profilePicture: profilePictureUrl,
      };

      // Zaktualizuj profil użytkownika
      await updateUserProfile(user.id, profileData);
      
      // Odśwież dane użytkownika
      if (refreshUser) {
        await refreshUser();
      }

      toast({
        title: "Sukces",
        description: "Profil został zaktualizowany",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować profilu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Pokaż inicjały użytkownika w awatarze, jeśli nie ma zdjęcia
  const getInitials = () => {
    let initials = '?';
    
    if (user?.name) {
      initials = user.name.charAt(0).toUpperCase();
      
      if (user.lastName) {
        initials += user.lastName.charAt(0).toUpperCase();
      }
    } else if (user?.email) {
      initials = user.email.charAt(0).toUpperCase();
    }
    
    return initials;
  };

  if (!user) {
    return (
      <Card className="border-premium-light/10">
        <CardHeader>
          <CardTitle>Profil użytkownika</CardTitle>
          <CardDescription>Zaloguj się, aby zobaczyć i edytować swój profil</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-premium-light/10">
      <CardHeader>
        <CardTitle>Twój profil</CardTitle>
        <CardDescription>Zarządzaj swoimi danymi personalnymi</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Zdjęcie profilowe */}
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-2 border-premium-light/10">
                <AvatarImage src={profilePicturePreview} />
                <AvatarFallback className="bg-premium-gradient text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <FormLabel>Zdjęcie profilowe</FormLabel>
                <label className="cursor-pointer">
                  <div className="bg-premium-light/5 border border-premium-light/20 hover:bg-premium-light/10 transition-colors rounded-lg px-4 py-2 flex items-center">
                    <Upload size={18} className="mr-2" />
                    <span>Wybierz plik</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleProfilePictureChange}
                  />
                </label>
                <p className="text-xs text-premium-light/60">
                  Zalecany format: JPG, PNG. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Twoje imię" 
                        {...field} 
                        className="bg-slate-950" 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Twoje nazwisko" 
                        {...field} 
                        className="bg-slate-950"
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="twoj@email.com" 
                      {...field} 
                      disabled 
                      className="bg-slate-950" 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stanowisko</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="np. SEO Specialist" 
                      {...field} 
                      className="bg-slate-950"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Kilka słów o Tobie..." 
                      {...field} 
                      className="bg-slate-950" 
                      rows={4}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="bg-premium-gradient" disabled={loading}>
                <Save size={16} className="mr-2" />
                {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserProfileComponent;
