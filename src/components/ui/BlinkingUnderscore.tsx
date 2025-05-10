
import React, { useState, useEffect } from 'react';

export const BlinkingUnderscore: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`inline-block font-mono ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
      _
    </span>
  );
};

export default BlinkingUnderscore;
