
import React from 'react';

const LightEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="floating-dot w-48 h-48 bg-premium-purple/30 top-20 left-1/4" style={{ '--direction-x': '1', '--direction-y': '-1' } as React.CSSProperties}></div>
      <div className="floating-dot w-64 h-64 bg-premium-blue/20 bottom-40 right-1/4" style={{ '--direction-x': '-1', '--direction-y': '1' } as React.CSSProperties}></div>
      <div className="floating-dot w-32 h-32 bg-premium-pink/20 top-1/3 right-1/3" style={{ '--direction-x': '-0.5', '--direction-y': '-0.5' } as React.CSSProperties}></div>
    </div>
  );
};

export default LightEffects;
