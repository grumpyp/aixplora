"use client";

import Hero from "@/pages/components/Hero";
import Navbar from "@/pages/components/Navbar";
import Footer from "@/pages/components/Footer";


export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden p-6 sm:px-16 md:px-20 lg:px-24">
        <Navbar />
        <Hero />
        <Footer />
    </main>
  );
}
