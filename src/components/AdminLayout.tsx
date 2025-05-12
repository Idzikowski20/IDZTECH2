
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Settings, User, FileText, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/utils/authStore';
import { useTheme } from '@/utils/themeContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNotifications } from '@/utils/notifications';
import NotificationBell from './NotificationBell';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeNavItem = 'dashboard' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  
  // Fix scrolling issue on mobile
  useEffect(() => {
    // When mobile menu is open, prevent scrolling on the body
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen, isMobile]);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const displayName = user?.email ? user.email.split('@')[0] : 'User';
  // Safely access user_metadata or use default values
  const userAvatar = user?.profilePicture || '';
  
  // Toggle sidebar for desktop, toggle mobile menu for mobile
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark">
      <header className="p-4 border-b border-premium-light/10 flex justify-between items-center relative z-50">
        {/* Light effects */}
        <div className="absolute top-3 left-10 w-16 h-16 bg-premium-purple/40 rounded-full blur-[40px] animate-pulse-slow"></div>
        <div className="absolute top-2 right-20 w-16 h-16 bg-premium-blue/40 rounded-full blur-[40px] animate-pulse-slow delay-150"></div>
        
        <div className="flex items-center relative z-10">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2 md:hidden"
              onClick={toggleSidebar}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
            
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`hover:bg-white hover:text-black hidden md:flex gap-2 items-center ${theme === 'dark' ? 'text-premium-light' : 'text-black'}`}
              >
                <Home size={18} />
                Wróć na stronę główną
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <div className="flex items-center">
            <span className="font-mono">IDZ.TECH</span>
          </div>

          <NotificationBell />

          <div className="flex items-center ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {userAvatar ? (
                      <AvatarImage src={userAvatar} alt={displayName} />
                    ) : (
                      <AvatarFallback className="bg-premium-gradient text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ustawienia</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-white bg-red-500 hover:bg-red-600 focus:text-white hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile menu - full screen overlay */}
      {isMobile && (
        <div className={`fixed inset-0 bg-premium-dark/95 z-40 transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } pt-20`}>
          {isMobileMenuOpen && (
            <nav className="p-4 space-y-2">
              <h2 className="text-lg font-bold mb-4">Panel administracyjny</h2>
              <nav>
                <ul>
                  <li className="mb-3">
                    <Link 
                      to="/admin" 
                      className={`block px-4 py-3 rounded-md transition-colors ${pathname === '/admin' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/admin/stats" 
                      className={`block px-4 py-3 rounded-md transition-colors ${pathname === '/admin/stats' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      Statystyki
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/profile" 
                      className={`block px-4 py-3 rounded-md transition-colors ${pathname === '/profile' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      Profil
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/admin/notifications" 
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/notifications' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      Powiadomienia
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/admin/cms" 
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${pathname === '/admin/cms' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Zarządzanie CMS
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/admin/users" 
                      className={`block px-4 py-3 rounded-md transition-colors ${pathname === '/admin/users' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      Użytkownicy
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link 
                      to="/admin/settings" 
                      className={`block px-4 py-3 rounded-md transition-colors ${pathname === '/admin/settings' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                    >
                      Ustawienia
                    </Link>
                  </li>
                </ul>
              </nav>
              
              {/* Logout button */}
              <div className="pt-4 mt-6 border-t border-premium-light/10">
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Wyloguj</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-16"
          } bg-premium-dark/50 border-r border-premium-light/10 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out fixed left-0 top-16 z-30 hidden md:block`}
        >
          <nav className="p-4 space-y-2">
            <h2 className="text-lg font-bold mb-4">Panel administracyjny</h2>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link 
                    to="/admin" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/stats" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/stats' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    Statystyki
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/profile" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/profile' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    Profil
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/notifications" 
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/notifications' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    Powiadomienia
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/cms" 
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/cms' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Zarządzanie CMS
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/users" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/users' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    Użytkownicy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/settings" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/settings' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-white hover:text-black'}`}
                  >
                    Ustawienia
                  </Link>
                </li>
              </ul>
            </nav>
            
            {/* Logout button at the bottom */}
            <div className="pt-4 mt-6 border-t border-premium-light/10">
              <button
                onClick={() => signOut()}
                className="flex items-center w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors group"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {isSidebarOpen && <span>Wyloguj</span>}
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-2 p-2 bg-premium-dark/90 text-premium-light rounded whitespace-nowrap border border-premium-light/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    Wyloguj
                  </span>
                )}
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out overflow-auto ${
            isSidebarOpen ? "md:ml-64" : "md:ml-16"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
