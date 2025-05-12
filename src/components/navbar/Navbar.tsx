
import React, { useState } from "react";
import Brand from './Brand';
import DesktopNavigation from './DesktopNavigation';
import DesktopControls from './DesktopControls';
import MobileMenu from './MobileMenu';
import { useTheme } from '@/utils/themeContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-black/80 backdrop-blur-md border-white/10'
      }`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Brand />
        
        <DesktopNavigation />
        
        <DesktopControls />
        
        {/* Mobile menu button - Now handled inside the MobileMenu component */}
      </div>
      
      {/* Mobile menu with updated props */}
      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </header>
  );
};

export default Navbar;
