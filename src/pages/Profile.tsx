
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import AdminLayout from '@/components/AdminLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().optional(),
  profilePicture: z.string().url('Wprowadź poprawny URL obrazu').optional().or(z.literal('')),
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      lastName: user?.lastName || '',
      profilePicture: user?.profilePicture || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      updateProfile({
        name: values.name,
        lastName: values.lastName,
        profilePicture: values.profilePicture,
      });
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twoje dane zostały pomyślnie zaktualizowane",
      });
    } catch (error) {
      toast({
        title: "Błąd aktualizacji",
        description: "Nie udało się zaktualizować profilu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Twój profil</h1>
          <p className="text-premium-light/70">
            Zaktualizuj swoje dane osobowe i ustawienia profilu.
          </p>
        </div>

        <div className="max-w-xl bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10">
          <div className="flex items-center space-x-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="text-xl bg-premium-gradient">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name} {user.lastName}</h2>
              <p className="text-premium-light/70">{user.email}</p>
              <p className="text-sm mt-1 bg-premium-light/10 px-2 py-1 rounded inline-block">
                {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Imię" {...field} />
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
                      <Input placeholder="Nazwisko" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL zdjęcia profilowego</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/your-image.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-premium-gradient" 
                disabled={isLoading}
              >
                {isLoading ? "Aktualizowanie..." : "Zapisz zmiany"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
