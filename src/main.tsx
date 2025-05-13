
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
        // Fix: Type cast the link element to HTMLLinkElement to access sheet, onload and onerror
        const linkElement = link as HTMLLinkElement;
        if (linkElement.sheet) {
          console.log('CSS already loaded');
          resolve(true); // CSS already loaded
        } else {
          console.log('Waiting for CSS to load...');
          linkElement.onload = () => {
            console.log('CSS loaded successfully');
            resolve(true);
          };
          linkElement.onerror = () => {
            console.error('CSS failed to load');
            resolve(false);
          };
        }
      } else {
        console.warn('CSS link not found');
        resolve(false);
      }
    });

    // Wait for all critical resources to load before rendering
    await Promise.all([
      // Font loading promise
      document.fonts.ready,
      cssPromise,
      // Add a minimum delay to prevent flashes
      new Promise(resolve => setTimeout(resolve, 300))
    ]);
    
    // Only continue after document is fully interactive
    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        const checkReady = () => {
          if (document.readyState === 'complete') {
            resolve(true);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      });
    }
    
    console.log('All resources loaded, rendering app');
    
    // Delay import for better First Contentful Paint
    const { default: App } = await import('./App');
    
    // Hydrate only when DOM is ready
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");
    
    const root = createRoot(rootElement);
    
    // Make body visible before rendering to prevent FOUC
    document.body.style.visibility = 'visible';
    
    // Render app with Helmet for meta tags
    root.render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    
    // Register performance metrics
    if ('performance' in window && 'measure' in window.performance) {
      window.performance.mark('app-rendered');
      window.performance.measure('app-startup', 'navigationStart', 'app-rendered');
    }
    
    // Remove loading screen after rendering
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
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
