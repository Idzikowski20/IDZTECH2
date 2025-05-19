import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSection from '@/components/profile/ProfileSection';
import { ExtendedUserProfile } from '@/utils/AuthProvider';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/utils/authTypes';

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

  // Create an extended user object that satisfies both types
  const extendedUser = {
    ...user,
    app_metadata: user.app_metadata || {},
    aud: user.aud || "authenticated",
    created_at: user.created_at || new Date().toISOString(), // Using created_at consistently
    // Add default stats property if it's not present (required by User type)
    stats: (user as any).stats || {
      views: 0,
      posts: 0,
      comments: 0,
      likes: 0,
      pointsTotal: 0,
      pointsThisMonth: 0,
      lastUpdated: new Date().toISOString()
    }
  } as (SupabaseUser & ExtendedUserProfile & User);

  return (
    <AdminLayout>
      <div className="p-6">
        <ProfileHeader user={extendedUser} />
        <ProfileSection user={extendedUser} />
      </div>
    </AdminLayout>
  );
};

export default Profile;
