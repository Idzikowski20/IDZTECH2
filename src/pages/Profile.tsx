
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileImage from '@/components/profile/ProfileImage';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Set preview image from user profile when component mounts
  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewImage(user.profilePicture);
    }
  }, [user?.profilePicture]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <ProfileHeader user={user} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
              <ProfileImage 
                user={user} 
                previewImage={previewImage} 
                setPreviewImage={setPreviewImage} 
                updateProfile={updateProfile}
              />
              
              <ProfileInfo user={user} />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-6">Edytuj swoje dane</h2>
              
              <ProfileForm 
                user={user} 
                updateProfile={updateProfile}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
