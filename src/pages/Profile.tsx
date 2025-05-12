
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/authStore';
import AdminLayout from '@/components/AdminLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSection from '@/components/profile/ProfileSection';

const Profile = () => {
  const { user, getCurrentUser } = useAuth();
  const navigate = useNavigate();

  // Ensure we have the latest user data
  useEffect(() => {
    if (!user) {
      // Try to get current user
      const currentUser = getCurrentUser();
      
      // If still no user, redirect to login
      if (!currentUser) {
        navigate('/login');
      }
    }
  }, [user, getCurrentUser, navigate]);

  // Return early if no user
  if (!user) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <ProfileHeader user={user} />
        <ProfileSection user={user} />
      </div>
    </AdminLayout>
  );
};

export default Profile;
