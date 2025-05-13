
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/utils/themeContext";
import { BlinkingUnderscore } from "@/components/ui/BlinkingUnderscore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import HeroImage from "@/components/HeroImage";

const Hero = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Delay setting visibility to improve perceived performance
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section id="hero" className="pt-20 pb-16 md:pt-28 md:pb-32 relative overflow-hidden">
      {/* Reduced quantity and opacity of light effects for better performance */}
      {showContent && (
        <>
          <div className="hidden md:block fixed top-40 left-20 w-24 h-24 bg-premium-purple/10 rounded-full blur-[70px] animate-pulse-slow"></div>
          <div className="hidden md:block fixed top-20 right-20 w-32 h-32 bg-premium-blue/10 rounded-full blur-[80px] animate-pulse-slow delay-150"></div>
        </>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Hero content on the left */}
          <div className="w-full lg:w-1/2 xl:w-5/12">            
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-aeonik transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}
            >
              Tworzymy najlepsze strony internetowe<BlinkingUnderscore />
            </h1>
            
            <p
              className={`text-lg md:text-xl text-premium-light/80 dark:text-premium-light/80 mb-6 md:mb-8 leading-relaxed transition-opacity duration-500 ${showContent ? 'opacity-100 delay-100' : 'opacity-0'}`}
            >
              Dostarczamy rozwiązania, które budują online obecność i konwertują odwiedzających w klientów. Specjalizujemy się w tworzeniu stron www, SEO i marketingu cyfrowym.
            </p>
            
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 md:gap-4 mb-6 md:mb-10 transition-opacity duration-500 ${showContent ? 'opacity-100 delay-200' : 'opacity-0'} ${isMobile ? 'w-full' : ''}`}
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
              className={`flex flex-wrap gap-3 md:gap-4 justify-start text-sm text-premium-light/70 transition-opacity duration-500 ${showContent ? 'opacity-100 delay-300' : 'opacity-0'}`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Szybka wydajność</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Nowoczesne technologie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Wysokie SEO</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Konkurencyjne ceny</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Bezpieczeństwo strony</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Strona nawet do 3 dni</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>CMS</span>
              </div>
            </div>
          </div>
          
          {/* Spline 3D object on the right */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0 h-[400px] sm:h-[450px] md:h-[480px] flex items-center justify-center" style={{ minHeight: "300px" }}>
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
