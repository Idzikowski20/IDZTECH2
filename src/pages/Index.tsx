
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import LightEffects from "@/components/LightEffects";
import OurServices from "@/components/OurServices";

const Index = () => {
  return (
    <div className="min-h-screen">
      <LightEffects />
      <Navbar />
      <Hero />
      <OurServices />
      <Services />
      <FAQ />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
