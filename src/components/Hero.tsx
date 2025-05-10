
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/utils/themeContext";
import { BlinkingUnderscore } from "@/components/ui/BlinkingUnderscore";

const Hero = () => {
  const { theme } = useTheme();
  
  return (
    <section id="hero" className="pt-24 pb-32 md:pt-32 md:pb-44 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="bg-clip-text text-transparent bg-premium-gradient font-mono font-bold">
              IDZ.TECH_
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-aeonik"
          >
            Tworzymy najlepsze strony internetowe<BlinkingUnderscore />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-premium-light/80 mb-8 leading-relaxed"
          >
            Dostarczamy rozwiązania, które budują online obecność i konwertują odwiedzających w klientów. Specjalizujemy się w tworzeniu stron www, SEO i marketingu cyfrowym.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center text-sm text-premium-light/70"
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
          </motion.div>
        </div>
      </div>
      
      {/* Circle blur effect */}
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-premium-purple/30 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -right-32 top-10 w-96 h-96 bg-premium-blue/30 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
