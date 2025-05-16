import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { User } from '@supabase/supabase-js';
import { ExtendedUserProfile } from '@/utils/AuthProvider';
import ProfileImage from '@/components/profile/ProfileImage';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileForm from '@/components/profile/ProfileForm';
import { useUserManager } from '@/hooks/useProfileManager';

interface ProfileSectionProps {
  user: User & ExtendedUserProfile;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { updateUser } = useUserManager(user);

  const handleUpdateUser = async (data: Partial<ExtendedUserProfile>) => {
    return await updateUser(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="space-y-6">
        <ProfileImage 
          user={user} 
          previewImage={previewImage} 
          setPreviewImage={setPreviewImage}
          updateProfile={handleUpdateUser}
        />
        <ProfileInfo user={user} />
      </div>
      <div>
        <ProfileForm 
          user={user} 
          onUpdate={handleUpdateUser}
        />
      </div>
    </div>
  );
};

export default ProfileSection;
