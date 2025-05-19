
import { Link } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';

const Brand = () => {
  const { theme } = useTheme();
  
  return (
    <Link to="/" className="flex items-center">
      {theme === 'light' ? (
        // Light mode uses the black logo
        <img 
          src="/lovable-uploads/afd576d8-a4e0-4c2e-bafe-b4594aa84fd7.png" 
          alt="IDZ.TECH" 
          className="h-6 md:h-8" 
        />
      ) : (
        // Dark mode uses the white logo
        <img 
          src="/lovable-uploads/ddd7bae1-2d86-4fce-a8a4-3fc12d7a9077.png" 
          alt="IDZ.TECH" 
          className="h-6 md:h-8"
        />
      )}
    </Link>
  );
};

export default Brand;
