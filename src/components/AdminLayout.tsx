
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNotifications } from '@/utils/notifications';
import NotificationBell from './NotificationBell';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const displayName = user?.email ? user.email.split('@')[0] : 'User';
  const userAvatar = user?.user_metadata?.avatar_url || '';

  return (
    <div className="min-h-screen">
      <header className="p-4 border-b border-premium-light/10 flex justify-between items-center relative">
        {/* Light effects */}
        <div className="absolute top-3 left-10 w-16 h-16 bg-premium-purple/40 rounded-full blur-[40px] animate-pulse-slow"></div>
        <div className="absolute top-2 right-20 w-16 h-16 bg-premium-blue/40 rounded-full blur-[40px] animate-pulse-slow delay-150"></div>
        
        <div className="flex items-center relative z-10">
          <div className="flex items-center">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="text-premium-light hover:bg-white hover:text-black flex gap-2 items-center"
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
                  className="text-red-500 hover:text-white focus:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="h-screen sticky top-0 border-r border-premium-light/10 w-64 hidden md:block relative">
          {/* Light effects */}
          <div className="absolute top-20 left-8 w-16 h-16 bg-premium-purple/40 rounded-full blur-[30px] animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-8 w-16 h-16 bg-premium-blue/40 rounded-full blur-[30px] animate-pulse-slow delay-150"></div>
          
          <div className="p-4 relative z-10">
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
          </div>
        </div>

        <main className="flex-1 p-4 relative">
          {/* Light effects */}
          <div className="absolute top-40 left-40 w-24 h-24 bg-premium-purple/30 rounded-full blur-[50px] animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-premium-blue/30 rounded-full blur-[60px] animate-pulse-slow delay-150"></div>
          
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
