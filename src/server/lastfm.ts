import { createServerFn } from '@tanstack/react-start'
import { getRuntimeEnv } from '@/server/platform'

const CACHE_KEY = 'lastfm-v7'
const CACHE_TTL = 5 * 60 * 1000

// Public account name — also in .dev.vars/.env. Used only when the API key is
// configured but LASTFM_USER was never uploaded as a production secret.
const FALLBACK_USER = 'ffiinnyy'

export interface LastFmItem {
  name: string
  artist: string
  album: string
  image: string
  playCount: number
  nowPlaying: boolean
  previewUrl: string
}

export interface LastFmData {
  nowPlaying: LastFmItem | null
  recent: LastFmItem[]
  topTracks: LastFmItem[]
  artists: LastFmItem[]
  albums: LastFmItem[]
  weeklyArtists: LastFmItem[]
  weeklyTracks: LastFmItem[]
  totalScrobbles: number
  registeredYear: number
  lovedTracks: number
  realName: string
  country: string
  topGenres: string[]
  weeklyArtist: string
  totalArtists: number
  totalAlbums: number
}

interface LastFmRawImage {
  size: string
  '#text': string
}

interface LastFmRawTrack {
  name: string
  artist?: { '#text'?: string }
  album?: { '#text'?: string }
  image?: LastFmRawImage[]
  playcount?: string
  '@attr'?: { nowplaying?: string }
}

interface LastFmRawArtist {
  name: string
  playcount?: string
  image?: LastFmRawImage[]
}

interface LastFmRawAlbum {
  name: string
  artist?: { name?: string }
  playcount?: string
  image?: LastFmRawImage[]
}

interface LastFmRawTag {
  name?: string
  count?: string
}

interface LastFmRawInfo {
  playcount?: string
  registered?: { unixtime?: string }
  realname?: string
  country?: string
}

interface LastFmRawTotal {
  '@attr'?: { total?: string }
}

// cloudflare:workers is a Workers-only virtual module — it cannot be statically
// imported because this file also runs in Node SSR dev where it doesn't exist.
async function getDb() {
  try {
    const cf = await import('cloudflare:workers')
    return cf.env.DB ?? null
  } catch {
    return null
  }
}

async function getEnv(): Promise<{ key: string; user: string } | null> {
  // Workers env first (production) — accepts both secret spellings used on
  // the dashboard. Reuses platform.ts so dev (Node SSR) gets the Wrangler
  // platform proxy, which loads .dev.vars.
  const runtime = await getRuntimeEnv()
  const runtimeKey = runtime?.LASTFM_API_KEY ?? runtime?.LASTFM_KEY
  const runtimeUser = runtime?.LASTFM_USER ?? runtime?.LASTFM_USERNAME
  if (runtimeKey && runtimeUser) return { key: runtimeKey, user: runtimeUser }

  // Vite/process env fallbacks for local runs outside Wrangler's proxy.
  const viteEnv = (import.meta as unknown as { env?: Record<string, string> }).env
  const key = runtimeKey ?? viteEnv?.LASTFM_API_KEY ?? viteEnv?.LASTFM_KEY
  const user = runtimeUser ?? viteEnv?.LASTFM_USER ?? viteEnv?.LASTFM_USERNAME
  if (key && user) return { key, user }
  if (typeof process !== 'undefined' && process.env) {
    const procKey = key ?? process.env.LASTFM_API_KEY ?? process.env.LASTFM_KEY
    const procUser = user ?? process.env.LASTFM_USER ?? process.env.LASTFM_USERNAME
    if (procKey && procUser) return { key: procKey, user: procUser }
  }
  if (key) {
    // API key uploaded as a secret but the username never was — the username
    // is public, so fall back rather than showing the offline panel.
    console.error('[lastfm] LASTFM_USER missing in env — falling back to', FALLBACK_USER)
    return { key, user: FALLBACK_USER }
  }
  console.error('[lastfm] LASTFM_API_KEY missing in env — music feed disabled')
  return null
}

