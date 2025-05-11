
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
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

  return null;
};

export default ScrollToTop;
