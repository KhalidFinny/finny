import { getRuntimeEnv } from '@/server/platform'

const MEDIA_PREFIX = '/media/'

type ProjectMediaShape = {
  image?: string | null
  gallery?: string | null
}

export async function getMediaBucket(): Promise<R2Bucket | null> {
  const env = await getRuntimeEnv()
  return env?.MEDIA ?? null
}

export function mediaKeyToPath(key: string): string {
  // Upload keys are constructed from safe characters (alphanumerics, dashes,
  // dots, one slash) — no encoding needed, and %2F in a path invites
  // double-decoding across servers, edges, and browsers.
  return `${MEDIA_PREFIX}${key}`
}

export function mediaPathToKey(path?: string | null): string | null {
  if (!path || !path.startsWith(MEDIA_PREFIX)) return null
  const key = path.slice(MEDIA_PREFIX.length)
  if (!key) return null
  // Tolerate both clean paths and legacy %2F-encoded ones
  try {
    return decodeURIComponent(key)
  } catch {
    return key
  }
}

function parseGallery(gallery?: string | null): string[] {
  if (!gallery) return []

  try {
    const parsed: unknown = JSON.parse(gallery)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function collectProjectMediaKeys(project: ProjectMediaShape): string[] {
  const keys = new Set<string>()

  const heroKey = mediaPathToKey(project.image)
  if (heroKey) keys.add(heroKey)

  for (const path of parseGallery(project.gallery)) {
    const key = mediaPathToKey(path)
    if (key) keys.add(key)
  }

  return [...keys]
}
