
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Brand from './Brand';
import DesktopNavigation from './DesktopNavigation';
import DesktopControls from './DesktopControls';
import MobileMenu from './MobileMenu';
import { useTheme } from '@/utils/themeContext';

const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isTransparent = location.pathname === '/' && !scrolled;
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Only show navbar after document is fully loaded
    if (document.readyState === 'complete') {
      setIsPageLoaded(true);
    } else {
      window.addEventListener('load', () => setIsPageLoaded(true));
    }
    
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', () => setIsPageLoaded(true));
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? `backdrop-blur-md ${
              theme === 'light'
                ? 'bg-white/80 text-black'
                : 'bg-premium-dark/80 text-white'
            }`
          : `${
              isTransparent
                ? 'bg-transparent'
                : `${
                    theme === 'light'
                      ? 'bg-white text-black'
                      : 'bg-premium-dark text-white'
                  }`
            }`
      } ${!isPageLoaded ? 'opacity-0' : 'opacity-100'}`}
      aria-hidden={!isPageLoaded}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Brand scrolled={scrolled} />
          <DesktopNavigation />
          <DesktopControls scrolled={scrolled} />
          <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} scrolled={scrolled} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
