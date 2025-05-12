
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { useAuth, UserRole } from '@/utils/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { refreshUserStats } from '@/utils/authStatsFunctions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const newUserSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  lastName: z.string().optional(),
  email: z.string().email("Niepoprawny adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  role: z.enum(["user", "moderator", "editor", "admin"])
});

type NewUserFormValues = z.infer<typeof newUserSchema>;

const AdminUsers = () => {
  const { getUsers, updateUserRole, deleteUser, user: currentUser, addUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProfile, setActiveProfile] = useState<any>(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  // Form for new user
  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      role: "user"
    }
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersList = await getUsers();
        
        // Filter out duplicates and the current user
        const uniqueUsers = usersList.filter((user, index, self) => 
          index === self.findIndex(u => u.id === user.id) && 
          user.id !== currentUser?.id
        );
        
        setUsers(uniqueUsers);
        
        // Set the first user as active profile if available
        if (uniqueUsers.length > 0 && !activeProfile) {
          setActiveProfile(uniqueUsers[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Błąd",
          description: "Nie udało się pobrać listy użytkowników",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [getUsers, toast, currentUser]);

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const result = await updateUserRole(userId, newRole);
      
      if (result) {
        // Update local state
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        
        // Update active profile if needed
        if (activeProfile && activeProfile.id === userId) {
          setActiveProfile(prev => ({ ...prev, role: newRole }));
        }
        
        toast({
          title: "Sukces",
          description: "Rola użytkownika została zaktualizowana"
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować roli użytkownika",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem przy aktualizacji roli",
        variant: "destructive"
      });
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego użytkownika? Tej operacji nie można cofnąć.")) {
      try {
        const result = await deleteUser(userId);
        
        if (result) {
          // Update users list
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
          
          // Clear active profile if deleted
          if (activeProfile && activeProfile.id === userId) {
            setActiveProfile(users.find(u => u.id !== userId) || null);
          }
          
          toast({
            title: "Sukces",
            description: "Użytkownik został usunięty"
          });
        } else {
          toast({
            title: "Błąd",
            description: "Nie udało się usunąć użytkownika",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Błąd",
          description: "Wystąpił problem przy usuwaniu użytkownika",
          variant: "destructive"
        });
      }
    }
  };

  // Handle viewing user profile
  const handleViewProfile = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setActiveProfile(selectedUser);
    }
  };

  // Create new user
  const onSubmitNewUser = async (data: NewUserFormValues) => {
    try {
      const result = await addUser({
        email: data.email,
        name: data.name,
        lastName: data.lastName || "",
        role: data.role,
        profilePicture: "",
      }, data.password);
      
      if (result) {
        // Refresh users list
        const updatedUsers = await getUsers();
        const uniqueUsers = updatedUsers.filter((user, index, self) => 
          index === self.findIndex(u => u.id === user.id) && 
          user.id !== currentUser?.id
        );
        setUsers(uniqueUsers);
        
        toast({
          title: "Sukces",
          description: "Użytkownik został dodany",
        });
        
        setShowNewUserModal(false);
        form.reset();
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się dodać użytkownika",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem przy dodawaniu użytkownika",
        variant: "destructive"
      });
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "Nigdy";
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return "bg-red-500 hover:bg-red-600";
      case 'editor': return "bg-blue-500 hover:bg-blue-600";
      case 'moderator': return "bg-green-500 hover:bg-green-600";
      default: return "bg-slate-500 hover:bg-slate-600";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Zarządzanie użytkownikami</h1>
            <p className="text-premium-light/70">
              Zarządzaj użytkownikami, przypisuj role i uprawnienia
            </p>
          </div>
          <Button 
            onClick={() => setShowNewUserModal(true)}
            className="bg-premium-gradient hover:opacity-90 transition-opacity"
          >
            <UserPlus size={16} className="mr-2" />
            Dodaj użytkownika
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-premium-light/10">
                <h2 className="text-lg font-bold">Użytkownicy</h2>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Ładowanie użytkowników...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Użytkownik</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rola</TableHead>
                        <TableHead>Ostatnie logowanie</TableHead>
                        <TableHead>Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-premium-light/70">
                            Brak użytkowników do wyświetlenia
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow 
                            key={user.id}
                            className={activeProfile && activeProfile.id === user.id ? "bg-premium-light/10" : ""}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={user.profilePicture} alt={user.name} />
                                  <AvatarFallback className="bg-premium-gradient">
                                    {user.name ? user.name[0] : '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name} {user.lastName}</div>
                                  <div className="text-xs text-premium-light/60">ID: {user.id.substring(0, 8)}...</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-premium-light/80">{user.email}</TableCell>
                            <TableCell>
                              <Badge className={`${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-premium-light/80">
                              {formatDate(user.lastLogin)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewProfile(user.id)}
                                  className="text-blue-400 hover:text-white hover:bg-blue-500"
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-400 hover:text-white hover:bg-red-500"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="lg:col-span-1">
            {activeProfile ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>Profil użytkownika</CardTitle>
                      <Badge className={`${getRoleBadgeColor(activeProfile.role)}`}>
                        {activeProfile.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={activeProfile.profilePicture} alt={activeProfile.name} />
                        <AvatarFallback className="text-2xl bg-premium-gradient">
                          {activeProfile.name ? activeProfile.name[0] : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold">{activeProfile.name} {activeProfile.lastName}</h3>
                      <p className="text-premium-light/70">{activeProfile.email}</p>
                      {activeProfile.jobTitle && (
                        <p className="text-sm mt-1 text-premium-light/90">{activeProfile.jobTitle}</p>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {activeProfile.bio && (
                        <div>
                          <h4 className="text-sm font-semibold text-premium-light/70 mb-1">Bio</h4>
                          <p className="text-sm">{activeProfile.bio}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-semibold text-premium-light/70 mb-1">Dołączył(a)</h4>
                        <p className="text-sm">{formatDate(activeProfile.createdAt)}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-premium-light/70 mb-1">Ostatnie logowanie</h4>
                        <p className="text-sm">{formatDate(activeProfile.lastLogin)}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-premium-light/70 mb-2">Zarządzaj rolą</h4>
                        <Select
                          value={activeProfile.role}
                          onValueChange={(value) => handleRoleChange(activeProfile.id, value as UserRole)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz rolę" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Użytkownik</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="editor">Edytor</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <UserCheck className="mr-2 text-blue-500" size={16} />
                      Statystyki użytkownika
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-premium-light/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{activeProfile.stats?.posts || 0}</div>
                        <div className="text-xs text-premium-light/70">Posty</div>
                      </div>
                      <div className="border border-premium-light/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{activeProfile.stats?.views || 0}</div>
                        <div className="text-xs text-premium-light/70">Wyświetlenia</div>
                      </div>
                      <div className="border border-premium-light/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{activeProfile.stats?.comments || 0}</div>
                        <div className="text-xs text-premium-light/70">Komentarze</div>
                      </div>
                      <div className="border border-premium-light/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{activeProfile.stats?.likes || 0}</div>
                        <div className="text-xs text-premium-light/70">Polubienia</div>
                      </div>
                    </div>
                    <div className="mt-4 border border-premium-light/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">{activeProfile.stats?.pointsTotal || 0}</div>
                      <div className="text-xs text-premium-light/70">Łączna punktacja</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-8 text-center">
                <p className="text-premium-light/70 mb-4">
                  Wybierz użytkownika z listy, aby wyświetlić jego profil
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New User Modal */}
      <Dialog open={showNewUserModal} onOpenChange={setShowNewUserModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
            <DialogDescription>
              Wprowadź dane nowego użytkownika. Po dodaniu będzie mógł logować się na konto.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder="Imię użytkownika" {...field} />
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
                      <Input placeholder="Nazwisko (opcjonalnie)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="adres@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input placeholder="Min. 6 znaków" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rola</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz rolę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">Użytkownik</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="editor">Edytor</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewUserModal(false)}
                  className="mr-2"
                >
                  Anuluj
                </Button>
                <Button type="submit" className="bg-premium-gradient">
                  Dodaj użytkownika
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
