
import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded state to true immediately to avoid quality degradation
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        className={`w-full h-full max-h-[450px] ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      >
        <DotLottieReact
          src="https://lottie.host/f0718c9c-401a-471f-bc37-7576f640256b/kjND9P7piN.lottie"
          loop
          autoplay
          speed={0.5}
          className="w-full h-full scale-[1.1] overflow-visible"
        />
      </div>
    </div>
  );
};

export default HeroImage;
