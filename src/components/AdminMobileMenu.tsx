
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSanityAuth } from '@/utils/SanityAuthProvider';

const AdminMobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useSanityAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-full bg-transparent hover:bg-white hover:text-black transition-colors"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70" onClick={() => setIsOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-premium-dark p-6 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Panel administracyjny</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white hover:text-black"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="space-y-1">
              <Link 
                to="/admin" 
                className="block px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/stats" 
                className="block px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Statystyki
              </Link>
              <Link 
                to="/profile" 
                className="block px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profil
              </Link>
              <Link 
                to="/admin/studio" 
                className="block px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sanity Studio
              </Link>
              <Link 
                to="/admin/users" 
                className="block px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Użytkownicy
              </Link>
              <Link 
                to="/admin/settings" 
                className="block px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ustawienia
              </Link>
            </nav>
            
            <div className="absolute bottom-8 left-6 right-6">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Wyloguj</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMobileMenu;
