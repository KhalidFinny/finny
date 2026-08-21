export const navItems = [
  { label: 'Overview', to: '/' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Projects', to: '/projects' },
  { label: 'Stats', to: '/stats' },
  { label: 'Music', to: '/music' },
] as const

export type NavPath = (typeof navItems)[number]['to']

export const currentStateLines = [
  { label: 'role', value: 'fullstack intern, still experimenting' },
  { label: 'off-hours', value: 'photo, video, UI studies' },
  { label: 'dream garage', value: 'LS400 / Toyota Crown' },
  { label: 'chasing', value: 'cleaner systems, stronger taste, more character' },
] as const
