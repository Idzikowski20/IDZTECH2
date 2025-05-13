
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/utils/themeContext';

const LightEffects: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  // Safely use the theme context with a fallback
  let theme;
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch (error) {
    // Fallback to dark theme if context is not available
    theme = 'dark';
    console.warn('ThemeContext not available for LightEffects, using dark theme as fallback');
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Limited to just a few key light effects */}
      <div className="fixed top-40 left-20 w-24 h-24 bg-premium-purple/20 rounded-full blur-[70px] animate-pulse-slow"></div>
      <div className="fixed top-20 right-20 w-32 h-32 bg-premium-blue/20 rounded-full blur-[80px] animate-pulse-slow delay-150"></div>
    </div>
  );
};

export default LightEffects;
