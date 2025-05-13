
import { useState, useEffect } from 'react';

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Preload image with proper path
    const img = new Image();
    img.src = "/lovable-uploads/5885fae1-77e4-4845-8654-69fdaa244e36.png"; // Using the uploaded image
    img.onload = () => setIsLoaded(true);
    
    return () => {
      img.onload = null;
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      )}
      <img 
        src="/lovable-uploads/5885fae1-77e4-4845-8654-69fdaa244e36.png" 
        alt="Tworzenie Stron Internetowych" 
        className={`w-full h-full object-contain max-h-[500px] ${isLoaded ? 'animate-float' : 'opacity-0'}`}
        loading="eager" // Keep eager loading for hero image
        width="800"
        height="600"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export default HeroImage;
