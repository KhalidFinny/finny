import { motion } from 'framer-motion';
import { useRef } from 'react';
import TechStack from '@/components/TechStack';
import SocialProfileLink from '@/components/SocialProfileLink';
import { socialProfiles } from '@/data/socialData';

export default function AboutSection() {
  const ref = useRef(null);

  return (
    <section id="about" className="py-24 md:py-40 px-6 md:px-20 lg:px-32 relative overflow-hidden" ref={ref}>
      <div className="absolute top-16 right-10 w-40 h-40 md:w-56 md:h-56 paint-blob bg-[var(--mclaren-red)]/12 pointer-events-none" />
      <div className="absolute bottom-14 left-0 w-40 h-20 doodle-ring -rotate-[12deg] opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-12 mb-12 md:mb-16 border-b border-[var(--line)] pb-10">
            <motion.h2 
              className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-semibold text-[var(--foreground)] leading-none tracking-[-0.06em] mb-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              ABOUT<span className="text-[var(--premium-burgundy)]">.</span>
            </motion.h2>
            <p className="text-lg md:text-2xl text-[var(--text-muted)] font-medium max-w-3xl leading-relaxed">
              Fullstack work, but I also do creative projects.
            </p>
          </div>

          <motion.div 
            className="lg:col-span-7 space-y-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-12 gap-6 md:gap-8 border-y border-[var(--line)] py-8">
              <div className="col-span-2 md:col-span-1">
                <span className="text-[var(--mclaren-red)] text-xl md:text-3xl font-semibold">01</span>
              </div>
              <div className="col-span-10 md:col-span-11 space-y-6">
                <h3 className="text-[var(--premium-burgundy)] font-semibold tracking-[0.2em] text-sm uppercase">Profile</h3>
                <p className="text-2xl md:text-4xl font-semibold text-[var(--foreground)] leading-tight">
                  I build fullstack apps,
                  <span className="text-[var(--mclaren-red)]"> design interfaces</span>, and
                  <span className="text-[var(--premium-burgundy)]"> create visual content</span>.
                </p>
                <p className="text-lg md:text-xl text-[var(--text-muted)] font-normal leading-relaxed max-w-3xl">
                  I study Informatics Engineering at State Polytechnic of Malang. My work blends engineering with creative direction,
                  so the result is functional and still has personality.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 border-y border-[var(--line)] py-8 rounded-xl bg-[var(--surface)]/30 px-4 md:px-6">
              <div className="md:col-span-5 space-y-4">
                <h4 className="text-sm uppercase tracking-[0.2em] font-semibold text-[var(--premium-burgundy)]">Approach</h4>
                <p className="text-2xl md:text-3xl text-[var(--foreground)] leading-tight font-semibold">
                  Build it clean. Make it readable. Give it character.
                </p>
              </div>
              <div className="md:col-span-7 space-y-4 md:pl-8 md:border-l md:border-[var(--line)]">
                <p className="text-lg text-[var(--foreground)] leading-relaxed font-medium">
                  I keep layouts editorial and structured, but still easy for people to use.
                </p>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed font-medium">
                  I care about clear hierarchy, strong visuals, and smooth interactions.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-sm uppercase tracking-[0.2em] font-semibold text-[var(--foreground)]">Connect</h4>
              <div className="flex flex-wrap gap-4">
                {socialProfiles.map((url, index) => (
                  <SocialProfileLink key={index} url={url} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="border border-[var(--line)] p-7 md:p-10 bg-[var(--surface)]/45 rounded-2xl">
              <h3 className="text-[var(--foreground)] font-semibold tracking-[0.26em] text-sm uppercase mb-8">Technical Arsenal</h3>
              <TechStack />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--premium-burgundy)]/50 to-transparent" />
    </section>
  );
}
