
import React, { useState, useEffect } from 'react';

const BlinkingUnderscore = () => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className="opacity-70">
      {visible ? '_' : ' '}
    </span>
  );
};

export default BlinkingUnderscore;
