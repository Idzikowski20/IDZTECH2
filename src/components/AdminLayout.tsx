
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from 'react-pro-sidebar';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Settings, User } from 'lucide-react';
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
import TypingAnimation from './TypingAnimation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const SidebarTrigger = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => setIsOpen(!isOpen)}
      className={className}
    >
      <Menu size={20} />
    </Button>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-premium-dark text-premium-light">
      <header className="p-4 border-b border-premium-light/10 flex justify-between items-center">
        <div className="flex items-center">
          <SidebarTrigger className="text-premium-light hover:text-white hover:bg-premium-light/10 inline-flex w-10 h-10 justify-center items-center rounded-lg transition-colors" />
          
          <nav className="hidden md:flex items-center ml-4">
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/stats" 
              className={`px-3 py-2 rounded-md transition-colors ${pathname === '/admin/stats' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
            >
              Statystyki
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center">
          <TypingAnimation text="IDZ.TECH_" speed={120} className="mr-4" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-premium-gradient text-white">
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
      </header>

      <div className="flex">
        <Sidebar className="h-screen sticky top-0 border-r border-premium-light/10 w-64 hidden md:block">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Panel administracyjny</h2>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link 
                    to="/admin" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/stats" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/stats' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
                  >
                    Statystyki
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/users" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/users' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
                  >
                    Użytkownicy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/new-post" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname.startsWith('/admin/new-post') ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
                  >
                    Nowy post
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/settings" 
                    className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin/settings' ? 'bg-premium-light/10 text-white' : 'text-premium-light/70 hover:bg-premium-light/5 hover:text-white'}`}
                  >
                    Ustawienia
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </Sidebar>

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
