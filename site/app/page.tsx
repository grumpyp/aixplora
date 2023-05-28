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

// <div
// href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
// className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
// target="_blank"
// rel="noopener noreferrer"
// >
// <h2 className={`mb-3 text-2xl font-semibold`}>
//   Deploy{' '}
//   <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//     -&gt;
//   </span>
// </h2>
// <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//   Instantly deploy your Next.js site to a shareable URL with Vercel.
// </p>
// </div>
