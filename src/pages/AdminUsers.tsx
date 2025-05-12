
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/utils/AuthProvider';
import { User } from '@/utils/authTypes';
import { fetchAllUsers, deleteUser as deleteUserApi, addUser as addUserApi, updateUserRole as updateUserRoleApi } from '@/utils/authIntegration';
import { Loader2, UserRound, Shield, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import UserProfileDialog from '@/components/UserProfileDialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Fetch users from Supabase
        const supabaseUsers = await fetchAllUsers();
        console.log("Fetched users:", supabaseUsers);
        setUsers(supabaseUsers);
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
        await deleteUserApi(userId);
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

  const viewUserProfile = (user: User) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };
  
  const isAdmin = currentUser?.role === 'admin';
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-premium-purple" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] bg-premium-dark">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Brak uprawnień</h2>
            <p className="text-gray-300 mb-6">
              Tylko administratorzy mają dostęp do zarządzania użytkownikami.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zarządzaj użytkownikami</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Dodaj użytkownika</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
              </DialogHeader>
              <UserForm onSuccess={(newUser) => {
                setUsers([...users, newUser]);
                toast({
                  title: "Sukces",
                  description: "Użytkownik został dodany",
                });
              }} />
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
                  className="border-b border-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      {user.profilePicture ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profilePicture}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-premium-gradient flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0)}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.name} {user.lastName || ''}
                        </div>
                        {user.jobTitle && (
                          <div className="text-xs text-gray-400">
                            {user.jobTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-100">
                      {user.role || 'user'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pl-PL') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('pl-PL') : 'Nigdy'}
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
                        <Button variant="outline" size="sm" className="bg-transparent text-white hover:bg-white hover:text-black border-none">
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
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User Profile Dialog */}
      <UserProfileDialog user={selectedUser} open={profileOpen} onOpenChange={setProfileOpen} />
    </AdminLayout>
  );
};

const UserForm = ({ userId, user, onSuccess }: { userId?: string; user?: any; onSuccess?: (user: any) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
    lastName: user?.lastName || '',
    jobTitle: user?.jobTitle || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let result;
      
      if (userId) {
        // Update existing user
        result = await updateUserRoleApi(userId, formData.role as any);
        console.log("User updated:", result);
      } else {
        // Add new user
        result = await addUserApi({
          name: formData.name,
          email: formData.email,
          role: formData.role as any,
          lastName: formData.lastName,
          jobTitle: formData.jobTitle,
          profilePicture: '',
          stats: {
            views: 0,
            posts: 0,
            comments: 0,
            likes: 0,
            pointsTotal: 0,
            pointsThisMonth: 0,
            lastUpdated: new Date().toISOString()
          }
        }, formData.password);
        console.log("User added:", result);
      }
      
      if (onSuccess) {
        onSuccess({
          id: userId || result?.id || Math.random().toString(),
          ...formData,
          createdAt: user?.createdAt || new Date().toISOString(),
          lastLogin: user?.lastLogin || null
        });
      }
    } catch (error) {
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
          <Label htmlFor="name">Imię</Label>
          <Input 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nazwisko</Label>
          <Input 
            id="lastName"
            name="lastName"
            value={formData.lastName}
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
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Stanowisko</Label>
        <Input 
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
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
          <option value="blogger">Bloger</option>
          <option value="moderator">Moderator</option>
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

export default AdminUsers;
