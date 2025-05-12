
import MobileMenu from './navbar/MobileMenu';
import DesktopNavigation from './navbar/DesktopNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileMenu isMenuOpen={false} setIsMenuOpen={() => {}} /> : <DesktopNavigation />;
};

export default Navbar;
