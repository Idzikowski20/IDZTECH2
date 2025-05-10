import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
const Hero = () => {
  return <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-12 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 space-y-8 animate-fade-in">
            <div className="inline-flex items-center rounded-full bg-premium-dark border border-premium-purple/30 px-4 py-1 text-sm">
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-premium-purple text-premium-purple" />
                <Star size={14} className="fill-premium-purple text-premium-purple" />
                <Star size={14} className="fill-premium-purple text-premium-purple" />
                <Star size={14} className="fill-premium-purple text-premium-purple" />
                <Star size={14} className="fill-premium-purple text-premium-purple" />
              </span>
              <span className="ml-2 text-premium-light/70">Najlepsza agencja marketingowa</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Agencja marketingowa <span className="bg-premium-gradient text-transparent bg-clip-text">IDZ.TECH</span>
            </h1>
            
            <p className="text-xl text-premium-light/70 max-w-lg">
              Zwiększ swoją sprzedaż z wykorzystaniem nowoczesnych rozwiązań marketingowych. Zaufało nam już ponad 200 firm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-premium-gradient hover:opacity-90 transition-opacity text-white rounded-full px-8 py-6">
                Darmowa wycena
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button className="border-gray-200 hover:opacity-90 transition-opacity rounded-full px-8 py-6 text-center font-normal text-slate-50 border bg-black/0">
                Poznaj nasze usługi
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-premium-purple" />
                <span className="text-sm text-premium-light/70">Gwarancja rezultatów</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-premium-purple" />
                <span className="text-sm text-premium-light/70">Ponad 200 projektów</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-premium-purple" />
                <span className="text-sm text-premium-light/70">Certyfikowany partner Google</span>
              </div>
            </div>
          </div>
          
          {/* Right Side Image */}
          <div className="w-full lg:w-1/2 animate-slide-up">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-premium-gradient rounded-xl blur-sm opacity-75"></div>
              <div className="relative bg-premium-dark p-1 rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Marketing Digital Team" className="w-full h-auto rounded-lg object-cover aspect-video" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;