import React from 'react';
import { Herosection, Statsection, Features, Testimonial, Ctasection } from '@/components/sections';

export default function Home() {
  return (
    <main>
      <Herosection />
      <Statsection />
      <Features />
      <Testimonial />
      <Ctasection />
    </main>
  );
}

