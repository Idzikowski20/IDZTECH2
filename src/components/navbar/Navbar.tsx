
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import MobileMenu from './MobileMenu';
import DesktopNavigation from './DesktopNavigation';
import DesktopControls from './DesktopControls';
import Brand from './Brand';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNotifications } from '@/utils/notifications';
import NotificationBell from '../NotificationBell';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  // Determine if we're on the admin page to show a different navbar style
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Safely access user data
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  const fullName = user?.lastName ? `${displayName} ${user.lastName}` : displayName;
  const userRole = user?.role || 'user';
  const userAvatar = user?.profilePicture || '';

  // Admin navbar has a different style
  if (isAdminPage) {
    return (
      <header className="p-4 border-b border-premium-light/10 flex justify-between items-center relative">
        {/* Light effects */}
        <div className="absolute top-3 left-10 w-16 h-16 bg-premium-purple/40 rounded-full blur-[40px] animate-pulse-slow"></div>
        <div className="absolute top-2 right-20 w-16 h-16 bg-premium-blue/40 rounded-full blur-[40px] animate-pulse-slow delay-150"></div>
        
        <div className="flex items-center relative z-10">
          <div className="flex items-center">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`hover:bg-white hover:text-black flex gap-2 items-center ${theme === 'dark' ? 'text-premium-light' : 'text-black'}`}
              >
                <span className="flex items-center">
                  <span className="text-lg font-bold">IDZ.TECH</span>
                </span>
                <span>Wróć na stronę główną</span>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <NotificationBell />

          <div className="flex items-center ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {userAvatar ? (
                      <AvatarImage src={userAvatar} alt={fullName} />
                    ) : (
                      <AvatarFallback className="bg-premium-gradient text-white">
                        {fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{fullName}</span>
                    <span className="text-xs text-muted-foreground">{userRole}</span>
                  </div>
                </DropdownMenuLabel>
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
    );
  }

  // Regular navbar for non-admin pages
  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 bg-opacity-90 backdrop-blur-sm ${isScrolled ? (theme === 'dark' ? 'bg-slate-900/90 shadow-lg' : 'bg-white/90 shadow-lg') : (theme === 'dark' ? 'bg-transparent' : 'bg-white bg-opacity-70')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Brand />
          <DesktopNavigation />
          <DesktopControls />
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
