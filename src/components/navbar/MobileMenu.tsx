
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogIn, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/utils/themeContext';
import { useNavigate } from 'react-router-dom';

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // When opening menu, prevent scrolling
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  return (
    <>
      <div className="flex lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className={`hover:bg-transparent ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}
        >
          <Menu size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
        </Button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={closeMenu}
          />
          
          {/* Menu content */}
          <div 
            className={`fixed right-0 top-0 bottom-0 w-[75%] max-w-sm ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } p-6 overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                className="hover:bg-transparent"
              >
                <X size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
              </Button>
            </div>
            
            <nav className="space-y-6">
              <div className="space-y-2">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className={`block py-2 ${location.pathname === '/' 
                    ? theme === 'dark' ? 'text-white font-bold' : 'text-black font-bold' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Strona główna
                </Link>
                
                <Link 
                  to="/about" 
                  onClick={closeMenu}
                  className={`block py-2 ${location.pathname === '/about' 
                    ? theme === 'dark' ? 'text-white font-bold' : 'text-black font-bold' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  O nas
                </Link>
                
                <div className="relative">
                  <button
                    className={`flex items-center justify-between w-full py-2 ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                    }`}
                    onClick={() => handleNavigation('/projects')}
                  >
                    <span>Projekty</span>
                  </button>
                </div>
                
                <div className="relative">
                  <button
                    className={`flex items-center justify-between w-full py-2 ${
                      theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                    }`}
                    onClick={() => handleNavigation('/blog')}
                  >
                    <span>Blog</span>
                  </button>
                </div>
                
                <Link 
                  to="/contact" 
                  onClick={closeMenu}
                  className={`block py-2 ${location.pathname === '/contact' 
                    ? theme === 'dark' ? 'text-white font-bold' : 'text-black font-bold' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Kontakt
                </Link>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => {
                    toggleDarkMode();
                    closeMenu();
                  }}
                  className={`flex items-center gap-2 py-2 w-full ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={20} /> Tryb jasny
                    </>
                  ) : (
                    <>
                      <Moon size={20} /> Tryb ciemny
                    </>
                  )}
                </button>
                
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`flex items-center gap-2 py-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <LogIn size={20} /> Zaloguj się
                </Link>
                
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className={`flex items-center gap-2 py-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <User size={20} /> Zarejestruj się
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
