
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/utils/auth';
import { useTheme } from '@/utils/themeContext';
import { Moon as MoonIcon, Sun as SunIcon } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import TypingAnimation from './TypingAnimation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    trackEvent('logout', 'auth', 'User logged out');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-premium-dark/80 backdrop-blur-md shadow-lg' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center text-white font-bold text-xl"
        >
          <img 
            src="/lovable-uploads/14354e6c-0dfa-410a-86da-d56b37d05fd2.png" 
            alt="IDZ.TECH" 
            className="h-8 mr-2" 
          />
          <TypingAnimation text="IDZ.TECH" speed={120} />
        </Link>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
              trackEvent('toggle_theme', 'ui', `Theme toggled to ${theme === "light" ? "dark" : "light"}`);
            }}
          >
            {theme === "light" ? <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> : <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="secondary" size="sm">
                  Profil
                </Button>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="secondary" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Wyloguj
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Zaloguj
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm">
                  Zarejestruj się
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
