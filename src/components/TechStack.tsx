'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faReact,
  faJs,
  faPython,
  faCss3,
  faFigma,
  faAngular,
  faLaravel,
} from '@fortawesome/free-brands-svg-icons';
import { 
  faDatabase,
  faCode,
  faVideo as faVideoSolid,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

interface TechItem {
  name: string;
  icon: IconDefinition;
  category: 'programming' | 'design' | 'video';
}

const programmingTech: TechItem[] = [
  { name: 'React', icon: faReact, category: 'programming' },
  { name: 'JavaScript', icon: faJs, category: 'programming' },
  { name: 'TypeScript', icon: faCode, category: 'programming' },
  { name: 'Next.js', icon: faReact, category: 'programming' },
  { name: 'Tailwind CSS', icon: faCss3, category: 'programming' },
  { name: 'Angular', icon: faAngular, category: 'programming' },
  { name: 'Python', icon: faPython, category: 'programming' },
  { name: 'Astro', icon: faCode, category: 'programming' },
  { name: 'Laravel', icon: faLaravel, category: 'programming' },
  { name: 'PostgreSQL', icon: faDatabase, category: 'programming' },
];

const designTech: TechItem[] = [
  { name: 'Figma', icon: faFigma, category: 'design' },
  { name: 'Photoshop', icon: faImage, category: 'design' },
];

const videoTech: TechItem[] = [
  { name: 'After Effects', icon: faVideoSolid, category: 'video' },
  { name: 'Premiere Pro', icon: faVideoSolid, category: 'video' },
  { name: 'Capcut', icon: faVideoSolid, category: 'video' },
];

interface TechStackProps {
  className?: string;
}

export default function TechStack({ className = '' }: TechStackProps) {
  const sectionClasses = 'space-y-4 border-t border-[var(--line)] pt-6';
  const labelClasses = 'text-base md:text-lg font-semibold text-[var(--foreground)] uppercase tracking-[0.14em]';

  return (
    <div className={`space-y-7 ${className}`}>
      <div className={sectionClasses}>
        <div className="mb-2">
          <h4 className={labelClasses}>Programming</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {programmingTech.map((tech) => (
            <div key={tech.name} className="flex items-center gap-3 py-2 border-b border-white/10">
              <FontAwesomeIcon icon={tech.icon} className="w-4 h-4 text-[var(--mclaren-red)]" />
              <span className="text-base text-[var(--text-muted)] font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClasses}>
        <div className="mb-2">
          <h4 className={labelClasses}>Design & UI/UX</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {designTech.map((tech) => (
            <div key={tech.name} className="flex items-center gap-3 py-2 border-b border-white/10">
              <FontAwesomeIcon icon={tech.icon} className="w-4 h-4 text-[var(--premium-burgundy)]" />
              <span className="text-base text-[var(--text-muted)] font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClasses}>
        <div className="mb-2">
          <h4 className={labelClasses}>Video & Motion</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {videoTech.map((tech) => (
            <div key={tech.name} className="flex items-center gap-3 py-2 border-b border-white/10">
              <FontAwesomeIcon icon={tech.icon} className="w-4 h-4 text-[var(--foreground)]" />
              <span className="text-base text-[var(--text-muted)] font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
