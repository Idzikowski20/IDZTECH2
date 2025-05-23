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
  
  return (
    <div className="hidden md:flex items-center space-x-4">
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
    
      <Link to="/contact" className="hidden md:block">
        <Button 
          className="bg-black text-white hover:bg-black hover:text-white transition-colors"
        >
          Umów spotkanie
        </Button>
      </Link>
      
      <Link to={isAuthenticated ? "/admin" : "/login"}>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`transition-colors ${theme === 'light' 
            ? 'hover:bg-gray-100 hover:text-black text-black' 
            : 'hover:bg-white/10 hover:text-white text-white bg-transparent'}`}
        >
          {theme === 'light' ? (
            <LogIn 
              className="h-[1.2rem] w-[1.2rem]" 
              stroke="#000000" 
              fill="none"
            />
          ) : (
            <LogIn 
              className="h-[1.2rem] w-[1.2rem]" 
              stroke="#FFFFFF" 
              fill="none"
            />
          )}
          <span className="sr-only">{isAuthenticated ? "Panel administracyjny" : "Zaloguj"}</span>
        </Button>
      </Link>
    </div>
  );
};

export default DesktopControls;
