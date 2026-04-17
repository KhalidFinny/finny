import { motion } from "framer-motion";

interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center relative px-4 md:px-12 lg:px-32 overflow-hidden pt-16 md:pt-24"
    >
      <div className="absolute inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-12 gap-4 px-4 md:px-12 lg:px-32 opacity-[0.2]">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-x border-[var(--line)]/40 h-full" />
        ))}
      </div>

      <div className="absolute top-20 -left-32 w-64 h-64 md:w-[28rem] md:h-[28rem] paint-blob bg-[var(--mclaren-red)]/8 pointer-events-none" />
      <div className="absolute bottom-8 -right-32 w-64 h-64 md:w-[28rem] md:h-[28rem] paint-blob bg-[var(--premium-burgundy)]/8 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-hidden opacity-30">
        <span className="text-[36vw] md:text-[28vw] lg:text-[22vw] font-bold tracking-[-0.12em] text-[var(--line)] leading-none">
          KH
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col items-center text-center">
          <motion.span
            className="text-[10px] font-medium uppercase tracking-[0.45em] text-[var(--premium-burgundy)] mb-8 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            FULLSTACK CREATIVE DEVELOPER
          </motion.span>

          <motion.h1
            className="relative text-[4.5rem] sm:text-[7.5rem] md:text-[11rem] lg:text-[14rem] font-semibold text-[var(--foreground)] leading-[0.72] tracking-[-0.1em] animate-hero-reveal"
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            <span className="block">KHALID</span>
            <span
              className="block text-[2rem] sm:text-[3.2rem] md:text-[4.8rem] lg:text-[5.8rem] tracking-[0.35em] text-transparent mt-2 md:mt-4"
              style={{ WebkitTextStroke: '1.5px var(--mclaren-red)' }}
            >
              ATTHORIQ
            </span>
          </motion.h1>

          <motion.div
            className="w-40 md:w-56 h-px bg-[var(--mclaren-red)] mt-10 md:mt-16 mb-8 md:mb-12"
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          />

          <motion.h2
            className="text-base md:text-xl lg:text-2xl font-normal text-[var(--text-muted)] leading-relaxed max-w-2xl px-4 md:px-0"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            Fullstack developer who also does creative work.
            I build products that feel clear, strong, and memorable.
          </motion.h2>

          <motion.div
            className="flex flex-row items-center gap-8 md:gap-14 mt-12 md:mt-20"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <button
              onClick={() => scrollToSection('portfolio')}
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-1 hover:border-[var(--mclaren-red)] transition-colors"
            >
              <span className="text-[var(--foreground)] font-medium tracking-[0.2em] text-xs md:text-sm">
                VIEW PROJECTS
              </span>
              <span className="text-[var(--mclaren-red)] group-hover:translate-x-1.5 transition-transform">→</span>
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-1 hover:border-[var(--premium-burgundy)] transition-colors"
            >
              <span className="text-[var(--foreground)] font-medium tracking-[0.2em] text-xs md:text-sm">
                ABOUT
              </span>
              <span className="text-[var(--premium-burgundy)] group-hover:translate-x-1.5 transition-transform">→</span>
            </button>

            <a
              href="/CV%20-%20Muhammad%20Khalid%20Atthoriq%20-%20Politeknik%20Negeri%20Malang.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 border-b border-[var(--line)] pb-1 hover:border-[var(--mclaren-red)] transition-colors"
            >
              <span className="text-[var(--foreground)] font-medium tracking-[0.2em] text-xs md:text-sm">
                CV
              </span>
              <span className="text-[var(--mclaren-red)] group-hover:translate-x-1 transition-transform">↗</span>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:block absolute left-20 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-muted)] [writing-mode:vertical-rl] rotate-180">
          SWISS EDITORIAL / 2026
        </div>
      </div>

      <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-muted)] [writing-mode:vertical-rl] rotate-180">
          MALANG / INDONESIA
        </div>
      </div>
    </section>
  );
}
