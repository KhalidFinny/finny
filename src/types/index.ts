export interface Project {
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  liveDemo: string;
  github: string;
  variant: 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'indigo';
}

export interface Skill {
  name: string;
  percentage: number;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  gradient: string;
}
