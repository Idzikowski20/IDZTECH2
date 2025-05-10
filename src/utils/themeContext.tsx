
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'dark' : 'light';
  });
  
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply dark mode class to HTML element for Tailwind styles
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('bg-premium-dark');
      document.body.classList.add('text-premium-light');
      document.body.classList.remove('bg-premium-light');
      document.body.classList.remove('text-premium-dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('bg-premium-dark');
      document.body.classList.remove('text-premium-light');
      document.body.classList.add('bg-white'); // Using white instead of premium-light for better contrast
      document.body.classList.add('text-premium-dark');
    }
    
    // Update color scheme meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
    }
    
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
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
