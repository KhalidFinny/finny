import { createServerFn } from '@tanstack/react-start'

// Photography lives on photoby (photoby.fiinnyy.my.id). finny reads the same
// gallery so a photograph is uploaded once and appears on both sites. The fetch
// is server-side, so there is no CORS to negotiate.
const PHOTOBY_ORIGIN = 'https://photoby.fiinnyy.my.id'
const FETCH_TIMEOUT_MS = 4000

export type PhotobyCategory = 'people' | 'events' | 'streets' | 'cars' | 'nature'

// The display order and names match photoby's studio, so the same grouping
// reads the same on both sites.
export const PHOTOBY_CATEGORY_ORDER: readonly PhotobyCategory[] = [
  'people',
  'events',
  'streets',
  'cars',
  'nature',
]

export const PHOTOBY_CATEGORY_LABELS: Record<PhotobyCategory, string> = {
  people: 'People',
  events: 'Events',
  streets: 'Streets',
  cars: 'Cars',
  nature: 'Nature',
}

export interface PhotobyPhoto {
  id: string
  category: PhotobyCategory
  caption: string | null
  width: number | null
  height: number | null
  createdAt: number
  /** Absolute URL on photoby, ready to render in an <img>. */
  src: string
}

const CATEGORIES: readonly PhotobyCategory[] = ['people', 'events', 'streets', 'cars', 'nature']

function parsePhoto(value: unknown): PhotobyPhoto | null {
  if (typeof value !== 'object' || value === null) return null
  const photo = value as Record<string, unknown>
  if (typeof photo.id !== 'string' || typeof photo.src !== 'string') return null

  const category = CATEGORIES.includes(photo.category as PhotobyCategory)
    ? (photo.category as PhotobyCategory)
    : 'nature'

  return {
    id: photo.id,
    category,
    caption: typeof photo.caption === 'string' ? photo.caption : null,
    width: typeof photo.width === 'number' ? photo.width : null,
    height: typeof photo.height === 'number' ? photo.height : null,
    createdAt: typeof photo.createdAt === 'number' ? photo.createdAt : 0,
    src: `${PHOTOBY_ORIGIN}${photo.src}`,
  }
}

// Network boundary: a slow or failing photoby must not hold up the page, so the
// request is time-boxed and any failure yields an empty list.
export const getPhotobyPhotos = createServerFn({ method: 'GET' }).handler(
  async (): Promise<PhotobyPhoto[]> => {
    try {
      const response = await fetch(`${PHOTOBY_ORIGIN}/api/gallery`, {
        headers: { 'User-Agent': 'finny-portfolio' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
      if (!response.ok) return []

      const json = (await response.json()) as { data?: { photos?: unknown } }
      const photos = json.data?.photos
      if (!Array.isArray(photos)) return []

      return photos
        .map(parsePhoto)
        .filter((photo): photo is PhotobyPhoto => photo !== null)
    } catch {
      return []
    }
  },
)
