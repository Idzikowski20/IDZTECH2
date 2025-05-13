
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
    
    // Add fetchpriority for important images
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      img.setAttribute('fetchpriority', 'high');
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
  
  // Debounce scroll events to prevent excessive calculations
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

// Reduce JavaScript execution time
export const optimizeJavaScript = () => {
  // Use requestIdleCallback for non-critical operations
  const runDeferredOperations = () => {
    // Operations to run during idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        // Analytics, tracking, and other non-critical operations
        console.log('Running deferred operations during idle time');
      });
    } else {
      // Fallback for browsers not supporting requestIdleCallback
      setTimeout(() => {
        console.log('Running deferred operations with setTimeout fallback');
      }, 1000);
    }
  };
  
  // Run after initial render
  window.addEventListener('load', () => {
    runDeferredOperations();
  });
};

// Optimize font loading
export const optimizeFonts = () => {
  // Add font-display: swap to all font face rules
  if ('FontFace' in window) {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Eliminate render-blocking resources
export const eliminateRenderBlocking = () => {
  // Inject critical CSS inline
  const criticalCSS = `
    body { font-family: system-ui, -apple-system, sans-serif; }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; }
    .hero { min-height: 50vh; display: flex; align-items: center; }
  `;
  
  const style = document.createElement('style');
  style.innerHTML = criticalCSS;
  document.head.appendChild(style);
};

// Preconnect to origins
export const addPreconnects = () => {
  const origins = [
    'https://supabase.co',
    'https://web.cmp.usercentrics.eu',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  origins.forEach(origin => {
    if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.prepend(link);
    }
  });
};

// Apply all optimizations
export const applyMobileOptimizations = () => {
  // Add preconnects first for faster resource loading
  addPreconnects();
  
  // Optimize critical rendering path
  eliminateRenderBlocking();
  
  // Apply other optimizations
  optimizeForMobile();
  optimizeImages();
  optimizeScroll();
  detectSlowConnection();
  optimizeFonts();
  optimizeJavaScript();
  
  // Add momentum scrolling for iOS - using type assertion to fix the TypeScript error
  (document.documentElement.style as any).webkitOverflowScrolling = 'touch';
};

// Code splitting helper
export const loadComponentWhenNeeded = async (componentImportFunction: () => Promise<any>) => {
  try {
    return await componentImportFunction();
  } catch (error) {
    console.error('Error lazy loading component:', error);
    return null;
  }
};
