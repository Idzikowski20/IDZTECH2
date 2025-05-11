
import React, { useEffect } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import { initGA, trackPageView } from "@/utils/analytics";

const Index = () => {
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    trackPageView(window.location.pathname);
  }, []);

  // Ensure scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  // Update document title to reflect web agency focus with improved SEO
  useEffect(() => {
    document.title = "IDZ.TECH - Tworzymy najlepsze strony internetowe";
  }, []);
  
  return (
    <div className="min-h-screen bg-premium-dark relative">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[url('https://www.esky.com/_fe/img/TE-background.svg')] bg-cover bg-center opacity-50 pointer-events-none z-[-2]"></div>
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Services />
        <FAQ />
        <About />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
