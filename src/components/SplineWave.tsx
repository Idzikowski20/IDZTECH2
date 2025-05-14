
import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { useTheme } from '@/utils/themeContext';

const SplineWave = () => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Scene URLs for different themes
  const darkThemeScene = "https://prod.spline.design/YvNI5BBJPy0T5naJ/scene.splinecode";
  const lightThemeScene = "https://prod.spline.design/Mb27QN7QACoVubsG/scene.splinecode";
  
  // Select the appropriate scene based on the current theme
  const sceneUrl = theme === 'light' ? lightThemeScene : darkThemeScene;
  
  return (
    <div className="w-full relative" style={{ height: '200px' }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
        </div>
      )}
      <Spline 
        scene={sceneUrl} 
        onLoad={() => setIsLoaded(true)}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default SplineWave;
