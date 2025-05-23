import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/utils/themeContext";
import { BlinkingUnderscore } from "@/components/ui/BlinkingUnderscore";
import { useMobile } from '@/hooks/use-mobile';
import HeroImage from "@/components/HeroImage";

const Hero = () => {
  const { theme } = useTheme();
  const isMobile = useMobile();
  
  return (
    <section id="hero" className={`${isMobile ? 'pt-28' : 'pt-20'} pb-16 md:pt-28 md:pb-32 relative overflow-hidden`}>
      {/* Reszta komponentu bez efektów świetlnych */}
      <div className="mt-80 container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* Hero content on the left */}
          <div className="w-full lg:w-1/2 xl:w-5/12">            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Tworzymy najlepsze strony internetowe<BlinkingUnderscore />
            </h1>
            
            <p
              className='text-lg md:text-xl text-premium-light/80 dark:text-premium-light/80 mb-6 md:mb-8 leading-relaxed'
            >
              Dostarczamy rozwiązania, które budują online obecność i konwertują odwiedzających w klientów. Specjalizujemy się w tworzeniu stron www, SEO i marketingu cyfrowym.
            </p>
            
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 md:gap-4 mb-6 md:mb-10 transition-opacity duration-500 ${isMobile ? 'w-full' : ''}`}
            >
              <Link to="/contact" className={isMobile ? 'w-full' : ''}>
                <Button size="lg" className="bg-premium-gradient hover:bg-white hover:text-black w-full">
                  Skontaktuj się
                </Button>
              </Link>
              <Link to="/projects" className={isMobile ? 'w-full' : ''}>
                <Button size="lg" variant="outline" className="hover:bg-black bg-transparent hover:text-white w-full">
                  Zobacz projekty
                </Button>
              </Link>
            </div>
            
            <div
              className='flex flex-wrap gap-3 md:gap-4 transition-opacity duration-500'
            >
              <div className="flex items-center justify-start gap-2 text-sm text-premium-light/70">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Szybka wydajność</span>
              </div>
              <div className="flex items-center justify-start gap-2 text-sm text-premium-light/70">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Nowoczesne technologie</span>
              </div>
              <div className="flex items-center justify-start gap-2 text-sm text-premium-light/70">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Wysokie SEO</span>
              </div>
              <div className="flex items-center justify-start gap-2 text-sm text-premium-light/70">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Konkurencyjne ceny</span>
              </div>
              <div className="flex items-center justify-start gap-2 text-sm text-premium-light/70">
                <CheckCircle2 className="text-premium-purple h-4 w-4" />
                <span>Bezpieczeństwo strony</span>
              </div>
              <div className="flex items-center justify-start gap-2 text-sm text-premium-light/70">
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
