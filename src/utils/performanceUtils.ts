
// Mobile touch optimization
export const optimizeForMobile = () => {
  // Touch optimization
  document.addEventListener('touchstart', () => {}, { passive: true });
  
  // Fast click for older mobile browsers
  if ('ontouchstart' in document.documentElement) {
    const style = document.createElement('style');
    style.innerHTML = `
      button, a, input, select, textarea, [role="button"] {
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Disable double-tap to zoom on iOS for interactive elements
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
  interactiveElements.forEach(el => {
    el.addEventListener('touchend', e => {
      e.preventDefault();
      (e.target as HTMLElement).click();
    }, false);
  });
};

// Image optimization with lazy loading and appropriate sizing
export const optimizeImages = () => {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Set appropriate sizes for responsive images
    if (!img.hasAttribute('sizes') && !img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.setAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    }
  });
};

// Optimize scroll performance
export const optimizeScroll = () => {
  // Use passive scroll listeners for better performance
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(() => {
      // Empty function to trigger RAF which improves scrolling smoothness
    });
  }, { passive: true });
  
  // Remove any scroll jank by preventing excessive calculations during scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
};

// Detect slow connections and optimize accordingly
export const detectSlowConnection = () => {
  // Check if the browser supports the Network Information API
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      // Apply low-data optimizations
      document.body.classList.add('low-data-mode');
      
      // Defer non-critical resources
      const nonCriticalResources = document.querySelectorAll('img[data-src]:not(.critical), video, iframe');
      nonCriticalResources.forEach(resource => {
        resource.setAttribute('loading', 'lazy');
        if (resource.nodeName === 'VIDEO') {
          (resource as HTMLVideoElement).preload = 'none';
          (resource as HTMLVideoElement).autoplay = false;
        }
      });
    }
  }
};

// Apply all optimizations
export const applyMobileOptimizations = () => {
  optimizeForMobile();
  optimizeImages();
  optimizeScroll();
  detectSlowConnection();
  
  // Add momentum scrolling for iOS - using type assertion to fix the TypeScript error
  (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
};
