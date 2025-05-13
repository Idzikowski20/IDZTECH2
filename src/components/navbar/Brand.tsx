
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const Brand = () => {
  const { theme } = useTheme();
  
  // Determine text color based on theme
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  
  return (
    <Link to="/" className={`flex items-center font-bold text-xl ${textColor}`}>
      <span className="flex items-center">
        IDZ.TECH
      </span>
    </Link>
  );
};

export default Brand;
