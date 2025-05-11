
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/utils/themeContext';

const LightEffects: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
