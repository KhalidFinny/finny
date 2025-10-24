'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  icon: {
    iconName: string;
    prefix: string;
    icon: [number, number, string[], string, string];
  };
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
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Programming */}
      <div>
        <div className="mb-6">
          <h4 className="text-lg md:text-xl font-light text-white mb-2 tracking-wide uppercase">Programming</h4>
          <div className="w-12 h-0.5 bg-red-400 mb-4"></div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {programmingTech.map((tech) => (
            <div key={tech.name} className="flex items-center space-x-1 sm:space-x-2 bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 hover:border-red-400/50 transition-colors group smooth-transition hover-lift">
              <FontAwesomeIcon icon={tech.icon} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
              <span className="text-gray-300 text-xs sm:text-sm lg:text-base font-light group-hover:text-white">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Design */}
      <div>
        <div className="mb-6">
          <h4 className="text-lg md:text-xl font-light text-white mb-2 tracking-wide uppercase">Design & UI/UX</h4>
          <div className="w-12 h-0.5 bg-red-400 mb-4"></div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {designTech.map((tech) => (
            <div key={tech.name} className="flex items-center space-x-1 sm:space-x-2 bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 hover:border-red-400/50 transition-colors group smooth-transition hover-lift">
              <FontAwesomeIcon icon={tech.icon} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
              <span className="text-gray-300 text-xs sm:text-sm lg:text-base font-light group-hover:text-white">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video & Motion */}
      <div>
        <div className="mb-6">
          <h4 className="text-lg md:text-xl font-light text-white mb-2 tracking-wide uppercase">Video & Motion</h4>
          <div className="w-12 h-0.5 bg-red-400 mb-4"></div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {videoTech.map((tech) => (
            <div key={tech.name} className="flex items-center space-x-1 sm:space-x-2 bg-gray-800/50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-700 hover:border-red-400/50 transition-colors group smooth-transition hover-lift">
              <FontAwesomeIcon icon={tech.icon} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white" />
              <span className="text-gray-300 text-xs sm:text-sm lg:text-base font-light group-hover:text-white">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
