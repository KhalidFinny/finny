'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Swiss Design - Clean Typography Layout */}
        <motion.div
          className="space-y-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Title - Swiss Style */}
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="animate-fade-in-up"
            >
              <p className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight text-white tracking-tight leading-none">
                <span className="block font-thin text-gray-300">HI, I&apos;M</span> KHALID
              </p>
            </motion.div>
            
            {/* Red accent line - Swiss design element */}
            <motion.div
              className="w-24 h-0.5 bg-red-400 mx-auto"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>

          {/* Description - Clean Swiss Typography */}
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light tracking-wide uppercase">
              Full Stack Developer, UI/UX Designer, Photographer, & Videographer
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              The guy who likes tech and also being creative, also a vroom vroom enthusiast.
            </p>
          </motion.div>

          {/* Minimal CTA - Swiss Design */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-red-400 font-light text-base md:text-lg uppercase tracking-widest transition-colors duration-300 border-b border-transparent hover:border-red-400 pb-1 smooth-transition animate-pulse-hover"
            >
              View Work
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-red-400 font-light text-base md:text-lg uppercase tracking-widest transition-colors duration-300 border-b border-transparent hover:border-red-400 pb-1 smooth-transition animate-pulse-hover"
            >
              About
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}