
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, useAuth } from '@/utils/AuthProvider';
import { fetchAllUsers } from '@/utils/authIntegration';
import { Loader2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Pobierz użytkowników z Supabase
        const supabaseUsers = await fetchAllUsers();
        setUsers(supabaseUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  const isAdmin = currentUser?.role === 'admin';
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-premium-purple" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zarządzaj użytkownikami</h1>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Dodaj użytkownika</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
              </DialogHeader>
              <UserForm />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nazwa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rola
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data utworzenia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ostatnie logowanie
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                        <div className="text-sm font-medium dark:text-white">
                          {user.name} {user.lastName || ''}
                        </div>
                        {user.jobTitle && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.jobTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {new Date(user.created_at).toLocaleDateString('pl-PL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('pl-PL') : 'Nigdy'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Edytuj
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edytuj użytkownika</DialogTitle>
                        </DialogHeader>
                        <UserForm userId={user.id} user={user} />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserForm = ({ userId, user }: { userId?: string; user?: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Tutaj implementacja dodawania/edytowania użytkownika
      console.log("Form submitted:", formData);
      
      // Symulacja opóźnienia
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
        <Label htmlFor="role">Rola</Label>
        <select 
          id="role"
          name="role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
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
            required={!userId} // wymagane tylko przy tworzeniu
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
