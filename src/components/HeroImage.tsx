
import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

const HeroImage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleSplineLoad = () => {
    setIsLoading(false);
  };

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
        <Spline 
          scene="https://prod.spline.design/lrZX-sT7To1QdbSz/scene.splinecode" 
          onLoad={handleSplineLoad}
          style={{ 
            width: '100%', 
            height: '100%',
            maxHeight: '500px'
          }}
        />
      </div>
    </div>
  );
};

export default HeroImage;
