
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Safely restore scroll behavior with proper timing
    const restoreScroll = () => {
      // Ensure body scroll is enabled
      document.body.style.overflow = '';
      
      // Scroll to top when pathname changes
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

  return null;
};

export default ScrollToTop;
