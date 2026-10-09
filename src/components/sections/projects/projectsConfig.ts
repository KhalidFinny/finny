export const PROJECTS_TABS = [
  { id: 'programming', label: 'Programming' },
  { id: 'creative', label: 'Creative' },
] as const

export type ProjectsTabId = (typeof PROJECTS_TABS)[number]['id']
export type ProjectsViewId = 'photo' | 'video'

const CATEGORY_LABELS: Record<string, string> = {
  programming: 'Programming',
  'ui-ux': 'UI/UX',
  videography: 'Videography',
  photography: 'Photography',
}

export function categoryLabel(categoryId: string): string {
  return CATEGORY_LABELS[categoryId] ?? categoryId
}

/** "Typescript | React Vite | Tailwind" -> ["Typescript", "React Vite", "Tailwind"] */
export function stackTags(stack?: string | null): string[] {
  return (stack ?? '')
    .split(/[|·,]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}
