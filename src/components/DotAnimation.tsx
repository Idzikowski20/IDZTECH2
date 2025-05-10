
import React, { useEffect, useState } from 'react';

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
}

const DotAnimation: React.FC = () => {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    // Create dots with random properties
    const generateDots = () => {
      const newDots: Dot[] = [];
      const colors = [
        'bg-premium-purple',
        'bg-premium-blue',
        'bg-premium-pink',
      ];
      
      // Generate 2 dots with different properties
      for (let i = 0; i < 2; i++) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        newDots.push({
          id: i,
          x: Math.random() * windowWidth,
          y: Math.random() * windowHeight,
          size: Math.random() * 200 + 100, // Between 100px and 300px
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: Math.random() * 20 + 15, // Between 15s and 35s
          animationDelay: Math.random() * 5, // Between 0s and 5s
        });
      }
      
      setDots(newDots);
    };
    
    generateDots();
    
    // Regenerate dots on window resize
    const handleResize = () => {
      generateDots();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set interval to update dots positions every 30 seconds
    const interval = setInterval(() => {
      generateDots();
    }, 30000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`floating-dot ${dot.color}`}
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDuration: `${dot.animationDuration}s`,
            animationDelay: `${dot.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default DotAnimation;
