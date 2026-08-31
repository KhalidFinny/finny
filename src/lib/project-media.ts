import type { Project } from '@/types/site'

export function parseGallery(gallery?: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(gallery ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : []
  } catch {
    return []
  }
}

export function getProjectShots(project: Project): string[] {
  const gallery = parseGallery(project.gallery)
  return project.image ? [project.image, ...gallery] : gallery
}
