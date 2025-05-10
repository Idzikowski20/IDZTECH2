
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Upload, Camera } from 'lucide-react';
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
  email: z.string().email('Wprowadź poprawny adres email').optional(),
  profilePicture: z.string().url('Wprowadź poprawny URL obrazu').optional().or(z.literal('')),
  bio: z.string().max(200, 'Bio nie może przekroczyć 200 znaków').optional(),
  jobTitle: z.string().max(50, 'Stanowisko nie może przekroczyć 50 znaków').optional()
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set preview image from user profile when component mounts
  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewImage(user.profilePicture);
    }
  }, [user?.profilePicture]);

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
      // Use preview image if available, otherwise use the URL from form
      const profilePictureToUse = previewImage || values.profilePicture;
      
      updateProfile({
        name: values.name,
        lastName: values.lastName,
        profilePicture: profilePictureToUse,
        bio: values.bio,
        jobTitle: values.jobTitle
      });
      
      toast({
        title: "Profil zaktualizowany",
        description: "Twoje dane zostały pomyślnie zaktualizowane"
      });
    } catch (error) {
      toast({
        title: "Błąd aktualizacji",
        description: "Nie udało się zaktualizować profilu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        
        // Update the form value and immediately update profile
        form.setValue('profilePicture', result);
        
        // Immediately update the profile picture to ensure persistence
        updateProfile({
          profilePicture: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureImage = () => {
    toast({
      title: "Funkcja w przygotowaniu",
      description: "Robienie zdjęć bezpośrednio przez kamerę będzie dostępne wkrótce"
    });
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
            Zaktualizuj swoje dane osobowe i informacje profilowe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 relative group">
                  <AvatarImage 
                    src={previewImage || user.profilePicture} 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-premium-gradient">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                  
                  <div 
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    onClick={handleImageSelection}
                  >
                    <Upload size={24} className="text-white" />
                  </div>
                </Avatar>
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user.name} {user.lastName}</h2>
                  <p className="text-premium-light/70">{user.email}</p>
                  <p className="text-sm mt-1 bg-premium-light/10 px-3 py-1 rounded-full inline-block">
                    {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                  </p>
                  {user.jobTitle && <p className="text-sm mt-2">{user.jobTitle}</p>}
                </div>

                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleImageChange}
                />
                
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleImageSelection}
                    className="flex-1 flex items-center gap-2 hover:bg-premium-light/10 hover:text-white transition-colors"
                  >
                    <Upload size={16} />
                    Prześlij zdjęcie
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCaptureImage}
                    className="flex items-center gap-2 hover:bg-premium-light/10 hover:text-white transition-colors"
                  >
                    <Camera size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-premium-light/10">
                <h3 className="text-sm font-medium mb-2">O mnie</h3>
                <p className="text-sm text-premium-light/70">
                  {user.bio || "Nie dodano jeszcze opisu profilu. Edytuj swój profil, aby dodać bio."}
                </p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Członek od</h3>
                <p className="text-sm text-premium-light/70">
                  {new Date().toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
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
                            onChange={(e) => {
                              field.onChange(e);
                              // If URL changes, update preview
                              if (e.target.value) {
                                setPreviewImage(null); // Clear preview if URL is manually entered
                              }
                            }}
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
                    className="bg-premium-gradient hover:scale-110 transition-transform" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Aktualizowanie..." : "Zapisz zmiany"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
