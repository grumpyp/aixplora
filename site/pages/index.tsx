"use client";

import Hero from "@/pages/components/Hero";
import Footer from "@/pages/components/Footer";
import SEOConfig from "./components/SEOConfig";
import Header from "./components/Header";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SEOConfig name="Home" />
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer />
    </main>
  );
}
