
import React, { useEffect, useState } from 'react';

const DotAnimation = () => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className={`${visible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>.</span>
  );
};

export default DotAnimation;
