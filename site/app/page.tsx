'use client'

import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import '../styles/styles.css'
 

export default function Home() {


  return (
    <main className="relative">
 
      <Navbar />
      <Hero />
    </main>
  );
}

