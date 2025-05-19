
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
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

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeNavItem = 'dashboard' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  
  console.log("AdminLayout rendered, user:", user);
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  // Bezpieczny dostęp do danych użytkownika
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
  
  return (
    <div className="min-h-screen bg-premium-dark">
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

          <div className="flex items-center ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-premium-gradient text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{displayName}</span>
                  </div>
                </DropdownMenuLabel>
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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-16"
          } bg-premium-dark/50 border-r border-premium-light/10 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out fixed left-0 top-16 z-40`}
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
              </ul>
            </nav>
            
            {/* Logout button at the bottom */}
            <div className="pt-4 mt-6 border-t border-premium-light/10">
              <button
                onClick={handleLogout}
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
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