function bestImage(images: LastFmRawImage[]): string {
  for (const size of ['extralarge', 'large', 'medium', 'small'] as const) {
    const found = images.find((image) => image.size === size && image['#text'])
    // Last.fm serves its generic placeholder avatar (hash 2a96cbd8b46e44…) for
    // artists/tracks without artwork — treat it as missing so the Deezer/iTunes
    // backfill below replaces it with real art.
    if (found && !found['#text'].includes('2a96cbd8b46e44')) return found['#text']
  }
  return ''
}

async function fetchJson(
  base: string,
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  const res = await fetch(url.toString(), { headers: { 'User-Agent': 'finny-portfolio' } })
  if (!res.ok) throw new Error('Fetch failed')
  return (await res.json()) as Record<string, unknown>
}

async function getPreviewInfo(
  name: string,
  artist: string,
): Promise<{ preview: string; image: string }> {
  if (!name || !artist) return { preview: '', image: '' }

  // Deezer first — 30s previews + album art via their public search API.
  try {
    const url = new URL('https://api.deezer.com/search')
    url.searchParams.set('q', `track:"${name}" artist:"${artist}"`)
    url.searchParams.set('limit', '1')
    const res = await fetch(url.toString(), { headers: { 'User-Agent': 'finny-portfolio' } })
    if (res.ok) {
      const json = (await res.json()) as {
        data?: Array<{ preview?: string; album?: { cover_medium?: string } }>
        error?: { message?: string }
      }
      if (json.error) throw new Error(json.error.message ?? 'Deezer error')
      const track = json.data?.[0]
      if (track?.preview || track?.album?.cover_medium) {
        return { preview: track?.preview ?? '', image: track?.album?.cover_medium ?? '' }
      }
    }
  } catch {
    // Fall through to iTunes.
  }

  // iTunes fallback — 30s clips + artwork via the public search API.
  try {
    const url = new URL('https://itunes.apple.com/search')
    url.searchParams.set('term', `${artist} ${name}`)
    url.searchParams.set('media', 'music')
    url.searchParams.set('limit', '1')
    const res = await fetch(url.toString(), { headers: { 'User-Agent': 'finny-portfolio' } })
    if (res.ok) {
      const json = (await res.json()) as {
        results?: Array<{ previewUrl?: string; artworkUrl100?: string }>
      }
      const result = json.results?.[0]
      if (result?.previewUrl || result?.artworkUrl100) {
        return { preview: result?.previewUrl ?? '', image: result?.artworkUrl100 ?? '' }
      }
    }
  } catch {
    // Give up.
  }
  return { preview: '', image: '' }
}

async function getArtistImage(name: string): Promise<string> {
  if (!name) return ''
  try {
    const url = new URL('https://api.deezer.com/search/artist')
    url.searchParams.set('q', name)
    url.searchParams.set('limit', '1')
    const res = await fetch(url.toString(), { headers: { 'User-Agent': 'finny-portfolio' } })
    if (!res.ok) return ''
    const json = (await res.json()) as { data?: Array<{ picture_medium?: string }> }
    return json.data?.[0]?.picture_medium ?? ''
  } catch {
    return ''
  }
}

function toItem(track: LastFmRawTrack): LastFmItem {
  return {
    name: track.name,
    artist: track.artist?.['#text'] ?? '',
    album: track.album?.['#text'] ?? '',
    image: bestImage(track.image ?? []),
    playCount: Number(track.playcount ?? 0),
    nowPlaying: track['@attr']?.nowplaying === 'true',
    previewUrl: '',
  }
}

