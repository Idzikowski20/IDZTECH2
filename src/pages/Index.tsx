
import React, { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import LightEffects from "@/components/LightEffects";
import Hero from "@/components/Hero"; 
import OurServices from "@/components/OurServices"; 
import { applyMobileOptimizations } from "@/utils/performanceUtils";
import { Demo } from "@/components/ui/demo";

// Lazy load components not immediately visible on first screen
const WhyWorkWithUs = lazy(() => import("@/components/WhyWorkWithUs"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const FAQ = lazy(() => import("@/components/FAQ"));
const CTA = lazy(() => import("@/components/CTA"));
const Footer = lazy(() => import("@/components/Footer"));

// Fallback loader for lazy components
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
  </div>
);

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

      {/* Statyczne komponenty - ładują się natychmiast */}
      <Hero />
      
      {/* Demo component */}
      <Demo />
      
      <OurServices />

      {/* Komponenty ładowane później */}
      <Suspense fallback={<LoadingFallback />}>
        <WhyWorkWithUs />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <CTA />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
