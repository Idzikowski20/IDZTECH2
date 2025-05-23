import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut, Moon, Sun } from 'lucide-react';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { trackEvent } from '@/utils/analytics';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNavItem?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeNavItem = 'dashboard' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const { pathname } = useLocation();
  
  console.log("AdminLayout rendered, user:", user);
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  // Safe access to user data
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

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggleDarkMode();
              trackEvent(
                'toggle_theme',
                'ui',
                `Theme toggled to ${theme === 'light' ? 'dark' : 'light'}`
              );
            }}
            className={`
              transition-colors 
              ${theme === 'light' 
                ? 'text-black hover:bg-gray-100 hover:text-black' 
                : 'text-white hover:bg-white/10 hover:text-white'}
            `}
          >
            {theme === 'light' ? (
              <Moon 
                className="h-[1.2rem] w-[1.2rem]" 
                stroke="#000000" 
                fill="none"
              />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem]" stroke="currentColor" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

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
