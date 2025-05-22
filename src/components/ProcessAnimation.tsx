import { useRef, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface ProcessBoxProps {
  number: string;
  title: string;
  description: string;
  delay: number;
}

const ProcessBox: React.FC<ProcessBoxProps> = ({ number, title, description, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2
  });

  return (
    <motion.div 
      ref={ref}
      className={`relative border border-premium-light/10 rounded-xl p-6 transition-all duration-700 ${
        inView ? 'bg-premium-dark/70 shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'bg-premium-dark/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
    >
      <div className="flex items-center mb-4">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mr-4
          ${inView ? 'bg-premium-gradient text-white' : 'bg-premium-dark border border-premium-light/20 text-premium-light/50'}
          transition-all duration-500
        `}>
          {number}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-premium-light/70">{description}</p>
    </motion.div>
  );
};

interface FloatingImageProps {
  src: string;
  alt: string;
  className?: string;
  translateX?: number;
  translateY?: number;
  rotateAngle?: number;
}

const FloatingImage: React.FC<FloatingImageProps> = ({ 
  src, 
  alt, 
  className = "",
  translateX = 15,
  translateY = 15,
  rotateAngle = 5
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    const element = imageRef.current;
    if (element) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      
      observer.observe(element);
      
      if (isInView) {
        window.addEventListener('mousemove', handleMouseMove);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      
      return () => {
        observer.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isInView]);

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`}>
      <div 
        style={{ 
          transform: `
            translate(${mousePosition.x * translateX}px, ${mousePosition.y * translateY}px) 
            rotate(${mousePosition.x * rotateAngle}deg)
          `,
          transition: 'transform 0.2s ease-out'
        }}
        className="w-full h-full"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

interface ProcessAnimationProps {
  className?: string;
  imageSrc?: string;
}

const ProcessAnimation: React.FC<ProcessAnimationProps> = ({ className = "", imageSrc = "/placeholder.svg" }) => {
  const processes = [
    {
      number: "1",
      title: "Analiza",
      description: "Dokładnie analizujemy Twoje potrzeby i cele biznesowe, aby stworzyć idealną strategię.",
      delay: 0
    },
    {
      number: "2",
      title: "Projektowanie",
      description: "Tworzymy nowoczesne projekty graficzne, które przyciągają uwagę i angażują użytkowników.",
      delay: 2
    },
    {
      number: "3",
      title: "Rozwój",
      description: "Implementujemy zaawansowane rozwiązania techniczne zapewniające stabilność i wydajność.",
      delay: 4
    },
    {
      number: "4",
      title: "Testowanie",
      description: "Szczegółowo testujemy wszystkie funkcje, aby zapewnić bezbłędne działanie.",
      delay: 6
    },
    {
      number: "5",
      title: "Wdrożenie",
      description: "Bezpiecznie wdrażamy projekty i zapewniamy pełne wsparcie techniczne.",
      delay: 8
    }
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-6">Proces tworzenia strony</h2>
        <div className="space-y-6">
          {processes.map((process, index) => (
            <ProcessBox
              key={index}
              number={process.number}
              title={process.title}
              description={process.description}
              delay={process.delay}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <FloatingImage
            src={imageSrc}
            alt="Proces tworzenia strony"
            className="rounded-xl shadow-lg border border-premium-light/10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessAnimation;
