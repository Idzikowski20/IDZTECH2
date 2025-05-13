
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Twój profil</h1>
          <p className="text-premium-light/70">
            Funkcja profilu jest obecnie wyłączona. Zostanie zaimplementowana z integracją Sanity.io.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4 bg-premium-gradient hover:bg-premium-purple hover:text-white"
          >
            Powrót do strony głównej
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
