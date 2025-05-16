import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User } from '@supabase/supabase-js';
import { ExtendedUserProfile } from '@/utils/AuthProvider';

interface ProfileFormProps {
  user: User & ExtendedUserProfile;
  onUpdate: (data: Partial<ExtendedUserProfile>) => Promise<boolean>;
}

const profileSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().optional(),
  email: z.string().email('Wprowadź poprawny adres email').optional(),
  profilePicture: z.string().url('Wprowadź poprawny URL obrazu').optional().or(z.literal('')),
  bio: z.string().max(200, 'Bio nie może przekroczyć 200 znaków').optional(),
  jobTitle: z.string().max(50, 'Stanowisko nie może przekroczyć 50 znaków').optional()
});

const ProfileForm = ({ user, onUpdate }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      profilePicture: user?.profilePicture || '',
      bio: user?.bio || '',
      jobTitle: user?.jobTitle || ''
    }
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const success = await onUpdate({
        name: values.name,
        lastName: values.lastName,
        profilePicture: values.profilePicture,
        bio: values.bio,
        jobTitle: values.jobTitle
      });
      
      if (!success) {
        throw new Error('Nie udało się zaktualizować danych użytkownika');
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6">Edytuj swoje dane</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              control={form.control} 
              name="name" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imię</FormLabel>
                  <FormControl>
                    <Input placeholder="Imię" className="bg-transparent" {...field} />
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
                    <Input placeholder="Nazwisko" className="bg-transparent" {...field} value={field.value || ''} />
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
                  <Input placeholder="Email" {...field} disabled className="bg-premium-light/5" />
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
                    placeholder="np. CEO, Marketing Manager, Developer" 
                    {...field} 
                    value={field.value || ''} 
                    className="bg-transparent" 
                  />
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
                    value={field.value || ''} 
                    className="bg-transparent" 
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
                  <Input 
                    placeholder="Krótki opis o Tobie" 
                    {...field} 
                    value={field.value || ''} 
                    className="bg-transparent" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <Button 
            type="submit" 
            className="bg-premium-gradient hover:bg-white hover:text-black transition-colors" 
            disabled={isLoading}
          >
            {isLoading ? "Aktualizowanie..." : "Zapisz zmiany"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
