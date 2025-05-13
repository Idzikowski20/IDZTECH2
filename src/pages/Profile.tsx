
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';

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

// Add Button import
const Button = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded ${className}`}
  >
    {children}
  </button>
);
