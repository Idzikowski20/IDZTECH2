
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { X, Menu } from 'lucide-react';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isAuthenticated, signOut } = useAuth();
  const { theme } = useTheme();

  const menuItems = [
    { name: "Strona główna", href: "/" },
    { name: "Usługi", href: "/uslugi/seo" },
    { name: "O nas", href: "/o-nas" },
    { name: "Blog", href: "/blog" },
    { name: "Projekty", href: "/projekty" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button 
          className="text-gray-500 hover:text-gray-600" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className={`h-6 w-6 ${theme === 'light' ? 'text-gray-700' : 'text-white'}`} />
          <span className="sr-only">Open menu</span>
        </button>
      </div>
    
      {/* Mobile menu panel */}
      <div 
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-premium-dark shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold">Menu</span>
            <button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav className="flex flex-col px-4 py-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-3 text-lg font-medium rounded-md ${
                  theme === 'light'
                    ? 'text-gray-800 hover:bg-gray-100 hover:text-white'
                    : 'text-white hover:bg-white hover:text-black'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-3 text-lg font-medium rounded-md ${
                    theme === 'light'
                      ? 'text-gray-800 hover:bg-gray-100 hover:text-white'
                      : 'text-white hover:bg-white hover:text-black'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Panel admin
                </Link>
                <button
                  className={`px-3 py-3 text-left text-lg font-medium rounded-md ${
                    theme === 'light'
                      ? 'text-gray-800 hover:bg-gray-100 hover:text-white'
                      : 'text-white hover:bg-white hover:text-black'
                  }`}
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`mt-4 w-full px-3 py-3 text-center text-white bg-premium-gradient hover:bg-premium-purple/80 rounded-md font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Zaloguj
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
