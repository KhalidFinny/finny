import type { Experience, Project, Social, Tech } from '@/types/site'

export const TABS = ['Projects', 'Experiences', 'Socials', 'Techs', 'CV'] as const
export type Tab = (typeof TABS)[number]

export type Draft =
  | { kind: 'project'; item: Project; isNew: boolean }
  | { kind: 'experience'; item: Experience; isNew: boolean }
  | { kind: 'social'; item: Social; isNew: boolean }
  | { kind: 'tech'; item: Tech; isNew: boolean }
  | null
