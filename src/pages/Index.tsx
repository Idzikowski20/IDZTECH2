
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ProcessAnimation from "@/components/ProcessAnimation";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LightEffects from "@/components/LightEffects";

const Index = () => {
  return (
    <div className="min-h-screen">
      <LightEffects />
      <Navbar />
      <Hero />
      <Services />
      <ProcessAnimation />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
