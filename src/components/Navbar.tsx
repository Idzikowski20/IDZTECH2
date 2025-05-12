
import MobileMenu from './navbar/MobileMenu';
import DesktopNavigation from './navbar/DesktopNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  
  // For mobile devices, we only need to pass the required props
  return isMobile ? <MobileMenu /> : <DesktopNavigation />;
};

export default Navbar;
