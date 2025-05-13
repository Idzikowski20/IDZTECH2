
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const Brand = () => {
  const { theme } = useTheme();
  
  return (
    <Link 
      to="/" 
      className="flex items-center"
      aria-label="IDZ.TECH - strona główna"
    >
      <span 
        className={`text-lg font-semibold tracking-tight ${theme === 'light' ? 'text-black' : 'text-white'}`}
        aria-hidden="true"
      >
        IDZ.TECH
      </span>
    </Link>
  );
};

export default Brand;
