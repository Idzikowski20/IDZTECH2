
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
      <Button className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white hover:text-white">
        Umów spotkanie
      </Button>
    </Link>
  );
};

export default MobileMenuFooter;
