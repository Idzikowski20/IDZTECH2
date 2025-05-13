
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Define Theme type and export it properly with 'export type'
export type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  toggleDarkMode: () => void;
  setTheme: (theme: Theme) => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'dark' }) => {
  // Use the defaultTheme prop if provided
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    // Check if there's a saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    // If there's a saved preference, use it; otherwise use defaultTheme
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      // If no saved preference, use the defaultTheme
      setTheme(defaultTheme);
      document.documentElement.classList.add(defaultTheme);
      localStorage.setItem('theme', defaultTheme);
    }
  }, [defaultTheme]);

  const toggleDarkMode = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      
      // Show toast notification when switching to light mode
      toast.warning(
        "⚠️ Tryb jasny jest w trakcie budowy i mogą występować błędy, za które przepraszamy.",
        {
          duration: 5000,
          position: 'top-center'
        }
      );
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode, setTheme }}>
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
