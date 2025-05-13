import { createRoot } from 'react-dom/client';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Create a loading indicator that will show until the app is fully loaded
const createLoadingIndicator = () => {
  const loadingContainer = document.createElement('div');
  loadingContainer.id = 'loading-indicator';
  loadingContainer.style.position = 'fixed';
  loadingContainer.style.top = '0';
  loadingContainer.style.left = '0';
  loadingContainer.style.width = '100%';
  loadingContainer.style.height = '100%';
  loadingContainer.style.display = 'flex';
  loadingContainer.style.justifyContent = 'center';
  loadingContainer.style.alignItems = 'center';
  loadingContainer.style.backgroundColor = 'var(--background, #ffffff)';
  loadingContainer.style.zIndex = '9999';
  loadingContainer.style.transition = 'opacity 0.3s ease-out';
  
  // Create spinner element - using similar style as in LoadingSpinner component
  const spinner = document.createElement('div');
  spinner.style.width = '48px';
  spinner.style.height = '48px';
  spinner.style.borderRadius = '50%';
  spinner.style.border = '3px solid rgba(138, 75, 255, 0.2)';
  spinner.style.borderTop = '3px solid var(--primary, #8a4bff)';
  spinner.style.animation = 'spin 1s linear infinite';
  
  // Add animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    :root {
      color-scheme: light dark;
    }
    
    @media (prefers-color-scheme: dark) {
      #loading-indicator {
        background-color: var(--background, #121212);
      }
    }
  `;
  
  document.head.appendChild(style);
  loadingContainer.appendChild(spinner);
  document.body.appendChild(loadingContainer);
  
  return loadingContainer;
};

// Import App dynamically for better JS loading performance
const loadApp = async () => {
  try {
    const loadingIndicator = createLoadingIndicator();
    
    // Ensure critical CSS is loaded
    await Promise.all([
      // Font loading promise
      document.fonts.ready,
      
      // Add a minimum delay to prevent flashes
      new Promise(resolve => setTimeout(resolve, 300))
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
    
    // Remove loading indicator with a fade effect
    loadingIndicator.style.opacity = '0';
    setTimeout(() => {
      loadingIndicator.remove();
    }, 300);
    
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

// Create and add initial style to prevent FOUC (Flash of Unstyled Content)
const initialStyle = document.createElement('style');
initialStyle.textContent = `
  body {
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }
`;
document.head.appendChild(initialStyle);

// Start loading the app immediately but keep body hidden
loadApp();

// Make the body visible once styles are likely loaded
setTimeout(() => {
  document.body.style.opacity = '1';
}, 100);
