
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
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
  
  // Update document title to reflect web agency focus
  useEffect(() => {
    document.title = "IDZ.TECH - Agencja Witryn Internetowych";
  }, []);
  
  return (
    <div className="min-h-screen bg-premium-dark dark:bg-premium-light relative">
      {/* Background Elements - Only two fixed position lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Main lights */}
        <div className="fixed top-10 right-10 w-96 h-96 bg-premium-purple/20 rounded-full blur-[120px]"></div>
        <div className="fixed bottom-40 left-10 w-80 h-80 bg-premium-blue/20 rounded-full blur-[100px]"></div>
      </div>
      
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
