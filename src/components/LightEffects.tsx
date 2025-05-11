
import React from 'react';

const LightEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="floating-light-dot w-48 h-48 bg-premium-purple/10 top-20 left-1/4 animate-floating-1" 
        style={{ '--direction-x': '1', '--direction-y': '-1' } as React.CSSProperties}
      ></div>
      <div 
        className="floating-light-dot w-64 h-64 bg-premium-blue/10 bottom-40 right-1/4 animate-floating-2" 
        style={{ '--direction-x': '-1', '--direction-y': '1' } as React.CSSProperties}
      ></div>
      <div 
        className="floating-light-dot w-32 h-32 bg-premium-pink/10 top-1/3 right-1/3 animate-floating-3" 
        style={{ '--direction-x': '-0.5', '--direction-y': '-0.5' } as React.CSSProperties}
      ></div>
    </div>
  );
};

export default LightEffects;
