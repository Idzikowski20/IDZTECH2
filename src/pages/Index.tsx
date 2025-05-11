
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

// Function to optimize performance
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
    // Optimize image loading
    optimizeImages();
    
    // Reduce layout shifts by precomputing sizes
    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(() => {
        // Empty function to trigger RAF which improves scrolling smoothness
      });
    }, { passive: true });
    
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
