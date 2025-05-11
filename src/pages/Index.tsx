
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
  
  // Update document title to reflect web agency focus
  useEffect(() => {
    document.title = "IDZ.TECH - Agencja Witryn Internetowych";
  }, []);
  
  return (
    <div className="min-h-screen bg-parallax">
      <Navbar />
      <Hero />
      <Services />
      <FAQ />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
