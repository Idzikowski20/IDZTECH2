import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/utils/authStore';
import { User } from '@/utils/authTypes';
import UserSummary from '@/components/admin/UserSummary';

const AdminUsers = () => {
  const { getUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        
        // Find the admin user
        const admin = fetchedUsers.find(user => 
          user.role === 'admin' && user.email === 'patryk.idzikowski@interia.pl'
        );
        
        if (admin) {
          setCurrentUser(admin);
        } else if (fetchedUsers.length > 0) {
          // Default to first user if admin not found
          setCurrentUser(fetchedUsers[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [getUsers]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Zarządzanie użytkownikami</h1>
        <p className="text-premium-light/70 mb-6">
          Przeglądaj, dodawaj i zarządzaj użytkownikami systemu.
        </p>
        
        <div className="mb-8">
          <UserSummary user={currentUser} />
        </div>
        
        {/* User List Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-premium-light/10">
            <thead className="bg-premium-dark/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-premium-light/70 uppercase tracking-wider">
                  Imię i nazwisko
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-premium-light/70 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-premium-light/70 uppercase tracking-wider">
                  Rola
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-premium-light/70 uppercase tracking-wider">
                  Ostatnie logowanie
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-premium-light/70 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-premium-dark divide-y divide-premium-light/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.profilePicture || 'https://via.placeholder.com/40'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name} {user.lastName}</div>
                        <div className="text-sm text-premium-light/60">Posty: {user.stats.posts} | Wyświetlenia: {user.stats.views}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-premium-light">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-premium-light/60">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-premium-purple hover:text-premium-blue">
                      Edytuj
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
