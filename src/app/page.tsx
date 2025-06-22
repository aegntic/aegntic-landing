'use client';

import { useState } from 'react';
import { Toaster } from 'sonner';
import AsciiIntro from '@/components/AsciiIntro';
import Navbar from '@/components/Navbar';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Services from '@/sections/Services';
import Portfolio from '@/sections/Portfolio';
import Team from '@/sections/Team';
import Testimonials from '@/sections/Testimonials';
import Blog from '@/sections/Blog';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import { ThemeProvider } from '@/lib/theme-context';
import ScrollProgressBar from '@/components/ScrollProgressBar';

export default function Home() {
  const [introCompleted, setIntroCompleted] = useState(false);

  return (
    <ThemeProvider>
      <main className="min-h-screen bg-background text-foreground">
        <Toaster position="top-right" />
        <ScrollProgressBar />
        <AsciiIntro onIntroComplete={() => setIntroCompleted(true)} />
        <Navbar introCompleted={introCompleted} />

        <div className={introCompleted ? 'opacity-100' : 'opacity-0'}>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Team />
          <Testimonials />
          <Blog />
          <Contact />
          <Footer />
        </div>
      </main>
    </ThemeProvider>
  );
}