// Last.fm responses are cast once at this boundary to their documented shapes —
// there's no schema library in the project, and the casts are assigned to named
// consts so each access is a plain property read from a typed value.
export const getLastFmData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<LastFmData | null> => {
    const env = await getEnv()
    if (!env) return null

    const db = await getDb()
    let stale: LastFmData | null = null
    if (db) {
      try {
        const row = await db
          .prepare('SELECT value, expires_at FROM cache WHERE key = ?')
          .bind(CACHE_KEY)
          .first<{ value: string; expires_at: number }>()
        if (row) {
          try {
            const parsed = JSON.parse(row.value) as LastFmData
            if (row.expires_at > Date.now()) return parsed
            stale = parsed
          } catch {
            // Corrupt cache — refetch.
          }
        }
      } catch {
        // Cache unavailable (e.g. migrations not applied) — fetch live below.
      }
    }

    try {
      const base = 'https://ws.audioscrobbler.com/2.0/'
      const common = {
        api_key: env.key,
        format: 'json',
        user: env.user,
      }

      const [recentRes, artistsRes, albumsRes, topRes, infoRes, lovedRes, weeklyArtistsRes, weeklyTracksRes] =
        await Promise.all([
          fetchJson(base, { ...common, method: 'user.getrecenttracks', limit: '12' }),
          fetchJson(base, { ...common, method: 'user.gettopartists', limit: '8', period: 'overall' }),
          fetchJson(base, { ...common, method: 'user.gettopalbums', limit: '6', period: 'overall' }),
          fetchJson(base, { ...common, method: 'user.gettoptracks', limit: '8', period: 'overall' }),
          fetchJson(base, { ...common, method: 'user.getinfo' }),
          fetchJson(base, { ...common, method: 'user.getlovedtracks', limit: '1' }),
          fetchJson(base, { ...common, method: 'user.gettopartists', limit: '6', period: '7day' }),
          fetchJson(base, { ...common, method: 'user.gettoptracks', limit: '6', period: '7day' }),
        ])

      const recentTracksRaw = recentRes.recenttracks as { track?: LastFmRawTrack[] } | undefined
      const topTracksRaw = topRes.toptracks as { track?: LastFmRawTrack[] } | undefined
      const weeklyTracksRaw = weeklyTracksRes.toptracks as
        | { track?: LastFmRawTrack[] }
        | undefined
      const artistsRaw = artistsRes.topartists as { artist?: LastFmRawArtist[] } | undefined
      const weeklyArtistsRaw = weeklyArtistsRes.topartists as
        | { artist?: LastFmRawArtist[] }
        | undefined
      const albumsRaw = albumsRes.topalbums as { album?: LastFmRawAlbum[] } | undefined
      const infoRaw = infoRes.user as LastFmRawInfo | undefined
      const lovedRaw = lovedRes.lovedtracks as LastFmRawTotal | undefined
      const artistsTotalRaw = artistsRes.topartists as LastFmRawTotal | undefined
      const albumsTotalRaw = albumsRes.topalbums as LastFmRawTotal | undefined

      const recent = (recentTracksRaw?.track ?? []).map(toItem)
      const topTracks = (topTracksRaw?.track ?? []).map(toItem)
      const weeklyTracks = (weeklyTracksRaw?.track ?? []).map(toItem)
      const artists = (artistsRaw?.artist ?? []).map((artist) => ({
        name: artist.name,
        artist: artist.name,
        album: '',
        image: bestImage(artist.image ?? []),
        playCount: Number(artist.playcount ?? 0),
        nowPlaying: false,
        previewUrl: '',
      }))
      const weeklyArtists = (weeklyArtistsRaw?.artist ?? []).map((artist) => ({
        name: artist.name,
        artist: artist.name,
        album: '',
        image: bestImage(artist.image ?? []),
        playCount: Number(artist.playcount ?? 0),
        nowPlaying: false,
        previewUrl: '',
      }))
      const albums = (albumsRaw?.album ?? []).map((album) => ({
        name: album.name,
        artist: album.artist?.name ?? '',
        album: album.name,
        image: bestImage(album.image ?? []),
        playCount: Number(album.playcount ?? 0),
        nowPlaying: false,
        previewUrl: '',
      }))

      const nowPlaying = recent.find((track) => track.nowPlaying) ?? null
      const totalScrobbles = Number(infoRaw?.playcount ?? 0)
      const registeredYear = new Date(Number(infoRaw?.registered?.unixtime ?? 0) * 1000).getFullYear()
      const lovedTracks = Number(lovedRaw?.['@attr']?.total ?? 0)
      const realName = infoRaw?.realname ?? ''
      const country = infoRaw?.country ?? ''
      const totalArtists = Number(artistsTotalRaw?.['@attr']?.total ?? 0)
      const totalAlbums = Number(albumsTotalRaw?.['@attr']?.total ?? 0)
      const weeklyArtist = weeklyArtists[0]?.name ?? ''

      // Genres from the top artists' tags (user.gettoptags returns nothing for
      // most users, so derive from the artists instead).
      const genreStoplist = new Set([
        'seen live',
        'favorites',
        'favorite artists',
        'similar artists',
        'my playlists',
        'listened',
        'songs',
      ])
      const genreTagResults = await Promise.all(
        artists.slice(0, 5).map((artist) =>
          fetchJson(base, { ...common, method: 'artist.gettoptags', artist: artist.name, autocorrect: '1' }),
        ),
      )
      const genreNames = new Set<string>()
      for (const res of genreTagResults) {
        const tagRaw = res.toptags as { tag?: LastFmRawTag[] } | undefined
        const tag = tagRaw?.tag?.[0]?.name
        if (tag && !genreStoplist.has(tag.toLowerCase())) genreNames.add(tag)
      }
      const topGenres = [...genreNames].slice(0, 5)

      // 30s previews for the playable queue — now playing first, then recent
      // plays, then all-time top tracks (deduped, capped).
      const seenTracks = new Set<string>()
      const queue: LastFmItem[] = []
      for (const track of [nowPlaying, ...recent, ...topTracks]) {
        if (!track) continue
        const key = `${track.artist}|${track.name}`
        if (seenTracks.has(key)) continue
        seenTracks.add(key)
        queue.push(track)
        if (queue.length >= 15) break
      }
      const previewInfos = await Promise.all(
        queue.map((track) => getPreviewInfo(track.name, track.artist)),
      )
      queue.forEach((track, index) => {
        track.previewUrl = previewInfos[index].preview
        if (!track.image) track.image = previewInfos[index].image
      })

      // Backfill missing artist artwork (Last.fm often omits it).
      for (const group of [artists, weeklyArtists]) {
        const missingArtists = group.filter((artist) => !artist.image && artist.name)
        const artistImages = await Promise.all(
          missingArtists.map((artist) => getArtistImage(artist.name)),
        )
        missingArtists.forEach((artist, index) => {
          artist.image = artistImages[index]
        })
      }

      // Weekly tracks aren't in the playback queue — backfill their art too.
      const missingWeeklyTracks = weeklyTracks.filter((track) => !track.image && track.name)
      const weeklyTrackInfos = await Promise.all(
        missingWeeklyTracks.map((track) => getPreviewInfo(track.name, track.artist)),
      )
      missingWeeklyTracks.forEach((track, index) => {
        track.image = weeklyTrackInfos[index].image
      })

      const data: LastFmData = {
        nowPlaying,
        recent,
        topTracks,
        artists,
        albums,
        weeklyArtists,
        weeklyTracks,
        totalScrobbles,
        registeredYear,
        lovedTracks,
        realName,
        country,
        topGenres,
        weeklyArtist,
        totalArtists,
        totalAlbums,
      }

      if (db) {
        try {
          await db
            .prepare('INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)')
            .bind(CACHE_KEY, JSON.stringify(data), Date.now() + CACHE_TTL)
            .run()
        } catch {
          // Cache write failed — still serve the fresh feed.
        }
      }
      return data
    } catch (error) {
      console.error('[lastfm] feed fetch failed', error)
      return stale
    }
  },
)
