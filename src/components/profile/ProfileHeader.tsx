
import { User } from '@supabase/supabase-js';
import { ExtendedUserProfile } from '@/utils/AuthProvider';

interface ProfileHeaderProps {
  user: User & ExtendedUserProfile;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2">Twój profil</h1>
      <p className="text-premium-light/70">
        Zaktualizuj swoje dane osobowe i informacje profilowe.
      </p>
    </div>
  );
};

export default ProfileHeader;
