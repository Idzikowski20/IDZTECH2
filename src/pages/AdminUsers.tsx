
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { UserPlusIcon, UserIcon, Trash, Edit, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import UserProfileDialog from '@/components/UserProfileDialog';
import { addUser, updateUserRole, deleteUser } from '@/utils/authIntegration';
import { User, UserRole } from '@/utils/authTypes';

// Type for valid database user roles that can be saved to Supabase
type ValidDbRole = 'admin' | 'editor' | 'user';

// Function to map app roles to database roles
const mapToValidDbRole = (role: string): ValidDbRole => {
  if (role === 'admin') return 'admin';
  if (role === 'moderator' || role === 'blogger') return 'editor';
  return 'user';
};

const formSchema = z.object({
  email: z.string().email("Wprowadź prawidłowy adres email"),
  name: z.string().min(2, "Imię musi mieć przynajmniej 2 znaki"),
  lastName: z.string().optional(),
  role: z.enum(["admin", "editor", "user", "moderator", "blogger"] as const),
  password: z.string().min(8, "Hasło musi mieć przynajmniej 8 znaków")
});

const editRoleSchema = z.object({
  role: z.enum(["admin", "editor", "user", "moderator", "blogger"] as const)
});

const AdminUsers = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewProfileDialogOpen, setViewProfileDialogOpen] = useState(false);
  
  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      lastName: "",
      role: "user",
      password: ""
    }
  });

  const editRoleForm = useForm<z.infer<typeof editRoleSchema>>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      role: "user"
    }
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'admin') {
      navigate('/admin');
      toast({
        title: "Brak dostępu",
        description: "Nie masz uprawnień do tej strony",
        variant: "destructive"
      });
      return;
    }
    
    fetchUsers();
  }, [isAuthenticated, navigate, user?.role, toast]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from Supabase users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać listy użytkowników.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const onAddSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await addUser({
        email: values.email,
        name: values.name,
        lastName: values.lastName || '',
        role: values.role as UserRole,
      }, values.password);
      
      if (result.success) {
        toast({
          title: "Sukces",
          description: "Użytkownik został dodany."
        });
        setAddDialogOpen(false);
        addForm.reset();
        fetchUsers();
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się dodać użytkownika.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd.",
        variant: "destructive"
      });
    }
  };
  
  const onEditRoleSubmit = async (values: z.infer<typeof editRoleSchema>) => {
    if (!selectedUser) return;
    
    try {
      const success = await updateUserRole(selectedUser.id, values.role as UserRole);
      
      if (success) {
        toast({
          title: "Sukces",
          description: "Rola użytkownika została zmieniona."
        });
        setEditRoleDialogOpen(false);
        fetchUsers();
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się zmienić roli użytkownika.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditRoleClick = (user: any) => {
    setSelectedUser(user);
    editRoleForm.setValue("role", user.role === 'editor' ? 'editor' : user.role);
    setEditRoleDialogOpen(true);
  };
  
  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setConfirmDeleteDialogOpen(true);
  };
  
  const handleViewProfileClick = (user: any) => {
    setSelectedUser(user);
    setViewProfileDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      const success = await deleteUser(selectedUser.id);
      
      if (success) {
        toast({
          title: "Sukces",
          description: "Użytkownik został usunięty."
        });
        setConfirmDeleteDialogOpen(false);
        fetchUsers();
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się usunąć użytkownika.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd.",
        variant: "destructive"
      });
    }
  };
  
  // Create a new user directly in Supabase
  const createUserDirectly = async (userData: any) => {
    try {
      // Create auth user with email/password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            lastName: userData.lastName,
            role: userData.role
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        return { success: false, error: new Error('No user returned from signup') };
      }
      
      // Now create an entry in the users table
      const dbRole = mapToValidDbRole(userData.role);
      
      const { error: insertError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.name,
        last_name: userData.lastName || null,
        role: dbRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      if (insertError) throw insertError;
      
      return { success: true };
    } catch (error) {
      console.error('Error creating user directly:', error);
      return { success: false, error };
    }
  };
  
  // Special handler for adding users when the regular method might not work
  const handleAddUserDirectly = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await createUserDirectly({
        email: values.email,
        name: values.name,
        lastName: values.lastName,
        role: values.role,
        password: values.password
      });
      
      if (result.success) {
        toast({
          title: "Sukces",
          description: "Użytkownik został dodany bezpośrednio."
        });
        setAddDialogOpen(false);
        addForm.reset();
        fetchUsers();
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się dodać użytkownika bezpośrednio.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd.",
        variant: "destructive"
      });
    }
  };
  
  // Format user's role for display
  const formatRole = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'editor': return 'Edytor/Moderator';
      case 'user': return 'Użytkownik';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };
  
  // Prepare user data for profile display
  const prepareUserForProfile = (user: any) => {
    return {
      id: user.id,
      email: user.email,
      name: user.first_name || '',
      lastName: user.last_name || '',
      profilePicture: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
      last_login: user.last_login || user.updated_at
    };
  };
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Zarządzanie Użytkownikami</h1>
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="bg-premium-gradient hover:bg-premium-gradient-hover"
            >
              <UserPlusIcon className="mr-2 h-4 w-4" /> Dodaj Użytkownika
            </Button>
          </div>
          <p className="text-premium-light/70 mt-2">
            Zarządzaj użytkownikami systemu, ich rolami i uprawnieniami.
          </p>
        </div>
        
        <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-premium-dark/80 border-b border-premium-light/10">
                <tr>
                  <th className="py-3 px-4 text-left">Imię i Nazwisko</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Rola</th>
                  <th className="py-3 px-4 text-left">Data utworzenia</th>
                  <th className="py-3 px-4 text-left">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-light/10">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-premium-light/70">
                      Ładowanie użytkowników...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-premium-light/70">
                      Brak użytkowników do wyświetlenia.
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-premium-light/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.first_name} 
                              className="h-8 w-8 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-premium-gradient flex items-center justify-center text-white mr-3">
                              {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                            </div>
                          )}
                          <span>{user.first_name} {user.last_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                          user.role === 'editor' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-premium-light/70">
                        {new Date(user.created_at).toLocaleDateString('pl-PL')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProfileClick(user)}
                            className="hover:bg-premium-light hover:text-premium-dark"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRoleClick(user)}
                            className="hover:bg-premium-light hover:text-premium-dark"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="hover:bg-red-500 hover:text-white"
                            disabled={user.id === current_user?.id}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dodaj Nowego Użytkownika</DialogTitle>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Imię" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwisko" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rola</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz rolę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="editor">Edytor</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="blogger">Blogger</SelectItem>
                        <SelectItem value="user">Użytkownik</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Hasło" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="secondary" onClick={() => setAddDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button type="submit" className="bg-premium-gradient ml-2">
                  Dodaj
                </Button>
                <Button type="button" onClick={() => handleAddUserDirectly(addForm.getValues())} variant="outline">
                  Dodaj Bezpośrednio
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zmień rolę użytkownika</DialogTitle>
          </DialogHeader>
          <Form {...editRoleForm}>
            <form onSubmit={editRoleForm.handleSubmit(onEditRoleSubmit)} className="space-y-4">
              <FormField
                control={editRoleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rola</FormLabel>
                    <Select
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz rolę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="editor">Edytor</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="blogger">Blogger</SelectItem>
                        <SelectItem value="user">Użytkownik</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="button" variant="secondary" onClick={() => setEditRoleDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button type="submit" className="bg-premium-gradient ml-2">
                  Zapisz
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Usuń użytkownika</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Czy na pewno chcesz usunąć tego użytkownika? Tej operacji nie można cofnąć.</p>
            {selectedUser && (
              <div className="mt-4 p-4 bg-premium-light/5 rounded-lg">
                <div className="flex items-center">
                  <UserIcon className="h-6 w-6 text-premium-light/70 mr-3" />
                  <div>
                    <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                    <p className="text-sm text-premium-light/70">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 ml-2"
            >
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View User Profile Dialog */}
      <UserProfileDialog 
        user={selectedUser ? prepareUserForProfile(selectedUser) : null} 
        open={viewProfileDialogOpen}
        onOpenChange={setViewProfileDialogOpen}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
