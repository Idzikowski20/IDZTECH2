
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the top of the page on route changes
 * or when the page is reloaded
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };
    
    // Use requestAnimationFrame to ensure the scroll happens after the DOM update
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 0);
    
    // Ensure body scroll is always enabled
    document.body.style.overflow = '';
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname]);
};
