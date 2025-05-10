
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: 'light';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set a consistent theme
  const theme = 'light';
  
  useEffect(() => {
    // Apply the appropriate styles for the light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.body.style.backgroundColor = "#0a0a0a"; // Dark background
    
    // Update color scheme meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0a0a0a');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
