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
    applyMobileOptimizations(); // Jeśli nie używasz, usuń cały useEffect
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
