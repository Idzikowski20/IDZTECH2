import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import LightEffects from "@/components/LightEffects";
import Hero from "@/components/Hero";
import OurServices from "@/components/OurServices";
import WhyWorkWithUs from "@/components/WhyWorkWithUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { applyMobileOptimizations } from "@/utils/performanceUtils";

const Index = () => {
  useEffect(() => {
    applyMobileOptimizations();

    const setupIntersectionObserver = () => {
      const options = {
        rootMargin: '200px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (element.id && element.getAttribute('data-preload')) {
              const preloadFunction = element.getAttribute('data-preload');
              if (typeof window[preloadFunction as keyof Window] === 'function') {
                (window[preloadFunction as keyof Window] as Function)();
              }
            }
            observer.unobserve(element);
          }
        });
      }, options);

      document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => setupIntersectionObserver());
    } else {
      setTimeout(() => setupIntersectionObserver(), 200);
    }

    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  return (
    <div className="min-h-screen">
      <LightEffects />
      <Navbar />
      <Hero />
      <OurServices />
      <WhyWorkWithUs />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
