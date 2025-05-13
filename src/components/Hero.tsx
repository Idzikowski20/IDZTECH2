
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/utils/themeContext";
import { BlinkingUnderscore } from "@/components/ui/BlinkingUnderscore";
import { useIsMobile } from "@/hooks/use-mobile";
import { lazy, Suspense, useEffect, useState } from "react";

// Import HeroImage directly instead of lazy loading for critical above-the-fold content
import HeroImage from "@/components/HeroImage";

const Hero = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Delay setting visibility to improve FCP
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section id="hero" className="pt-24 pb-32 md:pt-32 md:pb-44 relative overflow-hidden">
      {/* Reduced quantity and opacity of light effects for better performance */}
      {isVisible && (
        <>
          <div className="hidden md:block fixed top-40 left-20 w-24 h-24 bg-premium-purple/10 rounded-full blur-[70px] animate-pulse-slow"></div>
          <div className="hidden md:block fixed top-20 right-20 w-32 h-32 bg-premium-blue/10 rounded-full blur-[80px] animate-pulse-slow delay-150"></div>
        </>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Hero content on the left */}
          <div className="w-full lg:w-5/12">            
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-aeonik animate-fade-in opacity-0"
              style={{animationFillMode: 'forwards', animationDelay: '0.2s'}}
            >
              Tworzymy najlepsze strony internetowe<BlinkingUnderscore />
            </h1>
            
            <p
              className="text-xl text-premium-light/80 dark:text-premium-light/80 mb-8 leading-relaxed animate-fade-in opacity-0"
              style={{animationFillMode: 'forwards', animationDelay: '0.3s'}}
            >
              Dostarczamy rozwiązania, które budują online obecność i konwertują odwiedzających w klientów. Specjalizujemy się w tworzeniu stron www, SEO i marketingu cyfrowym.
            </p>
            
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 mb-10 animate-fade-in opacity-0 ${isMobile ? 'w-full' : ''}`}
              style={{animationFillMode: 'forwards', animationDelay: '0.4s'}}
            >
              <Link to="/contact" className={isMobile ? 'w-full' : ''}>
                <Button size="lg" className="bg-premium-gradient hover:bg-white hover:text-black w-full">
                  Skontaktuj się
                </Button>
              </Link>
              <Link to="/projects" className={isMobile ? 'w-full' : ''}>
                <Button size="lg" variant="outline" className="hover:bg-black hover:text-white w-full">
                  Zobacz projekty
                </Button>
              </Link>
            </div>
            
            <div
              className="flex flex-col md:flex-row gap-4 md:gap-8 justify-start text-sm text-premium-light/70 animate-fade-in opacity-0"
              style={{animationFillMode: 'forwards', animationDelay: '0.5s'}}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-5 w-5" />
                <span>Szybkie strony</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-5 w-5" />
                <span>Najlepsza wydajność</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-5 w-5" />
                <span>Nowoczesne technologie</span>
              </div>
            </div>
          </div>
          
          {/* Hero image on the right - increased size by adjusting width ratio */}
          <div className="w-full lg:w-7/12 mt-8 lg:mt-0 animate-fade-in opacity-0" 
               style={{animationFillMode: 'forwards', animationDelay: '0.6s'}}>
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
