
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the top of the page on route changes
 * or when the page is reloaded
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Safely restore scroll behavior with proper timing
    const restoreScroll = () => {
      // Ensure body scroll is enabled
      document.body.style.overflow = '';
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Use requestAnimationFrame to ensure DOM is ready
    window.requestAnimationFrame(() => {
      restoreScroll();
    });
    
    // Cleanup function to ensure scroll is always enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [pathname]);
};
