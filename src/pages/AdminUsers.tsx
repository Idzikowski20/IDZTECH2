
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/utils/AuthProvider';
import UserSummary from '@/components/admin/UserSummary';
import UserProfileDialog from '@/components/UserProfileDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

type UserRole = 'admin' | 'moderator' | 'blogger' | 'user';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  profilePicture: string | null;
  role: UserRole;
  lastLogin: string | null;
  createdAt: string;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const formattedUsers = data.map(usr => ({
        id: usr.id,
        email: usr.email,
        name: usr.name,
        lastName: usr.lastName,
        profilePicture: usr.profilePicture,
        role: usr.role as UserRole,
        lastLogin: usr.last_login,
        createdAt: usr.created_at,
      }));
      
      // Filter out current user
      const filteredUsers = formattedUsers.filter(u => u.id !== user?.id);
      setUsers(filteredUsers);
      
      // Set current user for summary
      const adminUser = formattedUsers.find(u => u.id === user?.id);
      if (adminUser) {
        setCurrentUser(adminUser);
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
  
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const openUserProfile = (user: UserData) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Sukces",
        description: "Rola użytkownika została zmieniona"
      });
      
      // Update the local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się zmienić roli użytkownika",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Sukces",
        description: "Użytkownik został usunięty"
      });
      
      // Update the local state by removing the deleted user
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć użytkownika",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeClasses = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'moderator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'blogger':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'moderator': return 'Moderator';
      case 'blogger': return 'Bloger';
      default: return 'Użytkownik';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Zarządzanie użytkownikami</h1>
        <p className="text-premium-light/70 mb-6">
          Przeglądaj, dodawaj i zarządzaj użytkownikami systemu.
        </p>
        
        <div className="mb-8">
          {currentUser && <UserSummary user={currentUser} />}
        </div>
        
        {/* User List Table */}
        <div className="overflow-x-auto rounded-lg border border-premium-light/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Imię i nazwisko</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Ostatnie logowanie</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((userData) => (
                <TableRow key={userData.id} className="hover:bg-premium-light/5">
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-premium-gradient flex items-center justify-center mr-3 text-white">
                        {userData.profilePicture ? (
                          <img 
                            src={userData.profilePicture} 
                            alt={userData.name || ""} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{userData.name} {userData.lastName}</div>
                        <div className="text-xs text-premium-light/60">
                          Od: {userData.createdAt ? format(new Date(userData.createdAt), 'dd MMMM yyyy', { locale: pl }) : 'Brak danych'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{userData.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeClasses(userData.role)}>
                      {getRoleDisplay(userData.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {userData.lastLogin 
                      ? format(new Date(userData.lastLogin), 'dd.MM.yyyy HH:mm', { locale: pl })
                      : 'Brak danych'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Zmień rolę
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleChange(userData.id, 'admin')}>
                            Administrator
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(userData.id, 'moderator')}>
                            Moderator
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(userData.id, 'blogger')}>
                            Bloger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(userData.id, 'user')}>
                            Użytkownik
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(userData.id)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {users.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Brak użytkowników do wyświetlenia
                  </TableCell>
                </TableRow>
              )}
              
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Ładowanie...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <UserProfileDialog 
        user={selectedUser} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </AdminLayout>
  );
};

export default AdminUsers;
