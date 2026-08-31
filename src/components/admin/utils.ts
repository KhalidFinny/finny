import type { Experience, Project, Social, Tech } from '@/types/site'

export function bulletsToJson(text: string): string {
  return JSON.stringify(
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  )
}

export function jsonToBullets(value?: string | null): string {
  if (!value) return ''

  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string').join('\n')
      : value
  } catch {
    return value
  }
}

export function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>()
  const reader = new FileReader()

  reader.onerror = () => reject(reader.error ?? new Error('Failed to read image'))
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      reject(new Error('Failed to read image'))
      return
    }
    resolve(reader.result)
  }
  reader.readAsDataURL(file)

  return await promise
}

const PROJECT_ID_PREFIX: Record<string, string> = {
  programming: 'prog',
  'ui-ux': 'ui',
  videography: 'vid',
  photography: 'photo',
}

/** Next project id for a category — per-category sequence, e.g. prog4 / ui6. */
export function createProjectId(
  projects: Pick<Project, 'category_id'>[],
  categoryId: string,
): string {
  const prefix = PROJECT_ID_PREFIX[categoryId] ?? categoryId
  const count = projects.filter((project) => project.category_id === categoryId).length
  return `${prefix}${count + 1}`
}

export function createEmptyProject(
  projects: Pick<Project, 'category_id'>[],
  categoryId: string,
): Project {
  return {
    id: createProjectId(projects, categoryId),
    category_id: categoryId,
    title: '',
    role: '',
    stack: '',
    year: '',
    status: 'done',
    image: '',
    description: '',
    youtube_embed: null,
    instagram_link: null,
    google_drive_link: null,
    link: null,
    source_link: null,
    gallery: null,
    sort_order: projects.length,
  }
}

export function createEmptyExperience(count: number): Experience {
  return {
    id: `exp${count + 1}`,
    role: '',
    company: '',
    location: '',
    period: '',
    description: '[]',
    type: 'work',
    sort_order: count,
  }
}

export function createEmptySocial(nextId: number, count: number): Social {
  return {
    id: nextId,
    url: '',
    sort_order: count,
  }
}

export function createEmptyTech(nextId: number, count: number): Tech {
  return {
    id: nextId,
    name: '',
    category: 'programming',
    sort_order: count,
  }
}
