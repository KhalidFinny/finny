export const navItems = [
  { label: 'Overview', to: '/' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Projects', to: '/projects' },
  { label: 'Stats', to: '/stats' },
  { label: 'Music', to: '/music' },
] as const

export type NavPath = (typeof navItems)[number]['to']

