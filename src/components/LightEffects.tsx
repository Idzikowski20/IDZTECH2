
import React from 'react';

const LightEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="absolute w-48 h-48 bg-premium-purple/10 top-32 left-20 rounded-full animate-float-1 blur-[40px]" 
      ></div>
      <div 
        className="absolute w-56 h-56 bg-premium-blue/5 top-1/3 left-1/2 -translate-x-1/2 rounded-full animate-float-2 blur-[50px]" 
      ></div>
      <div 
        className="absolute w-48 h-48 bg-premium-pink/10 top-20 right-20 rounded-full animate-float-3 blur-[40px]" 
      ></div>
    </div>
  );
};

export default LightEffects;
