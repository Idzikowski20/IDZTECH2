
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/authStore';
import AdminLayout from '@/components/AdminLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSection from '@/components/profile/ProfileSection';
import { ExtendedUserProfile } from '@/utils/AuthProvider';

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
    app_metadata: {},
    aud: "authenticated",
    created_at: user.createdAt || new Date().toISOString(),
    // Add any other missing properties from ExtendedUserProfile type
    name: user.name || '',
    lastName: user.lastName || '',
    profilePicture: user.profilePicture || '',
    bio: user.bio || '',
    jobTitle: user.jobTitle || '',
  } as unknown as (ExtendedUserProfile & User);

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
