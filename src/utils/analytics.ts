
// Utility for tracking page views and events
// Uses direct Google Analytics 4 gtag API

// Initialize the GA tracking
export const initGA = (): void => {
  // Check if the gtag function exists (script loaded)
  if (typeof window !== 'undefined' && typeof window.gtag === 'undefined') {
    // Create the gtag function if it doesn't exist yet
    window.dataLayer = window.dataLayer || [];
    
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Initialize with the current timestamp
    window.gtag('js', new Date());
    
    // Initialize with the tracking ID
    window.gtag('config', 'G-9RHFQ8J95N', {
      page_path: window.location.pathname,
    });
    
    // Load the GA script if it's not already loaded
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9RHFQ8J95N';
    document.head.appendChild(script);
  }
};

// Track page views
export const trackPageView = (path: string): void => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};
