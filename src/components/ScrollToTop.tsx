
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait for the next tick to ensure DOM is ready
    setTimeout(() => {
      // Ensure body scroll is enabled
      document.body.style.overflow = '';
      
      // Scroll to top when pathname changes
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 0);
    
    // Cleanup function to ensure scroll is always enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
