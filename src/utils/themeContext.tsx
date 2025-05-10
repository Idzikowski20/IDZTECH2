
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply dark mode class to HTML element for Tailwind styles
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-premium-dark');
      document.body.classList.add('text-premium-light');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-premium-dark');
      document.body.classList.remove('text-premium-light');
      document.body.classList.add('bg-premium-light');
      document.body.classList.add('text-premium-dark');
    }

    // Clean up function
    return () => {
      if (!isDarkMode) {
        document.body.classList.remove('bg-premium-light');
        document.body.classList.remove('text-premium-dark');
      }
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
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
