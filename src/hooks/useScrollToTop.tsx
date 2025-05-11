
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to the top of the page on route changes
 * or when the page is reloaded
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Simple approach: just scroll to top when pathname changes
    window.scrollTo(0, 0);
    
    // Ensure body scroll is always enabled when navigating
    document.body.style.overflow = '';
  }, [pathname]);
};
