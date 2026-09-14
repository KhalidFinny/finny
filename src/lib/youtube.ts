export function parseYouTubeId(input: string): string | null {
  const value = input.trim()
  const patterns = [
    /youtube\.com\/watch\?(?:.*[?&])?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/(?:embed|shorts|live)\/([\w-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}`
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}

export function youtubeThumbUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
}

export interface YouTubeMetadata {
  title: string
  thumbnail: string
}

/** Resolve a YouTube share/watch/embed URL into its title via oEmbed. */
export async function fetchYouTubeMetadata(id: string): Promise<YouTubeMetadata> {
  const watchUrl = youtubeWatchUrl(id)
  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
  )
  if (!response.ok) throw new Error('YouTube metadata unavailable for this video')
  const data = (await response.json()) as { title?: string }
  return {
    title: data.title?.trim() ?? '',
    thumbnail: youtubeThumbUrl(id),
  }
}