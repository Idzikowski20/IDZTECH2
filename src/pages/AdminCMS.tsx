
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import CMSPanel from '@/components/admin/CMSPanel';
import CMSGuide from '@/components/CMSGuide';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { makeUserAdmin, deleteAllUsersExceptAdmin } from '@/utils/cms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AdminCMS = () => {
  const { loading, user } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [isSettingAdminRole, setIsSettingAdminRole] = useState(false);
  const adminEmail = "patryk.idzikowski@interia.pl";
  const [adminAccessGranted, setAdminAccessGranted] = useState(false);

  useEffect(() => {
    // Sprawdzenie, czy użytkownik pierwszy raz korzysta z CMS
    const hasUsedCMS = localStorage.getItem('has_used_cms');
    if (!hasUsedCMS) {
      setShowGuide(true);
      localStorage.setItem('has_used_cms', 'true');
    }
  }, []);

  useEffect(() => {
    // Set this user as admin if it's the specific email
    const setupAdminUser = async () => {
      if (user?.email === adminEmail && !adminAccessGranted) {
        setIsSettingAdminRole(true);
        try {
          const success = await makeUserAdmin(adminEmail);
          if (success) {
            // Try to clean up other users
            await deleteAllUsersExceptAdmin(adminEmail);
            setAdminAccessGranted(true);
            toast.success("Ustawiono rolę administratora dla Twojego konta");
          }
        } catch (error) {
          console.error("Error setting up admin:", error);
          toast.error("Nie udało się ustawić roli administratora");
        } finally {
          setIsSettingAdminRole(false);
        }
      }
    };

    if (user?.email) {
      setupAdminUser();
    }
  }, [user, adminAccessGranted, adminEmail]);

  if (loading || isSettingAdminRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {isSettingAdminRole ? "Konfigurowanie uprawnień administratora..." : "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">CMS Panel</h1>
        
        {adminAccessGranted && (
          <Alert className="bg-green-500/20 border border-green-500/30 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertTitle>Uprawnienia administratora</AlertTitle>
            <AlertDescription className="mt-2">
              Pomyślnie przyznano uprawnienia administratora dla konta {adminEmail}.
              Możesz teraz zarządzać treścią CMS.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="p-6 bg-premium-dark/50 border border-premium-light/10 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Edycja wizualna (WordPress-style)</h2>
              <p className="mb-4">
                Skorzystaj z wizualnego edytora treści, który pozwala na edycję zawartości strony 
                w przyjaznym trybie graficznym, podobnym do Elementora.
              </p>
            </div>
            <Link to="/visual-editor">
              <Button className="bg-premium-gradient hover:bg-premium-purple/80 transition-colors">
                <Edit className="mr-2 h-4 w-4" />
                Przejdź do edytora wizualnego
              </Button>
            </Link>
          </div>
        </Card>
        
        {showGuide && (
          <div className="mb-8">
            <Alert className="bg-premium-dark/50 border border-premium-purple/30 mb-6">
              <AlertTriangle className="h-5 w-5 text-premium-purple" />
              <AlertTitle>Uwaga dotycząca bezpieczeństwa</AlertTitle>
              <AlertDescription className="mt-2">
                Wykryto brak zabezpieczeń Row Level Security (RLS) dla tabel CMS. 
                Zalecamy włączenie zabezpieczeń RLS, aby chronić dane CMS przed nieautoryzowanym dostępem.
                Możesz włączyć zabezpieczenia RLS klikając przycisk "Włącz zabezpieczenia RLS" w panelu CMS.
              </AlertDescription>
            </Alert>
            
            <CMSGuide />
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowGuide(false)} 
                className="px-4 py-2 bg-premium-gradient rounded-md text-white hover:opacity-90 transition-opacity"
              >
                Zamknij przewodnik
              </button>
            </div>
          </div>
        )}
        
        <CMSPanel />
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;
