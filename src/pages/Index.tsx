
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyWorkWithUs from "@/components/WhyWorkWithUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LightEffects from "@/components/LightEffects";
import { applyMobileOptimizations } from "@/utils/performanceUtils";

// Function to optimize performance (extended version is now in performanceUtils.ts)
const optimizeImages = () => {
  // This will notify browsers that we'll be making changes to these properties
  // Reducing repaints and improving scrolling performance
  document.querySelectorAll('img').forEach(img => {
    // Add loading="lazy" for images
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Set appropriate image sizes based on viewport
    if (!img.hasAttribute('sizes')) {
      img.setAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    }
  });
};

const Index = () => {
  // Run performance optimization on component mount
  useEffect(() => {
    // Apply all mobile optimizations
    applyMobileOptimizations();
    
    // Original optimizations
    optimizeImages();
    
    // Add specific iOS/Android optimizations
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Touch optimization for inputs
      document.querySelectorAll('input, button, a').forEach(el => {
        el.setAttribute('touch-action', 'manipulation');
      });
      
      // Prevent rubber-band effect on iOS
      document.body.style.overscrollBehavior = 'none';
      
      // Force hardware acceleration
      document.body.style.transform = 'translateZ(0)';
      document.body.style.backfaceVisibility = 'hidden';
      
      // Improve touch response
      document.documentElement.style.touchAction = 'manipulation';
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
      <Services />
      <WhyWorkWithUs />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
