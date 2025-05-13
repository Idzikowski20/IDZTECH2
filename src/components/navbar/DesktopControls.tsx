
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

const DesktopControls = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  
  // Determine text and icon colors based on theme
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const iconColor = theme === 'light' ? 'text-black' : 'text-white';
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          toggleDarkMode();
          trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
        }} 
        className={`transition-colors ${textColor} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-white' : 'hover:bg-white/10 hover:text-black'}`}
      >
        {theme === "light" ? 
          <Moon className={`h-[1.2rem] w-[1.2rem] ${iconColor}`} /> : 
          <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
        }
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      <Link to="/contact">
        <Button 
          className={`${theme === 'light' ? 'bg-black text-white hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-white hover:text-black'} transition-colors`}
        >
          Umów spotkanie
        </Button>
      </Link>
      
      <Link to={isAuthenticated ? "/admin" : "/login"}>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`transition-colors ${textColor} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-white' : 'hover:bg-white/10 hover:text-black'}`}
        >
          <LogIn className={`h-[1.2rem] w-[1.2rem] ${iconColor}`} />
          <span className="sr-only">{isAuthenticated ? "Panel administracyjny" : "Zaloguj"}</span>
        </Button>
      </Link>
    </div>
  );
};

export default DesktopControls;
