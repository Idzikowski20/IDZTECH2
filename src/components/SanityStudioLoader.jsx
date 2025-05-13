
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Studio } from 'sanity';
import { createConfig } from '../sanity.config';

const SanityStudioLoader = () => {
  useEffect(() => {
    // Get the container element
    const element = document.getElementById('sanity-studio');
    if (!element) return;

    // Clean existing content
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    // Create the studio
    const root = createRoot(element);
    root.render(<Studio config={createConfig()} />);

    // Cleanup function
    return () => {
      try {
        root.unmount();
      } catch (e) {
        console.error('Error unmounting Sanity Studio:', e);
      }
    };
  }, []);

  return null;
};

export default SanityStudioLoader;
