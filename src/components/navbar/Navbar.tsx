
import React, { useState, useEffect } from 'react';
import Brand from './Brand';
import DesktopNavigation from './DesktopNavigation';
import DesktopControls from './DesktopControls';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Modified effect to ensure body scroll is properly restored
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Small timeout to ensure transitions complete before enabling scrolling
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
    }
    
    return () => {
      // Always clean up by restoring scrolling when component unmounts
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-premium-dark/80 backdrop-blur-md shadow-lg' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Brand />
        
        {/* Desktop Navigation */}
        <DesktopNavigation />

        <div className="flex items-center space-x-4">
          {/* Desktop-only buttons */}
          <DesktopControls />
          
          {/* Mobile Menu Button */}
          <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
