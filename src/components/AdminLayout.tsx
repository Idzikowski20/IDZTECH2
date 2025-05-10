
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
import { useAuth } from '@/utils/auth';
import { useTheme } from '@/utils/themeContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BlinkingUnderscore from './BlinkingUnderscore';
import { useNotifications } from '@/utils/notifications';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-premium-dark text-premium-light dark:bg-premium-light dark:text-premium-dark">
      <header className="p-4 border-b border-premium-light/10 dark:border-premium-dark/10 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-premium-light hover:bg-premium-light hover:text-black dark:text-premium-dark dark:hover:text-white dark:hover:bg-premium-dark flex gap-2 items-center"
            >
              <Home size={18} />
              Wróć na stronę główną
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="font-mono dark:text-premium-dark">IDZ.TECH</span>
            <BlinkingUnderscore />
          </div>

          <div className="flex items-center ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {user?.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-premium-gradient text-white dark:text-premium-dark">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
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
                  className="text-red-500 focus:text-red-500"
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
        <div className="h-screen sticky top-0 border-r border-premium-light/10 dark:border-premium-dark/10 w-64 hidden md:block">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 dark:text-premium-dark">Panel administracyjny</h2>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link 
                    to="/admin" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-premium-light/10 text-white dark:bg-premium-dark/10 dark:text-premium-dark' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white dark:text-premium-dark/70 dark:hover:bg-premium-dark/5 dark:hover:text-premium-dark'}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/stats" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/stats' ? 'bg-premium-light/10 text-white dark:bg-premium-dark/10 dark:text-premium-dark' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white dark:text-premium-dark/70 dark:hover:bg-premium-dark/5 dark:hover:text-premium-dark'}`}
                  >
                    Statystyki
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/notifications" 
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${pathname === '/admin/notifications' ? 'bg-premium-light/10 text-white dark:bg-premium-dark/10 dark:text-premium-dark' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white dark:text-premium-dark/70 dark:hover:bg-premium-dark/5 dark:hover:text-premium-dark'}`}
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
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/users' ? 'bg-premium-light/10 text-white dark:bg-premium-dark/10 dark:text-premium-dark' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white dark:text-premium-dark/70 dark:hover:bg-premium-dark/5 dark:hover:text-premium-dark'}`}
                  >
                    Użytkownicy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/new-post" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname.startsWith('/admin/new-post') ? 'bg-premium-light/10 text-white dark:bg-premium-dark/10 dark:text-premium-dark' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white dark:text-premium-dark/70 dark:hover:bg-premium-dark/5 dark:hover:text-premium-dark'}`}
                  >
                    Nowy post
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/settings" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/settings' ? 'bg-premium-light/10 text-white dark:bg-premium-dark/10 dark:text-premium-dark' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white dark:text-premium-dark/70 dark:hover:bg-premium-dark/5 dark:hover:text-premium-dark'}`}
                  >
                    Ustawienia
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
