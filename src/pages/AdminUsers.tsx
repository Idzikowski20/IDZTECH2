import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/utils/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserRound, Edit, Trash2, Plus } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch users from Supabase
        const { data: users, error } = await supabase
          .from('users')
          .select('*');
          
        if (error) {
          console.error("Error loading users:", error);
          toast({
            title: "Błąd",
            description: "Nie udało się załadować użytkowników",
            variant: "destructive"
          });
          return;
        }
        
        setUsers(users || []);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się załadować użytkowników",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [toast]);

  const handleDelete = async (userId: string) => {
    if (confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Sukces",
          description: "Użytkownik został usunięty",
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć użytkownika",
          variant: "destructive"
        });
      }
    }
  };

  const viewUserProfile = (user: UserProfile) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-premium-purple" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zarządzaj użytkownikami</h1>
          <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-premium-gradient">
                <Plus className="mr-2 h-4 w-4" /> Dodaj użytkownika
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
              </DialogHeader>
              <UserForm 
                onSuccess={(newUser) => {
                  setUsers([...users, newUser]);
                  setAddUserOpen(false);
                  toast({
                    title: "Sukces",
                    description: "Użytkownik został dodany",
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-transparent rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-gray-300 uppercase">Nazwa</TableHead>
                <TableHead className="text-gray-300 uppercase">Email</TableHead>
                <TableHead className="text-gray-300 uppercase">Rola</TableHead>
                <TableHead className="text-gray-300 uppercase">Data utworzenia</TableHead>
                <TableHead className="text-gray-300 uppercase">Ostatnie logowanie</TableHead>
                <TableHead className="text-gray-300 uppercase text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      {user.avatar_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.avatar_url}
                          alt={user.first_name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">
                          {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.first_name} {user.last_name || ''}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-900 text-purple-100' : 'bg-green-900 text-green-100'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString('pl-PL') : 'Nigdy'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent text-white hover:bg-white hover:text-black border-none"
                      onClick={() => viewUserProfile(user)}
                    >
                      <UserRound className="h-4 w-4 mr-1" />
                      Profil
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent text-white hover:bg-white hover:text-black border-none"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edytuj
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edytuj użytkownika</DialogTitle>
                        </DialogHeader>
                        <UserForm 
                          userId={user.id} 
                          user={user} 
                          onSuccess={(updatedUser) => {
                            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                            toast({
                              title: "Sukces",
                              description: "Użytkownik został zaktualizowany",
                            });
                          }} 
                        />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-transparent text-red-500 hover:bg-red-500 hover:text-white border-none"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Usuń
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    Brak użytkowników do wyświetlenia
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User Profile Dialog */}
      <UserProfileDialog 
        user={selectedUser} 
        open={profileOpen} 
        onOpenChange={setProfileOpen} 
      />
    </AdminLayout>
  );
};

interface UserFormProps {
  userId?: string;
  user?: UserProfile;
  onSuccess?: (user: UserProfile) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userId, user, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (userId) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role
          })
          .eq('id', userId);
        
        if (error) throw error;
      } else {
        // Add new user via signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.first_name,
              last_name: formData.last_name
            }
          }
        });
        
        if (error) throw error;
        
        // Create user entry
        if (data.user) {
          const { error: userError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: formData.email,
              first_name: formData.first_name,
              last_name: formData.last_name,
              role: formData.role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (userError) throw userError;
        }
      }
      
      if (onSuccess) {
        onSuccess({
          id: userId || Math.random().toString(),
          ...formData,
          created_at: user?.created_at || new Date().toISOString(),
          updated_at: user?.updated_at || new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Błąd",
        description: userId ? "Nie udało się zaktualizować użytkownika" : "Nie udało się dodać użytkownika",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Imię</Label>
          <Input 
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Nazwisko</Label>
          <Input 
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={!!userId} // Can't change email for existing user
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Rola</Label>
        <select 
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-3"
          required
        >
          <option value="user">Użytkownik</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      
      {!userId && (
        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input 
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!userId}
          />
        </div>
      )}
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Przetwarzanie...
            </>
          ) : userId ? 'Zapisz zmiany' : 'Dodaj użytkownika'}
        </Button>
      </div>
    </form>
  );
};

const UserProfileDialog = ({ user, open, onOpenChange }: { 
  user: UserProfile | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profil użytkownika</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.first_name} 
              className="h-24 w-24 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-premium-gradient flex items-center justify-center text-white text-xl font-bold mb-4">
              {user.first_name ? user.first_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
          )}
          
          <h3 className="text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h3>
          
          <span className={`px-3 py-1 mt-2 ${
            user.role === 'admin' ? 'bg-purple-900 text-purple-100' : 'bg-green-900 text-green-100'
          } text-xs rounded-full`}>
            {user.role || 'user'}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-muted-foreground w-32">Email:</span>
            <span>{user.email}</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-muted-foreground w-32">Data utworzenia:</span>
            <span>{user.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : 'N/A'}</span>
          </div>
          
          <div className="flex items-center">
            <span className="text-muted-foreground w-32">Ostatnie logowanie:</span>
            <span>{user.updated_at ? new Date(user.updated_at).toLocaleDateString('pl-PL') : 'Nigdy'}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUsers;
