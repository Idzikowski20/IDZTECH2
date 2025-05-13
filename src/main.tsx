import { createRoot } from 'react-dom/client';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

const loadApp = async () => {
  try {
    const cssPromise = new Promise((resolve) => {
      const link = document.querySelector('link[rel="stylesheet"][href*="index.css"]') as HTMLLinkElement | null;
      if (!link) return resolve(false);
      if (link.sheet) return resolve(true);

      link.onload = () => resolve(true);
      link.onerror = () => resolve(false);
    });

    await Promise.all([
      document.fonts.ready,
      cssPromise,
      new Promise(resolve => setTimeout(resolve, 300))
    ]);

    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        window.addEventListener('load', () => resolve(true), { once: true });
      });
    }

    console.log('All resources loaded, rendering app');
    const { default: App } = await import('./App');

    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("Root element not found");

    const root = createRoot(rootElement);
    document.body.style.visibility = 'visible';

    root.render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    if ('performance' in window && 'measure' in window.performance) {
      window.performance.mark('app-rendered');
      window.performance.measure('app-startup', 'navigationStart', 'app-rendered');
    }

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      loadingScreen.addEventListener('transitionend', () => loadingScreen.remove(), { once: true });
    }
  } catch (error) {
    console.error('Error loading application:', error);

    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.innerHTML = '<div style="text-align:center;padding:2rem;"><h1>Coś poszło nie tak</h1><p>Wystąpił błąd podczas ładowania aplikacji. Spróbuj odświeżyć stronę.</p></div>';
    }

    document.body.style.visibility = 'visible';
  }
};

loadApp();
