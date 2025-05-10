
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/utils/auth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/utils/themeContext';
import { trackEvent } from '@/utils/analytics';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newComments: true,
    postUpdates: false,
    siteStats: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showProfile: true,
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleThemeModeChange = () => {
    toggleDarkMode();
    trackEvent(
      'toggle_theme',
      'settings',
      isDarkMode ? 'light_mode' : 'dark_mode'
    );
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    trackEvent(
      'toggle_notification',
      'settings',
      `${key}_${!notificationSettings[key]}`
    );
  };

  const handlePrivacyChange = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    trackEvent(
      'toggle_privacy',
      'settings',
      `${key}_${!privacySettings[key]}`
    );
  };

  const clearCache = () => {
    // Simulate clearing cache
    trackEvent('clear_cache', 'settings', 'cache_cleared');
    setTimeout(() => {
      alert('Cache wyczyszczona pomyślnie.');
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Ustawienia</h1>
          <p className="text-premium-light/70 dark:text-premium-light/70">
            Dostosuj ustawienia panelu administracyjnego.
          </p>
        </div>

        {/* Appearance Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Wygląd</h2>
          <div className="bg-premium-dark/50 dark:bg-premium-dark/50 border border-premium-light/10 dark:border-premium-light/10 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold mb-1">Tryb ciemny</h3>
                <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                  Przełącz między jasnym a ciemnym motywem.
                </p>
              </div>
              <div className="flex items-center">
                <Sun className="mr-2 h-4 w-4 text-premium-light/70 dark:text-premium-light/70" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleThemeModeChange}
                />
                <Moon className="ml-2 h-4 w-4 text-premium-light/70 dark:text-premium-light/70" />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Powiadomienia</h2>
          <div className="bg-premium-dark/50 dark:bg-premium-dark/50 border border-premium-light/10 dark:border-premium-light/10 p-6 rounded-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Powiadomienia e-mail</h3>
                  <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                    Otrzymuj powiadomienia e-mail.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationChange('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Nowe komentarze</h3>
                  <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                    Powiadamiaj o nowych komentarzach.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newComments}
                  onCheckedChange={() => handleNotificationChange('newComments')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Aktualizacje postów</h3>
                  <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                    Powiadamiaj o aktualizacjach postów.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.postUpdates}
                  onCheckedChange={() => handleNotificationChange('postUpdates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Statystyki strony</h3>
                  <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                    Otrzymuj cotygodniowe statystyki.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.siteStats}
                  onCheckedChange={() => handleNotificationChange('siteStats')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Prywatność</h2>
          <div className="bg-premium-dark/50 dark:bg-premium-dark/50 border border-premium-light/10 dark:border-premium-light/10 p-6 rounded-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Pokaż e-mail</h3>
                  <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                    Wyświetlaj mój adres e-mail publicznie.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showEmail}
                  onCheckedChange={() => handlePrivacyChange('showEmail')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Widoczność profilu</h3>
                  <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                    Pozwól innym zobaczyć mój profil.
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showProfile}
                  onCheckedChange={() => handlePrivacyChange('showProfile')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cache Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Zaawansowane</h2>
          <div className="bg-premium-dark/50 dark:bg-premium-dark/50 border border-premium-light/10 dark:border-premium-light/10 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Wyczyść cache</h3>
                <p className="text-sm text-premium-light/60 dark:text-premium-light/60">
                  Wyczyść cache aplikacji.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={clearCache}
                className="border-premium-light/20 dark:border-premium-light/20 hover:bg-premium-light/10 dark:hover:bg-premium-light/10"
              >
                Wyczyść cache
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
