
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Brand from './Brand';
import MobileMenu from './MobileMenu';
import DesktopNavigation from './DesktopNavigation';
import DesktopControls from './DesktopControls';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-premium-dark/90 backdrop-blur-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Brand/Logo */}
          <Brand />
          
          {/* Desktop Navigation - hidden on mobile */}
          <DesktopNavigation />
          
          {/* Desktop Controls - hidden on mobile */}
          <DesktopControls />
          
          {/* Mobile Menu - hidden on desktop */}
          <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
