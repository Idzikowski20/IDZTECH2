
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/utils/supabaseClient';
import TaskManager from '@/components/TaskManager';

const AdminSettings = () => {
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    lastName: '',
    bio: '',
    jobTitle: '',
    profilePicture: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [uploading, setUploading] = useState(false);

  // Pobieranie profilu użytkownika
  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          jobTitle: data.jobTitle || '',
          profilePicture: data.profilePicture || '',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Błąd przy pobieraniu profilu',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Aktualizacja profilu użytkownika
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          lastName: profile.lastName,
          bio: profile.bio,
          jobTitle: profile.jobTitle,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profil zaktualizowany',
        description: 'Twój profil został pomyślnie zaktualizowany',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd przy aktualizacji profilu',
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

  // Obsługa uploadowania zdjęcia
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    if (!user) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `profiles/${user.id}/${Math.random()}.${fileExt}`;

    try {
      setUploading(true);

      // Załaduj plik do Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Pobierz publiczny URL
      const { data } = await supabase.storage.from('avatars').getPublicUrl(filePath);

      // Aktualizuj URL zdjęcia w profilu
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          profilePicture: data.publicUrl,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({
        ...profile,
        profilePicture: data.publicUrl,
      });

      toast({
        title: 'Zdjęcie zaktualizowane',
        description: 'Twoje zdjęcie profilowe zostało zaktualizowane',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Ustawienia</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Bezpieczeństwo</TabsTrigger>
            <TabsTrigger value="tasks">Zadania</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Informacje o profilu</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Imię</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-slate-950"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nazwisko</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="bg-slate-950"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Stanowisko</Label>
                  <Input
                    id="jobTitle"
                    value={profile.jobTitle}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                    className="bg-slate-950"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="bg-slate-950"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="picture">Zdjęcie profilowe</Label>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-premium-dark border border-premium-light/20">
                      {profile.profilePicture ? (
                        <img
                          src={profile.profilePicture}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-premium-light/50">
                          {profile.name ? profile.name[0].toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <Input
                      id="picture"
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="bg-slate-950"
                      disabled={uploading}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="bg-premium-gradient" disabled={loading}>
                    {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Zmiana hasła</h2>
              
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
