import Navigation from '@/components/Navigation';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ExperienceSection from '@/sections/ExperienceSection';
import PortfolioSection from '@/sections/PortfolioSection';
import Footer from '@/components/Footer';

export default function App() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen grain relative text-[var(--foreground)] font-urbanist">
      <div className="relative z-10">
        <Navigation scrollToSection={scrollToSection} />
        <main id="main-content">
          <HeroSection scrollToSection={scrollToSection} />
          <AboutSection />
          <ExperienceSection />
          <PortfolioSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
