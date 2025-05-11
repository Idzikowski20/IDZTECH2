
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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Initialize and handle dots
  useEffect(() => {
    // Create dots with random properties
    const generateDots = () => {
      const newDots: Dot[] = [];
      const colors = [
        'bg-premium-purple',
        'bg-premium-blue',
        'bg-premium-pink',
      ];
      
      // Generate 3 dots with different properties for better visual effect
      for (let i = 0; i < 3; i++) {
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
    
    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
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
            opacity: 0.98, // Increased brightness
            filter: 'blur(80px)',
            borderRadius: '50%',
            transition: 'all 15s ease-in-out',
            zIndex: -1,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default DotAnimation;
