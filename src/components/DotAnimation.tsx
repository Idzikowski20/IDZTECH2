
import React, { useEffect, useState } from 'react';

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
  direction: {
    x: number;
    y: number;
  };
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
          direction: {
            x: Math.random() > 0.5 ? 1 : -1,
            y: Math.random() > 0.5 ? 1 : -1
          }
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
    
    // Set interval to update dots positions every 15 seconds
    const interval = setInterval(() => {
      setDots(prevDots => prevDots.map(dot => ({
        ...dot,
        direction: {
          x: Math.random() > 0.7 ? -dot.direction.x : dot.direction.x,
          y: Math.random() > 0.7 ? -dot.direction.y : dot.direction.y
        }
      })));
    }, 15000);
    
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
            position: 'fixed',
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDuration: `${dot.animationDuration}s`,
            animationDelay: `${dot.animationDelay}s`,
            '--direction-x': dot.direction.x,
            '--direction-y': dot.direction.y,
            opacity: 0.9, // Increased from 0.8 to 0.9 for brightness
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default DotAnimation;
