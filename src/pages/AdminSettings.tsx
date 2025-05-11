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
} from "@/components/ui/alert-dialog";
import { Bell, Lock, Eye, Trash, Settings, Save, Undo } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    systemNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true, 
    publicProfile: true,
    showActivity: true,
    allowDataCollection: true,
  });

  // Interface settings
  const [interfaceSettings, setInterfaceSettings] = useState({
    theme: theme,
    compactView: false,
    highContrast: false,
    fontSize: 'medium',
    animationsEnabled: true,
  });

  // Save notification settings
  const handleNotificationSettingsSave = () => {
    setLoading(true);
    
    // Here would be the API call to save notification settings
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Ustawienia zapisane",
        description: "Twoje ustawienia powiadomień zostały zaktualizowane",
      });
    }, 800);
  };

  // Save privacy settings
  const handlePrivacySettingsSave = () => {
    setLoading(true);
    
    // Here would be the API call to save privacy settings
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Ustawienia zapisane",
        description: "Twoje ustawienia prywatności zostały zaktualizowane",
      });
    }, 800);
  };

  // Save interface settings
  const handleInterfaceSettingsSave = () => {
    setLoading(true);
    
    // Here would be the API call to save interface settings
    setTimeout(() => {
      // Apply theme changes
      setTheme(interfaceSettings.theme);
      
      setLoading(false);
      toast({
        title: "Ustawienia zapisane",
        description: "Twoje ustawienia interfejsu zostały zaktualizowane",
      });
    }, 800);
  };

  // Reset interface settings
  const handleInterfaceReset = () => {
    setInterfaceSettings({
      theme: 'system',
      compactView: false,
      highContrast: false,
      fontSize: 'medium',
      animationsEnabled: true,
    });
    
    toast({
      title: "Ustawienia zresetowane",
      description: "Przywrócono domyślne ustawienia interfejsu",
    });
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

    if (passwords.newPassword.length < 6) {
      toast({
        title: 'Błąd',
        description: 'Hasło musi zawierać przynajmniej 6 znaków',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Here would be the actual password change logic
      // const { error } = await updatePassword(passwords.currentPassword, passwords.newPassword);
      // if (error) throw error;

      // Simulate successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));

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
        description: error.message || "Wystąpił nieznany błąd",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // Here would be the actual account deletion logic
      // const { error } = await supabase.auth.admin.deleteUser(user.id)
      // if (error) throw error;

      // Simulate account deletion process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Konto usunięte',
        description: 'Twoje konto zostało pomyślnie usunięte',
      });
      
      // Sign out and redirect to home
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Błąd przy usuwaniu konta',
        description: error.message || "Wystąpił nieznany błąd",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Handle logout from all devices
  const handleLogoutAllDevices = async () => {
    try {
      setLoading(true);
      
      // Here would be the actual logout from all devices logic
      // const { error } = await supabase.auth.signOut({ scope: 'global' })
      // if (error) throw error;

      // Simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Wylogowano',
        description: 'Zostałeś wylogowany ze wszystkich urządzeń',
      });
      
      // Sign out and redirect to login
      await signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message || "Wystąpił nieznany błąd",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Ustawienia</h1>
        
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-4">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              <span className="hidden sm:inline">Powiadomienia</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={16} />
              <span className="hidden sm:inline">Bezpieczeństwo</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye size={16} />
              <span className="hidden sm:inline">Prywatność</span>
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Interfejs</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Ustawienia powiadomień</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Powiadomienia e-mail</h3>
                      <p className="text-sm text-premium-light/60">Otrzymuj wiadomości e-mail z powiadomieniami o ważnych wydarzeniach</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Powiadomienia o komentarzach</h3>
                      <p className="text-sm text-premium-light/60">Otrzymuj powiadomienia gdy ktoś skomentuje Twój post</p>
                    </div>
                    <Switch
                      checked={notificationSettings.commentNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, commentNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Powiadomienia o polubieniach</h3>
                      <p className="text-sm text-premium-light/60">Otrzymuj powiadomienia gdy ktoś polubi Twój post</p>
                    </div>
                    <Switch
                      checked={notificationSettings.likeNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, likeNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Powiadomienia systemowe</h3>
                      <p className="text-sm text-premium-light/60">Otrzymuj powiadomienia o aktualizacjach systemu i ważnych informacjach</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">E-maile marketingowe</h3>
                      <p className="text-sm text-premium-light/60">Otrzymuj informacje o promocjach i nowościach</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Tygodniowe podsumowanie</h3>
                      <p className="text-sm text-premium-light/60">Otrzymuj cotygodniowe podsumowanie aktywności na Twojej stronie</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyDigest}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="button" 
                    className="bg-premium-gradient flex items-center gap-2" 
                    disabled={loading}
                    onClick={handleNotificationSettingsSave}
                  >
                    <Save size={16} />
                    {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Zmiana hasła</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Aktualne hasło</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="bg-slate-950"
                      required
                    />
                  </div>
                  
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
                    <p className="text-xs text-premium-light/60">Hasło musi zawierać co najmniej 6 znaków</p>
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
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="bg-premium-gradient flex items-center gap-2" disabled={loading}>
                    <Lock size={16} />
                    {loading ? 'Aktualizowanie...' : 'Zmień hasło'}
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Bezpieczeństwo konta</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Wylogowanie ze wszystkich urządzeń</h3>
                  <p className="text-sm text-premium-light/60 mb-4">
                    Ta opcja spowoduje wylogowanie ze wszystkich urządzeń, na których jesteś aktualnie zalogowany.
                    Będziesz musiał zalogować się ponownie na każdym urządzeniu.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-950 hover:text-white"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    Wyloguj ze wszystkich urządzeń
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Usunięcie konta</h3>
                  <p className="text-sm text-premium-light/60 mb-4">
                    Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.
                    Nie będziesz mógł ich odzyskać po potwierdzeniu tej operacji.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-950 hover:text-white flex items-center gap-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash size={16} />
                    Usuń konto
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Ustawienia prywatności</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Pokaż status online</h3>
                      <p className="text-sm text-premium-light/60">Inni użytkownicy będą widzieć, kiedy jesteś online</p>
                    </div>
                    <Switch
                      checked={privacySettings.showOnlineStatus}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Profil publiczny</h3>
                      <p className="text-sm text-premium-light/60">Twój profil będzie widoczny dla niezalogowanych użytkowników</p>
                    </div>
                    <Switch
                      checked={privacySettings.publicProfile}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, publicProfile: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Pokaż moją aktywność</h3>
                      <p className="text-sm text-premium-light/60">Twoje komentarze i polubienia będą widoczne dla innych</p>
                    </div>
                    <Switch
                      checked={privacySettings.showActivity}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showActivity: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Zezwól na zbieranie danych</h3>
                      <p className="text-sm text-premium-light/60">Zezwól na zbieranie danych do celów analitycznych</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowDataCollection}
                      onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowDataCollection: checked }))}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="button" 
                    className="bg-premium-gradient flex items-center gap-2" 
                    disabled={loading}
                    onClick={handlePrivacySettingsSave}
                  >
                    <Save size={16} />
                    {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-premium-light/10">
                  <h3 className="text-lg font-medium mb-4">Eksport danych</h3>
                  <p className="text-sm text-premium-light/60 mb-4">
                    Możesz eksportować wszystkie swoje dane w formacie JSON. 
                    Proces może potrwać kilka minut, a link do pobrania zostanie wysłany na Twój adres e-mail.
                  </p>
                  <Button variant="outline">
                    Eksportuj moje dane
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Interface Settings */}
          <TabsContent value="interface">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Ustawienia interfejsu</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2">Motyw</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        type="button"
                        variant={interfaceSettings.theme === 'dark' ? 'default' : 'outline'}
                        className={cn(
                          "border-premium-light/20",
                          interfaceSettings.theme === 'dark' && "bg-premium-gradient"
                        )}
                        onClick={() => setInterfaceSettings(prev => ({ ...prev, theme: 'dark' }))}
                      >
                        Ciemny
                      </Button>
                      <Button 
                        type="button"
                        variant={interfaceSettings.theme === 'light' ? 'default' : 'outline'}
                        className={cn(
                          "border-premium-light/20",
                          interfaceSettings.theme === 'light' && "bg-premium-gradient"
                        )}
                        onClick={() => setInterfaceSettings(prev => ({ ...prev, theme: 'light' }))}
                      >
                        Jasny
                      </Button>
                      <Button 
                        type="button"
                        variant={interfaceSettings.theme === 'system' ? 'default' : 'outline'}
                        className={cn(
                          "border-premium-light/20",
                          interfaceSettings.theme === 'system' && "bg-premium-gradient"
                        )}
                        onClick={() => setInterfaceSettings(prev => ({ ...prev, theme: 'system' }))}
                      >
                        Systemowy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Widok kompaktowy</h3>
                      <p className="text-sm text-premium-light/60">Zmniejsza odległości między elementami interfejsu</p>
                    </div>
                    <Switch
                      checked={interfaceSettings.compactView}
                      onCheckedChange={(checked) => setInterfaceSettings(prev => ({ ...prev, compactView: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Wysoki kontrast</h3>
                      <p className="text-sm text-premium-light/60">Zwiększa kontrast kolorów dla lepszej czytelności</p>
                    </div>
                    <Switch
                      checked={interfaceSettings.highContrast}
                      onCheckedChange={(checked) => setInterfaceSettings(prev => ({ ...prev, highContrast: checked }))}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Rozmiar czcionki</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        type="button"
                        variant={interfaceSettings.fontSize === 'small' ? 'default' : 'outline'}
                        className={cn(
                          "border-premium-light/20",
                          interfaceSettings.fontSize === 'small' && "bg-premium-gradient"
                        )}
                        onClick={() => setInterfaceSettings(prev => ({ ...prev, fontSize: 'small' }))}
                      >
                        Mały
                      </Button>
                      <Button 
                        type="button"
                        variant={interfaceSettings.fontSize === 'medium' ? 'default' : 'outline'}
                        className={cn(
                          "border-premium-light/20",
                          interfaceSettings.fontSize === 'medium' && "bg-premium-gradient"
                        )}
                        onClick={() => setInterfaceSettings(prev => ({ ...prev, fontSize: 'medium' }))}
                      >
                        Średni
                      </Button>
                      <Button 
                        type="button"
                        variant={interfaceSettings.fontSize === 'large' ? 'default' : 'outline'}
                        className={cn(
                          "border-premium-light/20",
                          interfaceSettings.fontSize === 'large' && "bg-premium-gradient"
                        )}
                        onClick={() => setInterfaceSettings(prev => ({ ...prev, fontSize: 'large' }))}
                      >
                        Duży
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-medium">Animacje</h3>
                      <p className="text-sm text-premium-light/60">Włącz lub wyłącz animacje interfejsu</p>
                    </div>
                    <Switch
                      checked={interfaceSettings.animationsEnabled}
                      onCheckedChange={(checked) => setInterfaceSettings(prev => ({ ...prev, animationsEnabled: checked }))}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  <Button 
                    type="button" 
                    className="bg-premium-gradient flex items-center gap-2" 
                    disabled={loading}
                    onClick={handleInterfaceSettingsSave}
                  >
                    <Save size={16} />
                    {loading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-premium-light/20 flex items-center gap-2"
                    onClick={handleInterfaceReset}
                  >
                    <Undo size={16} />
                    Przywróć domyślne
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Alert Dialogs */}
      
      {/* Alert Dialog for Account Deletion */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć konto?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Spowoduje ona trwałe usunięcie Twojego konta i wszystkich powiązanych danych.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Usuwanie...' : 'Usuń konto'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Alert Dialog for Logging Out from All Devices */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wylogowanie ze wszystkich urządzeń</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz się wylogować ze wszystkich urządzeń? Ta akcja spowoduje utratę dostępu do wszystkich sesji.
              Będziesz musiał zalogować się ponownie na każdym urządzeniu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutAllDevices}
              className="bg-premium-gradient"
            >
              {loading ? 'Wylogowywanie...' : 'Wyloguj ze wszystkich urządzeń'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminSettings;
