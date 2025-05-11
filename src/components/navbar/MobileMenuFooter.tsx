
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/utils/themeContext';

interface MobileMenuFooterProps {
  onClose: () => void;
}

const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({ onClose }) => {
  const { theme } = useTheme();
  
  return (
    <Link to="/contact" className="mt-6" onClick={onClose}>
      <Button className={`w-full ${theme === 'light' ? 'bg-black text-white hover:bg-black/80 hover:text-white' : 'bg-black text-white hover:bg-black/80 hover:text-white'}`}>
        Umów spotkanie
      </Button>
    </Link>
  );
};

export default MobileMenuFooter;
