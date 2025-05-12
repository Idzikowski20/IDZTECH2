
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2, CheckCircle, Edit, Users, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { makeUserAdmin } from '@/utils/cms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabaseClient';

interface UserOption {
  id: string;
  email: string;
  name: string | null;
}

const AdminCMS = () => {
  const { loading, user } = useAuth();
  const [isSettingAdminRole, setIsSettingAdminRole] = useState(false);
  const adminEmail = "patryk.idzikowski@interia.pl";
  const [adminAccessGranted, setAdminAccessGranted] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isGrantingPermission, setIsGrantingPermission] = useState(false);
  const [autoPublish, setAutoPublish] = useState(false);

  useEffect(() => {
    // Set this user as admin if it's the specific email
    const setupAdminUser = async () => {
      if (user?.email === adminEmail && !adminAccessGranted) {
        setIsSettingAdminRole(true);
        try {
          const success = await makeUserAdmin(adminEmail);
          if (success) {
            setAdminAccessGranted(true);
            toast.success("Ustawiono rolę administratora dla Twojego konta");
          }
        } catch (error) {
          console.error("Error setting up admin:", error);
          toast.error("Nie udało się ustawić roli administratora");
        } finally {
          setIsSettingAdminRole(false);
        }
      }
    };

    if (user?.email) {
      setupAdminUser();
      fetchUsers();
    }
  }, [user, adminAccessGranted, adminEmail]);

  const fetchUsers = async () => {
    setIsFetchingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Nie udało się pobrać listy użytkowników");
    } finally {
      setIsFetchingUsers(false);
    }
  };

  const grantCMSAccess = async () => {
    if (!selectedUser) {
      toast.error("Wybierz użytkownika, aby nadać uprawnienia");
      return;
    }

    setIsGrantingPermission(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'moderator' 
        })
        .eq('id', selectedUser);
        
      if (error) throw error;
      
      toast.success("Nadano uprawnienia do edycji CMS");
    } catch (error) {
      console.error("Error granting permissions:", error);
      toast.error("Nie udało się nadać uprawnień");
    } finally {
      setIsGrantingPermission(false);
    }
  };

  if (loading || isSettingAdminRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {isSettingAdminRole ? "Konfigurowanie uprawnień administratora..." : "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Panel zarządzania CMS</h1>
        
        {adminAccessGranted && (
          <Alert className="bg-green-500/20 border border-green-500/30 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertTitle>Uprawnienia administratora</AlertTitle>
            <AlertDescription className="mt-2">
              Pomyślnie przyznano uprawnienia administratora dla konta {adminEmail}.
              Możesz teraz zarządzać treścią CMS.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 bg-premium-dark/50 border border-premium-light/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Edycja wizualna (WordPress-style)</CardTitle>
              <CardDescription>
                Skorzystaj z wizualnego edytora treści, który pozwala na edycję zawartości strony 
                w przyjaznym trybie graficznym, podobnym do Elementora.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/visual-editor">
                <Button className="bg-premium-gradient hover:bg-premium-purple/80 transition-colors w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Przejdź do edytora wizualnego
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="p-6 bg-premium-dark/50 border border-premium-light/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Zarządzanie uprawnieniami</CardTitle>
              <CardDescription>
                Nadaj uprawnienia do edycji treści CMS wybranym użytkownikom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="user-select">Wybierz użytkownika</Label>
                  <Select 
                    value={selectedUser} 
                    onValueChange={setSelectedUser}
                    disabled={isFetchingUsers}
                  >
                    <SelectTrigger id="user-select">
                      <SelectValue placeholder="Wybierz użytkownika" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || 'Bez nazwy'} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={grantCMSAccess} 
                  disabled={!selectedUser || isGrantingPermission}
                  className="w-full"
                >
                  {isGrantingPermission ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Nadawanie uprawnień...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Nadaj uprawnienia do edycji CMS
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="p-6 bg-premium-dark/50 border border-premium-light/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <Settings className="inline-block mr-2 h-5 w-5" />
              Ustawienia CMS
            </CardTitle>
            <CardDescription>
              Konfiguracja działania systemu zarządzania treścią.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Automatyczne publikowanie</h3>
                  <p className="text-premium-light/70 text-sm">
                    Automatycznie publikuj zmiany bez potrzeby ręcznego zatwierdzania
                  </p>
                </div>
                <Switch 
                  checked={autoPublish} 
                  onCheckedChange={setAutoPublish} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Buforowanie strony</h3>
                  <p className="text-premium-light/70 text-sm">
                    Włącz buforowanie strony dla lepszej wydajności
                  </p>
                </div>
                <Switch 
                  checked={true} 
                  onCheckedChange={() => {}}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">System wersjonowania</h3>
                  <p className="text-premium-light/70 text-sm">
                    Przechowuj wersje zmian umożliwiające wycofanie modyfikacji
                  </p>
                </div>
                <Switch 
                  checked={true} 
                  onCheckedChange={() => {}}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Powiadomienia o zmianach</h3>
                  <p className="text-premium-light/70 text-sm">
                    Wysyłaj powiadomienia email o wprowadzonych zmianach w treści
                  </p>
                </div>
                <Switch 
                  checked={false} 
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;
