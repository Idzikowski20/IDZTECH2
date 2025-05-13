
import { createRoot } from 'react-dom/client';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Create a loading indicator that will show until the app is fully loaded
const createLoadingIndicator = () => {
  // Skip creating another loader since we already have one in HTML
  return null;
};

// Import App dynamically for better JS loading performance
const loadApp = async () => {
  try {
    // Ensure critical CSS is loaded
    // Move this to the beginning to ensure styles load first
    const cssPromise = new Promise((resolve) => {
      const link = document.querySelector('link[rel="stylesheet"][href*="index.css"]');
      if (link) {
        if (link.sheet) {
          resolve(true); // CSS already loaded
        } else {
          link.onload = () => resolve(true);
          link.onerror = () => resolve(false);
        }
      } else {
        resolve(false);
      }
    });

    await Promise.all([
      // Font loading promise
      document.fonts.ready,
      cssPromise,
      // Add a minimum delay to prevent flashes
      new Promise(resolve => setTimeout(resolve, 100))
    ]);
    
    // Delay import for better First Contentful Paint
    const { default: App } = await import('./App');
    
    // Hydrate only when DOM is ready
    const root = createRoot(document.getElementById("root")!);
    
    // Render app with Helmet for meta tags
    root.render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    
    // Make body visible if it isn't already
    document.body.style.visibility = 'visible';
    
    // Register performance metrics
    if ('performance' in window && 'measure' in window.performance) {
      window.performance.mark('app-rendered');
      window.performance.measure('app-startup', 'navigationStart', 'app-rendered');
    }
  } catch (error) {
    console.error('Error loading application:', error);
    
    // Show error message instead of blank screen
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.innerHTML = '<div style="text-align:center;padding:2rem;"><h1>Coś poszło nie tak</h1><p>Wystąpił błąd podczas ładowania aplikacji. Spróbuj odświeżyć stronę.</p></div>';
    }
    
    // Make body visible in case of error
    document.body.style.visibility = 'visible';
  }
};

// Start loading the app immediately
loadApp();
