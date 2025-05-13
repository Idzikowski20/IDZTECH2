
import { useState, useEffect } from 'react';

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Preload image with proper path
    const img = new Image();
    img.src = "/hero-image.png"; // Using a more reliable path
    img.onload = () => setIsLoaded(true);
    
    return () => {
      img.onload = null;
    };
  }, []);

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      )}
      <img 
        src="/lovable-uploads/9bffe6a8-4473-494f-86da-66a5f005a323.png" 
        alt="Tworzenie Stron Internetowych" 
        className={`w-full h-full object-contain ${isLoaded ? 'animate-float' : 'opacity-0'}`}
        loading="lazy"
        width="600"
        height="400"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export default HeroImage;
