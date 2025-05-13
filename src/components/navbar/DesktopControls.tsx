
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DesktopControls = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  
  // Helper to get initials for avatar fallback
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          toggleDarkMode();
          trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
        }} 
        className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
        aria-label={`Przełącz na tryb ${theme === "light" ? "ciemny" : "jasny"}`}
        title={`Przełącz na tryb ${theme === "light" ? "ciemny" : "jasny"}`}
      >
        {theme === "light" ? 
          <Moon className="h-[1.2rem] w-[1.2rem] text-black" /> : 
          <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
        }
        <span className="sr-only">Przełącz motyw</span>
      </Button>
      
      <Link to="/contact">
        <Button 
          className="bg-black text-white hover:bg-black hover:text-white transition-colors"
          aria-label="Umów spotkanie"
        >
          Umów spotkanie
        </Button>
      </Link>
      
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8 p-0"
              aria-label="Menu użytkownika"
              title={`Menu użytkownika: ${user?.name || 'Użytkownik'}`}
            >
              <Avatar className="h-8 w-8">
                {user?.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user?.name || 'User'} />
                ) : (
                  <AvatarFallback className="bg-premium-gradient text-white">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user?.name ? `${user.name} ${user.lastName || ''}` : 'Użytkownik'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="w-full">
                Panel Admina
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full">
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="w-full">
                Ustawienia
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="text-red-500 hover:text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
            >
              Wyloguj
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`transition-colors ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white/10 hover:text-white'}`}
            aria-label="Zaloguj się"
            title="Zaloguj się"
          >
            <LogIn className={`h-[1.2rem] w-[1.2rem] ${theme === 'light' ? 'text-black' : 'text-white'}`} />
            <span className="sr-only">Zaloguj</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DesktopControls;
