
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Simple, reliable approach - scroll to top when the route changes
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
    
    // Always ensure body scroll is enabled on navigation
    document.body.style.overflow = '';
  }, [pathname]);

  return null;
};

export default ScrollToTop;
