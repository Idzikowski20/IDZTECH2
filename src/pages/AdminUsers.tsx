
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Eye, Edit, Trash2, UserPlus, Shield } from 'lucide-react';
import { useAuth, UserRole, User } from '@/utils/auth';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const userRoles: Record<UserRole, string> = {
  'admin': 'Administrator',
  'moderator': 'Moderator',
  'blogger': 'Bloger',
  'user': 'Użytkownik',
};

const userFormSchema = z.object({
  email: z.string().email('Wprowadź poprawny adres email'),
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().optional(),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  role: z.enum(['admin', 'moderator', 'blogger', 'user'] as const),
});

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user, getUsers, addUser, updateUserRole, getUserById } = useAuth();
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  
  // Form handling
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      name: '',
      lastName: '',
      password: '',
      role: 'user',
    }
  });

  // Redirect if not authenticated or not admin/moderator
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'moderator')) {
    navigate('/login');
    return null;
  }

  const users = getUsers();
  
  const handleUserProfileClick = (userId: string) => {
    // In a real app, this would navigate to a user profile page
    const profileUser = getUserById(userId);
    if (profileUser) {
      setSelectedUser(profileUser);
      // Navigate to user profile view
      // For now we'll just show a toast
      toast({
        title: "Profil użytkownika",
        description: `Wyświetlanie profilu: ${profileUser.name} ${profileUser.lastName || ''}`,
      });
    }
  };
  
  const handleRoleChange = (userId: string) => {
    const targetUser = getUserById(userId);
    if (targetUser) {
      setSelectedUser(targetUser);
      setUserRole(targetUser.role);
      setShowRoleDialog(true);
    }
  };
  
  const handleRoleSubmit = () => {
    if (selectedUser && userRole) {
      const success = updateUserRole(selectedUser.id, userRole);
      if (success) {
        toast({
          title: "Rola zaktualizowana",
          description: `Rola użytkownika ${selectedUser.name} została zmieniona na ${userRoles[userRole]}`
        });
        setShowRoleDialog(false);
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się zaktualizować roli użytkownika",
          variant: "destructive"
        });
      }
    }
  };
  
  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    const success = addUser({
      email: data.email,
      name: data.name,
      lastName: data.lastName || '',
      role: data.role,
    }, data.password);
    
    if (success) {
      toast({
        title: "Użytkownik dodany",
        description: `Nowy użytkownik ${data.name} został utworzony pomyślnie`
      });
      setShowAddUserDialog(false);
      form.reset();
    } else {
      toast({
        title: "Błąd",
        description: "Ten adres email jest już zajęty",
        variant: "destructive"
      });
    }
  };

  const topUser = users.length > 0 ? 
    [...users].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))[0] : 
    null;

  const canManageUsers = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Zarządzanie użytkownikami</h1>
          <p className="text-premium-light/70">
            Przeglądaj, dodawaj i zarządzaj użytkownikami systemu.
          </p>
        </div>

        {/* Top User Card */}
        {topUser && (
          <div className="mb-8 bg-premium-dark/50 border border-premium-light/10 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Najlepszy twórca treści</h2>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={topUser.profilePicture} alt={topUser.name} />
                <AvatarFallback className="text-lg bg-premium-gradient">
                  {topUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {topUser.name} {topUser.lastName}
                </h3>
                <p className="text-premium-light/70 mb-1">
                  {userRoles[topUser.role]}
                </p>
                <div className="flex gap-6 mt-3">
                  <div>
                    <p className="text-xs text-premium-light/60">Utworzone posty</p>
                    <p className="text-2xl font-bold">{topUser.postsCreated}</p>
                  </div>
                  <div>
                    <p className="text-xs text-premium-light/60">Wyświetlenia</p>
                    <p className="text-2xl font-bold">{topUser.totalViews}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Lista użytkowników</h2>
            
            {canManageUsers && (
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-premium-gradient hover:scale-105 transition-transform">
                    <UserPlus size={16} className="mr-2" /> Dodaj użytkownika
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
                    <DialogDescription>
                      Wypełnij poniższy formularz, aby utworzyć nowe konto użytkownika.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Imię</FormLabel>
                              <FormControl>
                                <Input placeholder="Jan" {...field} />
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
                                <Input placeholder="Kowalski" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="jan@example.com" {...field} />
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
                              <Input type="password" placeholder="••••••••" {...field} />
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
                                {user?.role === 'admin' && (
                                  <SelectItem value="admin">Administrator</SelectItem>
                                )}
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="blogger">Bloger</SelectItem>
                                <SelectItem value="user">Użytkownik</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                          Anuluj
                        </Button>
                        <Button type="submit">
                          Dodaj użytkownika
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Użytkownik</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rola</TableHead>
                    <TableHead>Statystyki</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profilePicture} alt={user.name} />
                            <AvatarFallback className="text-xs bg-premium-gradient">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name} {user.lastName}</p>
                            <p className="text-xs text-premium-light/60">
                              Dołączył: {new Date(user.createdAt || '').toLocaleDateString('pl-PL')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            user.role === 'admin' ? "bg-red-500" : 
                            user.role === 'moderator' ? "bg-amber-500" : 
                            user.role === 'blogger' ? "bg-green-500" : 
                            "bg-blue-500"
                          )}></div>
                          {userRoles[user.role]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-xs text-premium-light/60">Posty</p>
                            <p className="font-semibold">{user.postsCreated}</p>
                          </div>
                          <div>
                            <p className="text-xs text-premium-light/60">Wyświetlenia</p>
                            <p className="font-semibold">{user.totalViews}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUserProfileClick(user.id)}
                            className="text-blue-400 hover:text-white hover:bg-blue-500 transition-colors"
                          >
                            <Eye size={14} />
                          </Button>
                          
                          {canManageUsers && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRoleChange(user.id)}
                              className="text-amber-400 hover:text-white hover:bg-amber-500 transition-colors"
                            >
                              <Shield size={14} />
                            </Button>
                          )}
                          
                          {user?.role === 'admin' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                // W rzeczywistej aplikacji tutaj byłaby opcja usuwania
                                toast({
                                  title: "Opcja niedostępna",
                                  description: "Ta funkcja nie jest jeszcze dostępna",
                                });
                              }}
                              className="text-red-400 hover:text-white hover:bg-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Role change dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmiana roli użytkownika</DialogTitle>
            <DialogDescription>
              Zmień rolę dla użytkownika {selectedUser?.name} {selectedUser?.lastName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm mb-2">Wybierz nową rolę:</label>
              <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz rolę" />
                </SelectTrigger>
                <SelectContent>
                  {user?.role === 'admin' && (
                    <SelectItem value="admin">Administrator</SelectItem>
                  )}
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="blogger">Bloger</SelectItem>
                  <SelectItem value="user">Użytkownik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Anuluj</Button>
            <Button onClick={handleRoleSubmit}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
