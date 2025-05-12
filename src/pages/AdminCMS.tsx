
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import CMSPanel from '@/components/admin/CMSPanel';
import CMSGuide from '@/components/CMSGuide';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminCMS = () => {
  const { loading } = useAuth();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Sprawdzenie, czy użytkownik pierwszy raz korzysta z CMS
    const hasUsedCMS = localStorage.getItem('has_used_cms');
    if (!hasUsedCMS) {
      setShowGuide(true);
      localStorage.setItem('has_used_cms', 'true');
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">CMS Panel</h1>
        
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
