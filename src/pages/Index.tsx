
import React, { useEffect, lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import LightEffects from "@/components/LightEffects";
import { applyMobileOptimizations } from "@/utils/performanceUtils";
import OurServices from "@/components/OurServices"; // Using OurServices instead of Services

// Lazy load non-critical components
const Hero = lazy(() => import("@/components/Hero"));
// Removed Services import since we're using OurServices now
const WhyWorkWithUs = lazy(() => import("@/components/WhyWorkWithUs"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const FAQ = lazy(() => import("@/components/FAQ"));
const CTA = lazy(() => import("@/components/CTA"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-premium-purple"></div>
  </div>
);

const Index = () => {
  // Run performance optimization on component mount
  useEffect(() => {
    // Apply all mobile optimizations
    applyMobileOptimizations();
    
    // Add observers for lazy loading components
    const setupIntersectionObserver = () => {
      const options = {
        rootMargin: '200px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            // Preload any data or resources needed for this section
            if (element.id && element.getAttribute('data-preload')) {
              const preloadFunction = element.getAttribute('data-preload');
              if (typeof window[preloadFunction as keyof Window] === 'function') {
                (window[preloadFunction as keyof Window] as Function)();
              }
            }
            // Unobserve after handling
            observer.unobserve(element);
          }
        });
      }, options);
      
      // Observe all sections
      document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
      });
    };
    
    // Call setup after initial render
    window.requestIdleCallback ? 
      window.requestIdleCallback(() => setupIntersectionObserver()) : 
      setTimeout(() => setupIntersectionObserver(), 200);
    
    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      <LightEffects />
      <Navbar />
      
      <Suspense fallback={<LoadingFallback />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <OurServices />
      </Suspense>
      
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
