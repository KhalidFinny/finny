'use client';

import Image from 'next/image';

interface NavigationProps {
  scrollToSection: (sectionId: string) => void;
}

export default function Navigation({ scrollToSection }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => scrollToSection('home')}
          className="hover:opacity-80 transition-opacity duration-300"
        >
          <Image
            src="/icons/logo.webp"
            alt="Portfolio Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </button>
      </div>
    </nav>
  );
}
