
import React, { useState, useRef, useEffect } from 'react';

interface SparklesProps {
  className?: string;
  density?: number;
  color?: string;
}

export const Sparkles = ({ className = '', density = 500, color = '#ffffff' }: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; size: number; opacity: number; decay: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Generate initial sparkles based on density
      const particleCount = Math.floor((width * height) / (10000 / density));
      const initialSparkles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        decay: 0.005 + Math.random() * 0.01,
      }));
      
      setSparkles(initialSparkles);
    };

    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Animation loop
    let animationId = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setSparkles(prevSparkles => 
        prevSparkles.map(sparkle => {
          // Draw sparkle
          ctx.fillStyle = color.replace(')', `, ${sparkle.opacity})`).replace('rgb', 'rgba');
          ctx.beginPath();
          ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Update sparkle
          return {
            ...sparkle,
            opacity: sparkle.opacity - sparkle.decay,
            x: sparkle.x + (Math.random() - 0.5) * 0.2,
            y: sparkle.y + (Math.random() - 0.5) * 0.2,
          };
        }).filter(sparkle => sparkle.opacity > 0)
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [color, density]);

  return <canvas ref={canvasRef} className={className} />;
};
