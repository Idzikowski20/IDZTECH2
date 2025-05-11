
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
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="lg:w-1/2">
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
          
          <div className="lg:w-1/2 animate-fade-in opacity-0" style={{animationFillMode: 'forwards', animationDelay: '0.6s'}}>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
                alt="Web Development" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-premium-purple/30 rounded-2xl"></div>
              <div className="absolute -z-10 -top-4 -left-4 w-full h-full bg-premium-blue/30 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Circle blur effect */}
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-premium-purple/30 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -right-32 top-10 w-96 h-96 bg-premium-blue/30 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
