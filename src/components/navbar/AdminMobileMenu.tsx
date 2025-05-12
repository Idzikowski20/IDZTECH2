
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, Home, BarChart2, User, Bell, Users, Settings } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { useNotifications } from '@/utils/notifications';

const AdminMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  
  // Determine text color based on theme
  const textColor = theme === 'light' ? 'text-black' : 'text-white';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-premium-dark/90 backdrop-blur-md border-b border-premium-light/10 p-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-lg font-medium">
          <Button 
            variant="ghost" 
            className={`hover:bg-white hover:text-black flex gap-2 items-center ${theme === 'dark' ? 'text-premium-light' : 'text-black'}`}
          >
            <Home size={18} />
            Strona główna
          </Button>
        </Link>
        
        <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              className={`px-2 ${textColor}`}
            >
              Menu
            </Button>
          </DrawerTrigger>
          <DrawerContent className={`h-[85vh] neo-blur ${theme === 'light' ? 'bg-white/80' : 'bg-black/80'} backdrop-blur-md border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
            <div className="px-6 py-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-xl font-bold ${textColor}`}>Panel Admina</h2>
              </div>
              
              <nav className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/admin" 
                      className={`flex items-center w-full p-3 rounded-lg ${isActive('/admin') ? 'bg-premium-light/10 text-white' : `${textColor}`} hover:bg-white hover:text-black transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="w-5 h-5 mr-3" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/stats" 
                      className={`flex items-center w-full p-3 rounded-lg ${isActive('/admin/stats') ? 'bg-premium-light/10 text-white' : `${textColor}`} hover:bg-white hover:text-black transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BarChart2 className="w-5 h-5 mr-3" />
                      <span>Statystyki</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className={`flex items-center w-full p-3 rounded-lg ${isActive('/profile') ? 'bg-premium-light/10 text-white' : `${textColor}`} hover:bg-white hover:text-black transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>Profil</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/notifications" 
                      className={`flex items-center w-full p-3 rounded-lg ${isActive('/admin/notifications') ? 'bg-premium-light/10 text-white' : `${textColor}`} hover:bg-white hover:text-black transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Bell className="w-5 h-5 mr-3" />
                      <span>Powiadomienia</span>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/users" 
                      className={`flex items-center w-full p-3 rounded-lg ${isActive('/admin/users') ? 'bg-premium-light/10 text-white' : `${textColor}`} hover:bg-white hover:text-black transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="w-5 h-5 mr-3" />
                      <span>Użytkownicy</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/settings" 
                      className={`flex items-center w-full p-3 rounded-lg ${isActive('/admin/settings') ? 'bg-premium-light/10 text-white' : `${textColor}`} hover:bg-white hover:text-black transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      <span>Ustawienia</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              
              {/* Logout button at the bottom */}
              <div className="pt-4 mt-6 border-t border-premium-light/10">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Wyloguj</span>
                </button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default AdminMobileMenu;
