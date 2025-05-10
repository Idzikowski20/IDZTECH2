
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
      {/* Background Elements - Added more colorful lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Hero area lights */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-premium-purple/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-40 left-10 w-80 h-60 bg-premium-blue/20 rounded-full blur-[100px]"></div>
        
        {/* Services area lights */}
        <div className="absolute top-[40%] right-[15%] w-96 h-96 bg-premium-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] left-[5%] w-72 h-72 bg-[#00a0ff]/20 rounded-full blur-[90px]"></div>
        
        {/* FAQ area lights */}
        <div className="absolute top-[100%] right-[10%] w-80 h-80 bg-[#ff4d8c]/15 rounded-full blur-[100px]"></div>
        <div className="absolute top-[120%] left-[20%] w-96 h-96 bg-[#784dff]/15 rounded-full blur-[120px]"></div>
        
        {/* About area lights */}
        <div className="absolute top-[160%] right-[20%] w-64 h-64 bg-[#4dffb8]/15 rounded-full blur-[80px]"></div>
        <div className="absolute top-[180%] left-[10%] w-80 h-80 bg-[#ff9d4d]/15 rounded-full blur-[100px]"></div>
        
        {/* Testimonials area lights */}
        <div className="absolute top-[220%] right-[15%] w-96 h-96 bg-[#4d9aff]/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-[240%] left-[20%] w-80 h-80 bg-[#ff4d4d]/15 rounded-full blur-[100px]"></div>
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
