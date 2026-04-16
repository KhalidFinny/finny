import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NavigationProps {
  scrollToSection: (sectionId: string) => void;
}

export default function Navigation({ scrollToSection }: NavigationProps) {
  const [activeSection, setActiveSection] = useState<string>('home');

  const navItems = [
    { id: 'home', label: 'HOME', number: '01' },
    { id: 'about', label: 'ABOUT', number: '02' },
    { id: 'experience', label: 'EXP', number: '03' },
    { id: 'portfolio', label: 'WORK', number: '04' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Find the currently active section
      // Add a small offset (e.g., window.innerHeight / 3) to trigger earlier
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const item of [...navItems].reverse()) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="hidden md:block">
        <motion.div
          className="fixed left-8 lg:left-10 top-8 lg:top-10 pointer-events-auto flex flex-col items-center"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <button onClick={() => scrollToSection('home')} className="cursor-pointer">
            <img
              src="/icons/logo.webp"
              alt="Khalid logo"
              className="w-12 h-12 lg:w-14 lg:h-14 object-cover"
            />
          </button>
          <div className="w-px h-14 bg-[var(--line)] mt-4 mb-4" />
          <span className="text-[var(--foreground)] font-semibold text-xs tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
            KHALID
          </span>
          <a
            href="/CV%20-%20Muhammad%20Khalid%20Atthoriq%20-%20Politeknik%20Negeri%20Malang.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 text-[10px] tracking-[0.22em] font-semibold text-[var(--text-muted)] hover:text-[var(--premium-burgundy)] transition-colors [writing-mode:vertical-rl] rotate-180"
          >
            CV
          </a>
        </motion.div>

        <motion.div
          className="fixed right-8 lg:right-10 top-8 lg:top-10 pointer-events-auto flex flex-col items-end gap-5"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group flex items-center gap-3 transition-all duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'text-[var(--mclaren-red)] -translate-x-2' : 'text-[var(--foreground)] hover:text-[var(--mclaren-red)]'
                }`}
              >
                <div className={`h-px bg-[var(--mclaren-red)] transition-all duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'
                }`} />
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold tracking-[0.2em] transition-colors duration-500 ${
                    isActive ? 'text-[var(--mclaren-red)]' : 'text-[var(--text-muted)] group-hover:text-[var(--mclaren-red)]'
                  }`}>
                    {item.number}
                  </span>
                  <span className="text-sm lg:text-base font-semibold tracking-[0.18em] pb-0.5 relative overflow-hidden">
                    {item.label}
                    <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--mclaren-red)] origin-right transition-transform duration-500 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </span>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

      <div className="md:hidden p-4">
        <motion.div
          className="pointer-events-auto flex items-center justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2">
            <img src="/icons/logo.webp" alt="Khalid logo" className="w-10 h-10 object-cover" />
            <span className="text-[var(--foreground)] text-xs font-semibold tracking-[0.18em]">KHALID</span>
          </button>
          <a
            href="/CV%20-%20Muhammad%20Khalid%20Atthoriq%20-%20Politeknik%20Negeri%20Malang.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold tracking-[0.14em] text-[var(--foreground)] border-b border-[var(--line)] pb-1"
          >
            CV
          </a>
        </motion.div>
      </div>
    </nav>
  );
}
