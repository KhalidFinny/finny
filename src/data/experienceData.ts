export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  type: 'work' | 'education' | 'organization';
}

export const experiences: ExperienceItem[] = [
  {
    id: 'exp1',
    role: 'Fullstack Web Developer Internship',
    company: 'PT Surabaya Autocomp Indonesia',
    location: 'Ngoro, Indonesia',
    period: 'January 2026 — Present',
    description: [
      'Developed a simulator to efficiency in production preparation.',
      'Optimized website performance to ensure users work smoothly in preparing mass production documents.',
      'Optimized workers workflow in automating documents generation.'
    ],
    type: 'work'
  },
  {
    id: 'exp2',
    role: 'Freelance Web Developer & UI/UX Designer',
    company: 'Self-Employed',
    location: 'Malang, Indonesia',
    period: 'February 2024 — February 2026',
    description: [
      'Developed and launched responsive client websites praised for clarity, speed, and strong brand alignment.',
      'Optimized front-end performance and accessibility, improving user satisfaction and SEO visibility.',
      'Delivered a food security system recognized for its reliability and ease of data handling.'
    ],
    type: 'work'
  },
  {
    id: 'exp3',
    role: 'UI/UX Designer Internship',
    company: 'PT Molca Teknologi Nusantara',
    location: 'Surabaya, Indonesia',
    period: 'August 2025 — October 2025',
    description: [
      'Created Digital Twin dashboards that enhanced monitoring flow and simplified industrial decision-making.',
      'Collaborated closely with developers to refine design consistency, building a unified system.'
    ],
    type: 'work'
  },
  {
    id: 'exp4',
    role: 'Creative Team Lead',
    company: 'Workshop Riset Informatika',
    location: 'Malang, Indonesia',
    period: 'February 2024 — February 2026',
    description: [
      'Led the creative division to build a unified and professional brand identity across WRI’s platforms.',
      'Developed an adaptable content framework that encouraged consistent output and team collaboration.',
      'Produced and directed video campaigns well-received for storytelling and visual quality.'
    ],
    type: 'organization'
  },
  {
    id: 'exp5',
    role: 'Informatics Engineering (BAS)',
    company: 'Politeknik Negeri Malang',
    location: 'Malang, Indonesia',
    period: 'August 2023 — Present',
    description: [
      'Focusing on Applied Informatics with a cumulative GPA of 3.7/4.0.',
      'Engaging in various software development projects and research workshops.'
    ],
    type: 'education'
  }
];
