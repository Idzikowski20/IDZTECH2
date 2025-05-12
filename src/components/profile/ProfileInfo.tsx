
import { User } from '@supabase/supabase-js';
import { ExtendedUserProfile } from '@/utils/AuthProvider';

interface ProfileInfoProps {
  user: User & ExtendedUserProfile;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const getRoleDisplay = (role: string | undefined) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'moderator') return 'Moderator';
    if (role === 'blogger') return 'Bloger';
    return 'Użytkownik';
  };

  return (
    <>
      <div className="mt-6 pt-6 border-t border-premium-light/10">
        <h3 className="text-sm font-medium mb-2">O mnie</h3>
        <p className="text-sm text-premium-light/70">
          {user.bio || "Nie dodano jeszcze opisu profilu. Edytuj swój profil, aby dodać bio."}
        </p>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Członek od</h3>
        <p className="text-sm text-premium-light/70">
          {new Date().toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long'
          })}
        </p>
      </div>
    </>
  );
};

export default ProfileInfo;
