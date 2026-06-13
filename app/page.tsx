import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Herosection, Statsection, Features, Testimonial, Ctasection } from '@/components/homepage';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a121a]">
      <Navbar />
      <Herosection />
      <Statsection />
      <Features />
      <Testimonial />
      <Ctasection />
      <Footer />
    </main>
  );
}

