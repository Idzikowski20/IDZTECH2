
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import CMSPanel from '@/components/admin/CMSPanel';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2 } from 'lucide-react';

const AdminCMS = () => {
  const { loading } = useAuth(); // Using 'loading' instead of 'isLoading' for consistency

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
        <CMSPanel />
      </div>
    </AdminLayout>
  );
};

export default AdminCMS;
