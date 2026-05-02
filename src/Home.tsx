import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import Discover from './components/Discover';
import Footer from './components/Footer';
import BrandMarquee from './components/BrandMarquee';
import StarField from './components/StarField';
import ShowreelCarousel from './components/ShowreelCarousel';
import FreeTrialWidget from './components/FreeTrialWidget';
import CursorGradient from './components/CursorGradient';
import { motion, useScroll, useSpring } from 'motion/react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-brand-dark">
      <StarField />
      <CursorGradient />
      <div className="grain-overlay" />
      <FreeTrialWidget />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-cyan z-[60] origin-left shadow-[0_0_10px_#00F5FF]"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        <BrandMarquee />
        <ShowreelCarousel />
        <WorkSection />
        <Discover />
      </main>

      <Footer />

      {/* Vertical Navigation Bar Indicators */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 hidden lg:flex flex-col gap-4 pr-6 z-30">
        <div className="w-px h-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="w-px h-4 bg-white/10"></div>
        <div className="w-px h-4 bg-white/10"></div>
      </div>
    </div>
  );
}
