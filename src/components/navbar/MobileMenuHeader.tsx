
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { Moon, Sun, LogIn } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

interface MobileMenuHeaderProps {
  onClose: () => void;
}

const MobileMenuHeader: React.FC<MobileMenuHeaderProps> = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleDarkMode } = useTheme();
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className={`text-xl font-bold ${textColor}`}>Menu</h2>
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            toggleDarkMode();
            trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
          }} 
          className={`${textColor} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-gray-800 hover:text-white'}`}
        >
          {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <Link to={isAuthenticated ? "/admin" : "/login"} onClick={onClose}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${textColor} ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-gray-800 hover:text-white'}`}
          >
            <LogIn className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">{isAuthenticated ? "Panel administracyjny" : "Zaloguj"}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenuHeader;
