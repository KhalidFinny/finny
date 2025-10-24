'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import PortfolioSection from '@/sections/PortfolioSection';
import Footer from '@/components/Footer';
import CosmicBackground from '@/components/StarryBackground';

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen background-fade-in">
      {/* Fixed cosmic background */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground />
      </div>
      
      {/* Content with proper z-index */}
      <div className="relative z-10">
        <Navigation scrollToSection={scrollToSection} />
        <HeroSection scrollToSection={scrollToSection} />
        <AboutSection />
        <PortfolioSection />
        <Footer />
      </div>
    </div>
  );
}
