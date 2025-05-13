
import { createRoot } from 'react-dom/client';
import './index.css';

// Import App dynamically for better JS loading performance
const loadApp = async () => {
  try {
    // Delay import for better First Contentful Paint
    const { default: App } = await import('./App');
    
    // Hydrate only when DOM is ready
    const root = createRoot(document.getElementById("root")!);
    
    // Remove loading message and render app
    root.render(<App />);
    
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
  }
};

// Use requestIdleCallback for low-priority work
if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(loadApp);
} else {
  // Fallback for browsers without requestIdleCallback
  setTimeout(loadApp, 50);
}
