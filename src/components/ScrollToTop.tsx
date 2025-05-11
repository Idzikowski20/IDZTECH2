
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Simple approach: just scroll to top when pathname changes
    window.scrollTo(0, 0);
    
    // Ensure body scroll is always enabled when navigating
    document.body.style.overflow = '';
    
    // No cleanup needed as we want scroll enabled by default
  }, [pathname]);

  return null;
};

export default ScrollToTop;
