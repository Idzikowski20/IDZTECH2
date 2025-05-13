
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 right-0 w-full max-w-xs ${theme === 'dark' ? 'bg-premium-dark' : 'bg-white'} p-6 shadow-lg transform transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
          <span className="font-bold text-xl">Menu</span>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                onClick={onClose}
                className="block py-2 px-4 rounded-md transition hover:bg-white hover:text-black"
              >
                Strona główna
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                onClick={onClose}
                className="block py-2 px-4 rounded-md transition hover:bg-white hover:text-black"
              >
                O nas
              </Link>
            </li>
            <li>
              <Link 
                to="/services" 
                onClick={onClose}
                className="block py-2 px-4 rounded-md transition hover:bg-white hover:text-black"
              >
                Usługi
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                onClick={onClose}
                className="block py-2 px-4 rounded-md transition hover:bg-white hover:text-black"
              >
                Kontakt
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                onClick={onClose}
                className="block py-2 px-4 rounded-md transition hover:bg-white hover:text-black"
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenu;
