
import React from 'react';
import { useInView } from 'react-intersection-observer';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ 
  children, 
  delay = 0, 
  className = "" 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        opacity: inView ? 1 : 0,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
