
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/utils/supabaseClient';
import TaskManager from '@/components/TaskManager';
import { useTheme } from '@/utils/themeContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Monitor, Moon, Sun, Bell, Lock, Trash2, LogOut, Shield, FileText, BrainCircuit, Mail, Palette } from 'lucide-react';

const AdminSettings = () => {
  const { user, updatePassword, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [emailSettings, setEmailSettings] = useState({
    commentsEnabled: true,
    likesEnabled: true,
    newsEnabled: true,
    digestEnabled: false,
    digestFrequency: 'weekly',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    commentNotifications: true,
    likeNotifications: true,
    systemNotifications: true,
    mentionNotifications: true,
    browserNotifications: false,
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    compactView: false,
    highContrast: false,
    fontSize: 'medium',
    animationsEnabled: true,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    activityVisibility: 'followers',
    emailVisibility: 'private',
    allowDataCollection: true,
    allowDataSharing: false,
  });

  // Handle email settings update
  const handleEmailSettingsUpdate = async () => {
    try {
      setLoading(true);
      
      // Here you would update the settings in the backend
      
      toast({
        title: 'Ustawienia email zaktualizowane',
        description: 'Twoje preferencje dotyczące powiadomień email zostały zaktualizowane',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle notification settings update
  const handleNotificationSettingsUpdate = async () => {
    try {
      setLoading(true);
      
      // Here you would update the settings in the backend
      
      toast({
        title: 'Ustawienia powiadomień zaktualizowane',
        description: 'Twoje preferencje dotyczące powiadomień zostały zaktualizowane',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle appearance settings update
  const handleAppearanceSettingsUpdate = async () => {
    try {
      setLoading(true);
      
      // Update theme
      setTheme(appearanceSettings.theme);
      
      toast({
        title: 'Ustawienia wyglądu zaktualizowane',
        description: 'Twoje preferencje dotyczące wyglądu zostały zaktualizowane',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle privacy settings update
  const handlePrivacySettingsUpdate = async () => {
    try {
      setLoading(true);
      
      // Here you would update the settings in the backend
      
      toast({
        title: 'Ustawienia prywatności zaktualizowane',
        description: 'Twoje preferencje dotyczące prywatności zostały zaktualizowane',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Zmiana hasła
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: 'Błąd',
        description: 'Nowe hasła nie są identyczne',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await updatePassword(passwords.newPassword);
      
      if (error) throw error;

      toast({
        title: 'Hasło zmienione',
        description: 'Twoje hasło zostało pomyślnie zmienione',
      });
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd przy zmianie hasła',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleAccountDeletion = async () => {
    try {
      setLoading(true);
      
      // Here you would delete the account
      
      toast({
        title: 'Konto usunięte',
        description: 'Twoje konto zostało pomyślnie usunięte',
      });
      
      // Logout after account deletion
      await logout();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Ustawienia</h1>
        
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span className="hidden md:inline">Powiadomienia</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail size={16} />
              <span className="hidden md:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette size={16} />
              <span className="hidden md:inline">Wygląd</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={16} />
              <span className="hidden md:inline">Bezpieczeństwo</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden md:inline">Prywatność</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden md:inline">Zadania</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell size={20} />
                Ustawienia powiadomień w aplikacji
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia o komentarzach</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj powiadomienia, gdy ktoś skomentuje Twoje posty
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.commentNotifications} 
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, commentNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia o polubieniach</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj powiadomienia, gdy ktoś polubi Twoje posty
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.likeNotifications} 
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, likeNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia systemowe</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj powiadomienia o aktualizacjach systemu
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.systemNotifications} 
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia o wzmiankach</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj powiadomienia, gdy ktoś wspomni o Tobie w komentarzu
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.mentionNotifications} 
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, mentionNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia w przeglądarce</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj powiadomienia w przeglądarce (nawet gdy strona jest zamknięta)
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.browserNotifications} 
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, browserNotifications: checked }))}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleNotificationSettingsUpdate}
                    className="bg-premium-gradient" 
                    disabled={loading}
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz ustawienia powiadomień'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail size={20} />
                Ustawienia powiadomień email
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia o komentarzach</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj emaile, gdy ktoś skomentuje Twoje posty
                    </p>
                  </div>
                  <Switch 
                    checked={emailSettings.commentsEnabled} 
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, commentsEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Powiadomienia o polubieniach</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj emaile, gdy ktoś polubi Twoje posty
                    </p>
                  </div>
                  <Switch 
                    checked={emailSettings.likesEnabled} 
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, likesEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj informacje o nowościach i aktualizacjach
                    </p>
                  </div>
                  <Switch 
                    checked={emailSettings.newsEnabled} 
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, newsEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Podsumowanie aktywności</p>
                    <p className="text-sm text-premium-light/60">
                      Otrzymuj regularny email z podsumowaniem aktywności
                    </p>
                  </div>
                  <Switch 
                    checked={emailSettings.digestEnabled} 
                    onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, digestEnabled: checked }))}
                  />
                </div>
                
                {emailSettings.digestEnabled && (
                  <div className="space-y-2 pl-6">
                    <Label>Częstotliwość podsumowań</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="daily" 
                          name="digestFrequency"
                          checked={emailSettings.digestFrequency === 'daily'}
                          onChange={() => setEmailSettings(prev => ({ ...prev, digestFrequency: 'daily' }))}
                          className="mr-2"
                        />
                        <Label htmlFor="daily">Codziennie</Label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="weekly" 
                          name="digestFrequency"
                          checked={emailSettings.digestFrequency === 'weekly'}
                          onChange={() => setEmailSettings(prev => ({ ...prev, digestFrequency: 'weekly' }))}
                          className="mr-2"
                        />
                        <Label htmlFor="weekly">Co tydzień</Label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="monthly" 
                          name="digestFrequency"
                          checked={emailSettings.digestFrequency === 'monthly'}
                          onChange={() => setEmailSettings(prev => ({ ...prev, digestFrequency: 'monthly' }))}
                          className="mr-2"
                        />
                        <Label htmlFor="monthly">Co miesiąc</Label>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button 
                    onClick={handleEmailSettingsUpdate}
                    className="bg-premium-gradient" 
                    disabled={loading}
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz ustawienia email'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette size={20} />
                Ustawienia wyglądu
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Motyw</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'light' }))}
                      className={`flex flex-col items-center p-4 rounded-lg border ${
                        appearanceSettings.theme === 'light'
                          ? 'bg-white text-black border-premium-blue'
                          : 'bg-premium-dark/50 border-premium-light/10'
                      }`}
                    >
                      <Sun size={24} className={appearanceSettings.theme === 'light' ? 'text-black' : ''} />
                      <span className={`mt-2 ${appearanceSettings.theme === 'light' ? 'text-black' : ''}`}>Jasny</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'dark' }))}
                      className={`flex flex-col items-center p-4 rounded-lg border ${
                        appearanceSettings.theme === 'dark'
                          ? 'bg-premium-dark border-premium-purple'
                          : 'bg-premium-dark/50 border-premium-light/10'
                      }`}
                    >
                      <Moon size={24} />
                      <span className="mt-2">Ciemny</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'system' }))}
                      className={`flex flex-col items-center p-4 rounded-lg border ${
                        appearanceSettings.theme === 'system'
                          ? 'border-premium-gradient bg-gradient-to-br from-premium-dark/70 to-premium-dark'
                          : 'bg-premium-dark/50 border-premium-light/10'
                      }`}
                    >
                      <Monitor size={24} />
                      <span className="mt-2">Systemowy</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Widok kompaktowy</p>
                    <p className="text-sm text-premium-light/60">
                      Zmniejsza odstępy, aby wyświetlić więcej treści
                    </p>
                  </div>
                  <Switch 
                    checked={appearanceSettings.compactView} 
                    onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, compactView: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wysoki kontrast</p>
                    <p className="text-sm text-premium-light/60">
                      Zwiększa kontrast dla lepszej dostępności
                    </p>
                  </div>
                  <Switch 
                    checked={appearanceSettings.highContrast} 
                    onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, highContrast: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Animacje</p>
                    <p className="text-sm text-premium-light/60">
                      Włącza lub wyłącza animacje w interfejsie
                    </p>
                  </div>
                  <Switch 
                    checked={appearanceSettings.animationsEnabled} 
                    onCheckedChange={(checked) => setAppearanceSettings(prev => ({ ...prev, animationsEnabled: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rozmiar czcionki</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, fontSize: 'small' }))}
                      className={`py-2 px-4 rounded-lg ${
                        appearanceSettings.fontSize === 'small'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Mały
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, fontSize: 'medium' }))}
                      className={`py-2 px-4 rounded-lg ${
                        appearanceSettings.fontSize === 'medium'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Średni
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppearanceSettings(prev => ({ ...prev, fontSize: 'large' }))}
                      className={`py-2 px-4 rounded-lg ${
                        appearanceSettings.fontSize === 'large'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Duży
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleAppearanceSettingsUpdate}
                    className="bg-premium-gradient" 
                    disabled={loading}
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz ustawienia wyglądu'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock size={20} />
                Zmiana hasła
              </h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nowe hasło</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="bg-slate-950"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="bg-slate-950"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="bg-premium-gradient" disabled={loading}>
                    {loading ? 'Aktualizowanie...' : 'Zmień hasło'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-premium-dark/50 border border-red-900/20 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
                <Trash2 size={20} />
                Niebezpieczna strefa
              </h2>
              
              <div className="space-y-6">
                <p className="text-premium-light/70">
                  Te akcje są nieodwracalne i mogą prowadzić do utraty danych lub dostępu do konta.
                </p>
                
                <div className="pt-2 space-y-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 size={16} className="mr-2" />
                        Usuń konto
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Czy na pewno chcesz usunąć swoje konto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ta akcja jest nieodwracalna. Spowoduje to trwałe usunięcie Twojego konta i wszystkich danych z nim związanych.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleAccountDeletion}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Usuń konto
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button variant="outline" className="text-red-400 border-red-400 hover:text-white hover:bg-red-400" onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Wyloguj ze wszystkich urządzeń
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield size={20} />
                Ustawienia prywatności
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Widoczność profilu</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: 'public' }))}
                      className={`py-2 px-4 rounded-lg ${
                        privacySettings.profileVisibility === 'public'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Publiczny
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: 'followers' }))}
                      className={`py-2 px-4 rounded-lg ${
                        privacySettings.profileVisibility === 'followers'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Tylko obserwujący
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: 'private' }))}
                      className={`py-2 px-4 rounded-lg ${
                        privacySettings.profileVisibility === 'private'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Prywatny
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Widoczność aktywności</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPrivacySettings(prev => ({ ...prev, activityVisibility: 'public' }))}
                      className={`py-2 px-4 rounded-lg ${
                        privacySettings.activityVisibility === 'public'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Publiczna
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacySettings(prev => ({ ...prev, activityVisibility: 'followers' }))}
                      className={`py-2 px-4 rounded-lg ${
                        privacySettings.activityVisibility === 'followers'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Tylko obserwujący
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacySettings(prev => ({ ...prev, activityVisibility: 'private' }))}
                      className={`py-2 px-4 rounded-lg ${
                        privacySettings.activityVisibility === 'private'
                          ? 'bg-premium-light/10 border border-premium-light/30'
                          : 'bg-premium-dark/30 border border-premium-light/10'
                      }`}
                    >
                      Prywatna
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Zbieranie danych</p>
                    <p className="text-sm text-premium-light/60">
                      Zezwalaj na zbieranie anonimowych danych o użytkowaniu
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.allowDataCollection} 
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowDataCollection: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Udostępnianie danych</p>
                    <p className="text-sm text-premium-light/60">
                      Zezwalaj na udostępnianie zanonimizowanych danych partnerom
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.allowDataSharing} 
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowDataSharing: checked }))}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handlePrivacySettingsUpdate}
                    className="bg-premium-gradient" 
                    disabled={loading}
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz ustawienia prywatności'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
