
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the top of the page on route changes
 * or when the page is reloaded
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Wait for the next tick to ensure DOM is ready
    setTimeout(() => {
      // Ensure body scroll is enabled
      document.body.style.overflow = '';
      
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
};
