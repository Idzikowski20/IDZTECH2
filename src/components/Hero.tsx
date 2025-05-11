
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/utils/themeContext";
import { BlinkingUnderscore } from "@/components/ui/BlinkingUnderscore";

const Hero = () => {
  const { theme } = useTheme();
  
  return (
    <section id="hero" className="pt-24 pb-32 md:pt-32 md:pb-44 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Hero content on the left */}
          <div className="w-full lg:w-1/2">
            <div 
              className="mb-6 animate-fade-in opacity-0" 
              style={{animationFillMode: 'forwards', animationDelay: '0.1s'}}
            >
              <span className="bg-clip-text text-transparent bg-premium-gradient font-mono font-bold">
                IDZ.TECH_
              </span>
            </div>
            
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-aeonik animate-fade-in opacity-0"
              style={{animationFillMode: 'forwards', animationDelay: '0.2s'}}
            >
              Tworzymy najlepsze strony internetowe<BlinkingUnderscore />
            </h1>
            
            <p
              className="text-xl text-premium-light/80 mb-8 leading-relaxed animate-fade-in opacity-0"
              style={{animationFillMode: 'forwards', animationDelay: '0.3s'}}
            >
              Dostarczamy rozwiązania, które budują online obecność i konwertują odwiedzających w klientów. Specjalizujemy się w tworzeniu stron www, SEO i marketingu cyfrowym.
            </p>
            
            <div
              className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-10 animate-fade-in opacity-0"
              style={{animationFillMode: 'forwards', animationDelay: '0.4s'}}
            >
              <Link to="/contact">
                <Button size="lg" className="bg-premium-gradient hover:bg-white hover:text-black w-full sm:w-auto">
                  Skontaktuj się
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="hover:bg-white hover:text-black w-full sm:w-auto">
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
          
          {/* Hero image on the right - Updated with animation */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 animate-fade-in opacity-0" style={{animationFillMode: 'forwards', animationDelay: '0.6s'}}>
            <div className="relative">
              <img 
                src="/lovable-uploads/af7b17cd-510f-468f-a8b1-5b0c5be88c9f.png" 
                alt="Tworzenie Stron Internetowych" 
                className="w-full h-full object-contain bg-black rounded-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Circle blur effect */}
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-premium-purple/30 rounded-full blur-3xl opacity-20 z-0"></div>
      <div className="absolute -right-32 top-10 w-96 h-96 bg-premium-blue/30 rounded-full blur-3xl opacity-20 z-0"></div>
    </section>
  );
};

export default Hero;
