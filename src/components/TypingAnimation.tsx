
import React, { useEffect, useState, useRef } from 'react';
import { Code } from 'lucide-react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text = "_", 
  speed = 150,
  className = "" 
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  
  // Typing animation effect
  useEffect(() => {
    if (!text) return;
    
    let isMounted = true;
    
    const typeText = () => {
      if (!isMounted) return;
      
      if (indexRef.current < text.length) {
        setDisplayText(prev => prev + text.charAt(indexRef.current));
        indexRef.current += 1;
        setTimeout(typeText, speed);
      } else {
        setIsTyping(false);
        // Reset and start over after a pause
        setTimeout(() => {
          if (isMounted) {
            setDisplayText("");
            indexRef.current = 0;
            setIsTyping(true);
            setTimeout(typeText, speed * 2);
          }
        }, 2000);
      }
    };
    
    if (isTyping) {
      typeText();
    }
    
    return () => {
      isMounted = false;
    };
  }, [text, speed, isTyping]);
  
  // Cursor blinking effect
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    let isMounted = true;
    
    const blinkCursor = () => {
      if (!isMounted || !cursor) return;
      
      cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
      setTimeout(blinkCursor, 500);
    };
    
    blinkCursor();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <Code size={18} className="mr-1 text-premium-purple" />
      <span className="font-mono">{displayText}</span>
      <span 
        ref={cursorRef} 
        className="font-mono text-premium-purple transition-opacity"
      >_</span>
    </div>
  );
};

export default TypingAnimation;
