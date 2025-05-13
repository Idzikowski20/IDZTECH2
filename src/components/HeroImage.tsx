
import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded to true after a brief timeout for smoother transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      )}
      <div 
        className={`w-full h-full max-h-[1000px] ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ display: isLoaded ? 'block' : 'none' }}
      >
        <DotLottieReact
          src="https://lottie.host/f0718c9c-401a-471f-bc37-7576f640256b/kjND9P7piN.lottie"
          loop
          autoplay
          className="w-full h-full scale-[2.0]"
        />
      </div>
    </div>
  );
};

export default HeroImage;
