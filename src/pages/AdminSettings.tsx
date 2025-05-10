
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import AdminLayout from '@/components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Aktualne hasło musi mieć co najmniej 6 znaków'),
  newPassword: z.string().min(6, 'Nowe hasło musi mieć co najmniej 6 znaków'),
  confirmPassword: z.string().min(6, 'Hasło potwierdzające musi mieć co najmniej 6 znaków'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Hasła nie pasują do siebie",
  path: ["confirmPassword"],
});

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

const AdminSettings = () => {
  const { user, updatePassword, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Przekieruj jeśli nie jest zalogowany
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Formularz hasła
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Formularz powiadomień
  const notificationsForm = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
    },
  });

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      
      toast({
        title: "Hasło zaktualizowane",
        description: "Twoje hasło zostało pomyślnie zmienione",
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Błąd aktualizacji",
        description: "Nie udało się zaktualizować hasła. Sprawdź poprawność aktualnego hasła.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationsSubmit = (values: z.infer<typeof notificationsSchema>) => {
    toast({
      title: "Preferencje powiadomień zapisane",
      description: "Twoje ustawienia powiadomień zostały zaktualizowane",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Ustawienia</h1>
          <p className="text-premium-light/70">
            Zarządzaj ustawieniami swojego konta i preferencjami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ustawienia hasła */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Ustawienia hasła</h2>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktualne hasło</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Wprowadź aktualne hasło" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nowe hasło</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Wprowadź nowe hasło" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potwierdź hasło</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Potwierdź nowe hasło" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-premium-gradient hover:scale-105 transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? "Aktualizowanie..." : "Aktualizuj hasło"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Ustawienia wyglądu */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Wygląd</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Tryb ciemny</h3>
                  <p className="text-sm text-premium-light/70">
                    Przełącz między trybem jasnym i ciemnym
                  </p>
                </div>
                
                <Toggle 
                  pressed={isDarkMode} 
                  onPressedChange={toggleDarkMode} 
                  className="bg-transparent hover:bg-premium-light/10 data-[state=on]:bg-premium-gradient hover:text-white"
                >
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Toggle>
              </div>
              
              <div className="pb-4 border-b border-premium-light/10">
                <h3 className="font-medium mb-2">Kolor motywu</h3>
                <div className="flex gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full focus:ring-2 focus:ring-premium-light hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        toast({
                          title: "Kolor motywu zaktualizowany",
                          description: "Twoje preferencje koloru motywu zostały zapisane",
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ustawienia powiadomień */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Ustawienia powiadomień</h2>
            
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                <FormField
                  control={notificationsForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-premium-light/10 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Powiadomienia e-mail</FormLabel>
                        <p className="text-sm text-premium-light/70">
                          Otrzymuj e-maile o aktywnościach na Twoim koncie
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationsForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-premium-light/10 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">E-maile marketingowe</FormLabel>
                        <p className="text-sm text-premium-light/70">
                          Otrzymuj e-maile o nowych funkcjach, produktach i ofertach
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-premium-gradient hover:scale-105 transition-transform"
                >
                  Zapisz preferencje
                </Button>
              </form>
            </Form>
          </div>

          {/* Ustawienia konta */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Ustawienia konta</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-premium-light/10">
                <div>
                  <h3 className="font-medium">Typ konta</h3>
                  <p className="text-sm text-premium-light/70">
                    {user?.role === 'admin' ? 'Administrator' : 'Zwykły użytkownik'}
                  </p>
                </div>
                
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user?.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {user?.role === 'admin' ? 'Admin' : 'Użytkownik'}
                </span>
              </div>
              
              <div className="pb-4 border-b border-premium-light/10">
                <h3 className="font-medium mb-2">Zarządzanie sesją</h3>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 hover:bg-premium-light/10 hover:text-white transition-colors"
                  onClick={() => {
                    toast({
                      title: "Wylogowano z innych sesji",
                      description: "Zostałeś wylogowany ze wszystkich innych urządzeń",
                    });
                  }}
                >
                  Wyloguj ze wszystkich innych urządzeń
                </Button>
              </div>
              
              <div className="pb-4">
                <h3 className="font-medium mb-2 text-red-500">Strefa niebezpieczna</h3>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  onClick={() => {
                    toast({
                      title: "Żądanie usunięcia konta",
                      description: "Sprawdź swoją skrzynkę e-mail, aby potwierdzić usunięcie konta",
                    });
                  }}
                >
                  Usuń konto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
