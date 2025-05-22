import React, { Suspense } from "react";
import { useState, useEffect } from 'react';
import { useMobile } from '@/hooks/use-mobile';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

const HeroImage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMobile();
  
  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  const splineScene = isMobile 
    ? "https://prod.spline.design/ZDFIdMHx6E5pLNRL/scene.splinecode"
    : "https://prod.spline.design/lrZX-sT7To1QdbSz/scene.splinecode";

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="w-full h-80 md:h-[450px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
        </div>
      )}
      <div 
        className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ minHeight: '300px', height: '100%' }}
      >
        <Suspense fallback={<div>Ładowanie...</div>}>
          <Spline 
            scene={splineScene}
            onLoad={handleSplineLoad}
            style={{ 
              width: '100%', 
              height: '100%',
              maxHeight: '500px'
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HeroImage;
