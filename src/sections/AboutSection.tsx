'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import TechStack from '@/components/TechStack';
import SocialProfileLink from '@/components/SocialProfileLink';
import { socialProfiles } from '@/data/socialData';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-8" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-light text-center text-white mb-12 lg:mb-16 animate-fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent font-light">Me</span>
        </motion.h2>
        
        {/* Swiss Design Layout */}
        <div className="max-w-5xl mx-auto">
          {/* Main content - Swiss grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Left column - About text */}
            <motion.div
              className="lg:col-span-1 space-y-8 animate-fade-in-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h3 className="text-2xl font-light text-white mb-6 tracking-wide uppercase">About</h3>
                <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                  Currently studying Applied Informatics at State Polytechnic of Malang, just a normal guy who likes to blend tech with creativity. Also a vroom vroom addict.
                </p>
              </div>
              
              {/* Social Profiles */}
              <div>
                <h4 className="text-base md:text-lg font-light text-white mb-4 tracking-widest uppercase">Connect</h4>
                <div className="flex gap-3">
                  {socialProfiles.map((url, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <SocialProfileLink url={url} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right columns - Tech Stack */}
            <motion.div
              className="lg:col-span-2 animate-fade-in-right"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TechStack />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
