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

/** `/media/projects/abc.webp` → `/media/projects/abc-thumb.webp` (grid variant). */
export function thumbPathFor(path: string): string {
  const dot = path.lastIndexOf('.')
  return dot > 0 ? `${path.slice(0, dot)}-thumb${path.slice(dot)}` : path
}

/** Grid cover — the -thumb variant for R2 media, the original for public files. */
export function coverSrcFor(path?: string | null): string {
  return path && path.startsWith('/media/') ? thumbPathFor(path) : path ?? ''
}
