
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2 } from 'lucide-react';
import { User } from '@/utils/authTypes';
import { supabase } from '@/utils/supabaseClient';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { user, loading } = useAuth();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const getProfileData = async () => {
      if (!user?.id) return;

      try {
        setFetchingData(true);
        // Get profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          // Convert to our User format
          const userData: User = {
            id: data.id,
            email: data.email,
            name: data.name || '',
            role: data.role || 'user',
            profilePicture: data.profilePicture,
            lastName: data.lastName,
            bio: data.bio,
            jobTitle: data.jobTitle,
            createdAt: data.created_at,
            lastLogin: data.last_login,
            stats: {
              views: 0,
              posts: 0,
              comments: 0,
              likes: 0,
              pointsTotal: 0,
              pointsThisMonth: 0,
              lastUpdated: new Date().toISOString()
            }
          };
          
          setAdminUser(userData);
        }
      } catch (error) {
        console.error('Error in getProfileData:', error);
      } finally {
        setFetchingData(false);
      }
    };

    if (user) {
      getProfileData();
    } else {
      setFetchingData(false);
    }
  }, [user]);

  if (loading || fetchingData) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Ładowanie danych...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Panel administracyjny</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Profile Summary */}
          <div className="col-span-1">
            <Card className="p-6 border border-premium-light/10 bg-premium-dark/50">
              <h2 className="text-xl font-semibold flex items-center">
                <div className="bg-purple-500/20 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Administrator systemu
              </h2>
              <div className="mt-4 flex items-center">
                <div className="w-16 h-16 rounded-full bg-premium-gradient flex items-center justify-center text-white text-2xl mr-3 overflow-hidden">
                  {adminUser?.profilePicture ? (
                    <img src={adminUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    adminUser?.name?.charAt(0) || adminUser?.email?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{adminUser?.name || adminUser?.email?.split('@')[0]}</h3>
                  <p className="text-sm opacity-70">{adminUser?.email}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-premium-dark p-3 rounded-lg hover:bg-white hover:text-black transition-colors">
                  <div className="text-amber-500 mb-1">Rola</div>
                  <div className="font-semibold">{adminUser?.role || 'admin'}</div>
                </div>
                <div className="bg-premium-dark p-3 rounded-lg hover:bg-white hover:text-black transition-colors">
                  <div className="text-blue-500 mb-1">ID</div>
                  <div className="font-semibold truncate">{adminUser?.id?.substring(0, 8) || 'Brak'}</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-premium-dark/30 rounded-lg border border-premium-light/5">
                <h4 className="font-medium mb-2">Uprawnienia:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Pełny dostęp do CMS</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Zarządzanie użytkownikami</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Konfiguracja systemu</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Publikowanie treści</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
          
          {/* Stats and other dashboard elements */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Card className="p-6 border border-premium-light/10 bg-premium-dark/50">
              <h2 className="text-xl font-semibold mb-4">Witaj w panelu administracyjnym</h2>
              <p className="mb-4">
                Z tego miejsca możesz zarządzać treścią swojej strony, użytkownikami i ustawieniami.
              </p>
              <p>
                Skorzystaj z menu po lewej stronie, aby przejść do poszczególnych sekcji panelu.
              </p>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/stats">
                <Card className="p-4 border border-premium-light/10 bg-premium-dark/50 hover:bg-premium-dark/70 transition-colors cursor-pointer h-full">
                  <h3 className="text-lg font-medium mb-2">Statystyki</h3>
                  <p className="text-sm text-premium-light/70">
                    Przejdź do sekcji statystyk, aby zobaczyć szczegółowe dane dotyczące ruchu na stronie.
                  </p>
                </Card>
              </Link>
              
              <Link to="/admin/cms">
                <Card className="p-4 border border-premium-light/10 bg-premium-dark/50 hover:bg-premium-dark/70 transition-colors cursor-pointer h-full">
                  <h3 className="text-lg font-medium mb-2">Zarządzanie CMS</h3>
                  <p className="text-sm text-premium-light/70">
                    Edytuj treści na stronie za pomocą systemu zarządzania treścią.
                  </p>
                </Card>
              </Link>
              
              <Link to="/admin/users">
                <Card className="p-4 border border-premium-light/10 bg-premium-dark/50 hover:bg-premium-dark/70 transition-colors cursor-pointer h-full">
                  <h3 className="text-lg font-medium mb-2">Użytkownicy</h3>
                  <p className="text-sm text-premium-light/70">
                    Zarządzaj kontami użytkowników, rolami i uprawnieniami.
                  </p>
                </Card>
              </Link>
              
              <Link to="/admin/settings">
                <Card className="p-4 border border-premium-light/10 bg-premium-dark/50 hover:bg-premium-dark/70 transition-colors cursor-pointer h-full">
                  <h3 className="text-lg font-medium mb-2">Ustawienia</h3>
                  <p className="text-sm text-premium-light/70">
                    Konfiguruj ustawienia systemu i dostosuj parametry strony.
                  </p>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
