
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSection from '@/components/profile/ProfileSection';
import { ExtendedUserProfile } from '@/utils/AuthContext';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/utils/authTypes';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if no user
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Return early if still loading or no user
  if (loading || !user) return null;

  // Create an extended user object that satisfies both types
  const extendedUser = {
    ...user,
    app_metadata: user.app_metadata || {},
    aud: user.aud || "authenticated",
    created_at: user.created_at || new Date().toISOString(),
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
