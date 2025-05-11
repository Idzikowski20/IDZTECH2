
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

interface MobileNavigationItemProps {
  to: string;
  label: string;
  onClick: () => void;
}

const MobileNavigationItem: React.FC<MobileNavigationItemProps> = ({ to, label, onClick }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isActive = location.pathname === to;
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  
  return (
    <Link to={to} 
      className={`${textColor} text-lg px-3 py-3 rounded-lg transition-colors ${
        isActive ? 'font-bold border-b-2 border-premium-blue' : ''
      } ${theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-gray-800 hover:text-white'}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default MobileNavigationItem;
