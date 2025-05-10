
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
      document.body.classList.remove('bg-premium-dark');
      document.body.classList.remove('text-premium-light');
      document.body.classList.add('bg-premium-light');
      document.body.classList.add('text-premium-dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-premium-light');
      document.body.classList.remove('text-premium-dark');
      document.body.classList.add('bg-premium-dark');
      document.body.classList.add('text-premium-light');
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
