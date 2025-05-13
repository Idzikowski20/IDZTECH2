
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

interface BrandProps {
  scrolled: boolean;
}

const Brand: React.FC<BrandProps> = ({ scrolled }) => {
  const { theme } = useTheme();
  
  // Determine text color based on theme and scroll state
  const textColor = theme === 'light'
    ? scrolled 
      ? 'text-black' 
      : 'text-black'
    : 'text-white';
  
  return (
    <Link to="/" className={`flex items-center font-bold text-xl ${textColor} transition-colors duration-300`}>
      <span className="flex items-center">
        IDZ.TECH
      </span>
    </Link>
  );
};

export default Brand;
