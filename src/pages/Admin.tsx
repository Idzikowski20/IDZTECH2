
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { Link } from 'react-router-dom';
import UserSummary from '@/components/admin/UserSummary';
import { User } from '@/utils/authTypes';

type UserRole = 'admin' | 'moderator' | 'blogger' | 'user';

// Modify the AdminUser interface to match the User type requirements
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  lastName: string;
  profilePicture: string; // Changed this from optional to required
  bio: string;
  jobTitle: string;
  createdAt: string;
  lastLogin: string | null;
  stats: {
    views: number;
    posts: number;
    comments: number;
    likes: number;
    pointsTotal: number;
    pointsThisMonth: number;
    lastUpdated: string;
  }
}

const Admin = () => {
  const { user, loading } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
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
          const userData: AdminUser = {
            id: data.id,
            email: data.email,
            name: data.name || '',
            role: (data.role as UserRole) || 'user',
            profilePicture: data.profilePicture || '', // Ensure it's never null
            lastName: data.lastName || '', 
            bio: data.bio || '',
            jobTitle: data.jobTitle || '',
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
            <UserSummary user={adminUser} />
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
