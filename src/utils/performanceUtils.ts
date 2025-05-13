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
    // Create font-display: swap style
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Preload critical fonts if not already done
  const preloadFont = (fontUrl: string) => {
    if (!document.querySelector(`link[rel="preload"][href="${fontUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  };
  
  // Add preload for critical fonts used above the fold
  // Należy dostosować ścieżki do używanych fontów
  // preloadFont('/fonts/main-font.woff2');
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
  
  // Defer non-critical CSS
  const deferCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  };
  
  // Znajdź i odłóż ładowanie nieistotnych arkuszy stylów
  document.querySelectorAll('link[rel="stylesheet"]:not([critical])').forEach(css => {
    const href = css.getAttribute('href');
    if (href) {
      css.remove();
      deferCSS(href);
    }
  });
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
  (document.documentElement as HTMLElement).style.webkitOverflowScrolling = 'touch';
  
  // Register performance marks for analysis
  if ('performance' in window && 'mark' in window.performance) {
    window.performance.mark('optimizations-applied');
  }
  
  // Activate Intersection Observer for lazy loading components
  setupIntersectionObserver();
};

// Setup Intersection Observer for lazy-loading content
const setupIntersectionObserver = () => {
  if (!('IntersectionObserver' in window)) return;
  
  const options = {
    rootMargin: '200px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        
        // Handle lazy images
        if (element.tagName === 'IMG' && element.hasAttribute('data-src')) {
          const src = element.getAttribute('data-src');
          if (src) {
            element.setAttribute('src', src);
            element.removeAttribute('data-src');
          }
        }
        
        // Handle lazy background images
        if (element.hasAttribute('data-bg')) {
          const bg = element.getAttribute('data-bg');
          if (bg) {
            element.style.backgroundImage = `url(${bg})`;
            element.removeAttribute('data-bg');
          }
        }
        
        // Handle lazy components
        if (element.hasAttribute('data-lazy-component')) {
          element.classList.add('visible');
        }
        
        observer.unobserve(element);
      }
    });
  }, options);
  
  // Observe all lazy-loaded elements
  document.querySelectorAll('[data-src], [data-bg], [data-lazy-component]').forEach(el => {
    observer.observe(el);
  });
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

// Measure and monitor FID (First Input Delay)
export const monitorFirstInputDelay = () => {
  const onFirstInputDelay = (callback: (delay: number) => void) => {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      // Monitor first input
      const observerFirstInput = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0] as PerformanceEventTiming;
          callback(firstInput.processingStart - firstInput.startTime);
          observerFirstInput.disconnect();
        }
      });
      
      observerFirstInput.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Error setting up first input delay monitoring:', e);
    }
  };
  
  // Log FID
  onFirstInputDelay((delay) => {
    console.log(`First Input Delay: ${delay.toFixed(1)}ms`);
    
    // Send to analytics when delay is above threshold
    if (delay > 100) {
      // TODO: Send high FID metric to analytics
    }
  });
};
