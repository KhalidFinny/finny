'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub, 
  faLinkedin, 
  faTwitter, 
  faInstagram, 
  faYoutube, 
  faBehance, 
  faDribbble,
  faFigma,
  faDiscord,
  faMedium,
  faDev,
  faCodepen
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

interface SocialProfileLinkProps {
  url: string;
  label?: string;
  className?: string;
}

export default function SocialProfileLink({ url, label, className = '' }: SocialProfileLinkProps) {
  // Auto-detect platform from URL
  const getIconAndColor = (url: string) => {
    const domain = url.toLowerCase();
    
    if (domain.includes('github.com')) {
      return { icon: faGithub, color: 'hover:text-white', bgColor: 'bg-gray-700 hover:bg-gray-600' };
    }
    if (domain.includes('linkedin.com')) {
      return { icon: faLinkedin, color: 'hover:text-white', bgColor: 'bg-blue-700 hover:bg-blue-600' };
    }
    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return { icon: faTwitter, color: 'hover:text-white', bgColor: 'bg-blue-500 hover:bg-blue-400' };
    }
    if (domain.includes('instagram.com')) {
      return { icon: faInstagram, color: 'hover:text-white', bgColor: 'bg-pink-600 hover:bg-pink-500' };
    }
    if (domain.includes('youtube.com')) {
      return { icon: faYoutube, color: 'hover:text-white', bgColor: 'bg-red-600 hover:bg-red-500' };
    }
    if (domain.includes('behance.net')) {
      return { icon: faBehance, color: 'hover:text-white', bgColor: 'bg-blue-600 hover:bg-blue-500' };
    }
    if (domain.includes('dribbble.com')) {
      return { icon: faDribbble, color: 'hover:text-white', bgColor: 'bg-pink-500 hover:bg-pink-400' };
    }
    if (domain.includes('figma.com')) {
      return { icon: faFigma, color: 'hover:text-white', bgColor: 'bg-purple-600 hover:bg-purple-500' };
    }
    if (domain.includes('discord.com')) {
      return { icon: faDiscord, color: 'hover:text-white', bgColor: 'bg-indigo-600 hover:bg-indigo-500' };
    }
    if (domain.includes('medium.com')) {
      return { icon: faMedium, color: 'hover:text-white', bgColor: 'bg-gray-600 hover:bg-gray-500' };
    }
    if (domain.includes('dev.to')) {
      return { icon: faDev, color: 'hover:text-white', bgColor: 'bg-green-600 hover:bg-green-500' };
    }
    if (domain.includes('codepen.io')) {
      return { icon: faCodepen, color: 'hover:text-white', bgColor: 'bg-gray-800 hover:bg-gray-700' };
    }
    
    // Default for unknown platforms
    return { icon: faGlobe, color: 'hover:text-white', bgColor: 'bg-gray-700 hover:bg-gray-600' };
  };

  const { icon, bgColor } = getIconAndColor(url);
  const displayLabel = label || url.split('/').pop()?.replace('.com', '') || 'Profile';

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 ${className}`}
      title={displayLabel}
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
    </a>
  );
}
