import { useMemo, useRef, useState, type ReactNode } from 'react'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import type { LastFmData, LastFmItem } from '@/server/lastfm'
import FaIcon from '@/components/ui/FaIcon'

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '♪'
}

// Overview-style label chip, placed above each card.
function Sticker({ children }: { children: ReactNode }) {
  return (
    <p className="inline-block rounded-sm bg-paper px-2 py-1 text-sm font-medium uppercase tracking-[0.14em] text-brand ring-1 ring-line">
      {children}
    </p>
  )
}

function Artwork({ src, alt, size }: { src: string; alt: string; size: string }) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center bg-canvas ${size} rounded-[12px] border border-line`}
      >
        <span className="font-serif text-brand/50">{initialOf(alt || '♪')}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${size} shrink-0 object-cover rounded-[12px] border border-line`}
    />
  )
}

function StatTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-2 rounded-[14px] border border-line bg-canvas px-4 py-3.5">
      <dt className="text-sm font-medium uppercase tracking-[0.14em] text-brand">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

function WallTile({
  image,
  title,
  subtitle,
  rank,
}: {
  image: string
  title: string
  subtitle: string
  rank?: number
}) {
  return (
    <li className="group">
      <div className="relative overflow-hidden rounded-[12px] border border-line bg-canvas">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center">
            <span className="font-serif text-4xl leading-none text-brand/40 md:text-5xl">
              {initialOf(title)}
            </span>
          </div>
        )}
        {rank !== undefined && (
          <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink font-mono text-xs tabular-nums text-canvas">
            {rank}
          </span>
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium text-ink">{title}</p>
      <p className="line-clamp-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-graphite">
        {subtitle}
      </p>
    </li>
  )
}

export default function Music({ data }: { data: LastFmData }) {
  const playlist = useMemo(() => {
    const seen = new Set<string>()
    const list: LastFmItem[] = []
    for (const track of [data.nowPlaying, ...(data.recent ?? []), ...(data.topTracks ?? [])]) {
      if (!track?.previewUrl) continue
      const key = `${track.artist}|${track.name}`
      if (seen.has(key)) continue
      seen.add(key)
      list.push(track)
    }
    return list
  }, [data])

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const current = playlist.length > 0 ? playlist[Math.min(index, playlist.length - 1)] : null

  const play = () => {
    if (audioRef.current) void audioRef.current.play()
  }
  const pause = () => audioRef.current?.pause()
  const next = () => {
    if (playlist.length === 0) return
    setIndex((i) => (i + 1) % playlist.length)
  }

  const listeningHours = Math.max(1, Math.round(((data.totalScrobbles ?? 0) * 3.5) / 60))
  const topArtist = data.artists[0]
  const weeklyTopTrack = data.weeklyTracks[0]

  return (
    <section aria-labelledby="music-heading" className="px-4 py-4 md:px-5 md:py-5">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:items-start md:gap-3">
        <div className="contents md:col-span-4 md:flex md:flex-col md:gap-4">
          {/* Compact turntable — art fills the card */}
          <article className="order-1 motion-enter motion-step-3 rounded-[14px] border border-line bg-paper p-4 md:order-none md:p-5">
            <div className="relative overflow-hidden rounded-[14px] border border-line bg-canvas">
              {/* Vinyl disk — circular art that spins while playing */}
              <div className="flex aspect-square w-full items-center justify-center p-6">
                <div className="relative aspect-square w-full max-w-[15rem] rounded-full bg-ink shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
                  {current?.image ? (
                    <img
                      src={current.image}
                      alt=""
                      className={`h-full w-full rounded-full object-cover ${
                        playing ? 'animate-[spin_15s_linear_infinite] motion-reduce:animate-none' : ''
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-canvas">
                      <span className="font-serif text-5xl text-brand/50">
                        {initialOf(current?.name ?? '♪')}
                      </span>
                    </div>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-ink/30 bg-brand"
                  />
                </div>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset ring-line/50"
              />
              <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-canvas">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    playing ? 'animate-pulse bg-rosso' : 'bg-line'
                  }`}
                />
                {playing ? 'Now playing' : current ? 'On the turntable' : 'Idle'}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 font-serif text-xl leading-tight text-ink md:text-2xl">
                  {current?.name ?? 'No playable tracks'}
                </h3>
                {current && (
                  <p className="mt-1 line-clamp-1 text-sm text-graphite md:text-base">
                    {current.artist}
                    {current.album ? ` · ${current.album}` : ''}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={playing ? pause : play}
                disabled={!current}
                aria-label={playing ? 'Pause' : 'Play'}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-transform hover:scale-105 disabled:opacity-40"
              >
                <FaIcon icon={playing ? faPause : faPlay} className="ml-0.5 h-4 w-4" />
              </button>
            </div>

            {current && (
              <audio
                key={index}
                ref={audioRef}
                src={current.previewUrl}
                autoPlay={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={next}
              />
            )}
          </article>

          {/* All time */}
          <section aria-label="All time" className="order-3 motion-enter motion-step-4 md:order-none">
            <Sticker>All time</Sticker>
            <div className="mt-3 rounded-[14px] border border-line bg-paper p-5">
              {topArtist && (
                <div className="flex items-center gap-4">
                  <Artwork src={topArtist.image} alt={topArtist.name} size="h-20 w-20" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                      Top artist · {topArtist.playCount} plays
                    </p>
                    <p className="mt-1 line-clamp-1 font-serif text-2xl leading-tight text-ink md:text-3xl">
                      {topArtist.name}
                    </p>
                  </div>
                </div>
              )}
              {(data.topGenres ?? []).length > 0 && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">Genres</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {(data.topGenres ?? []).map((genre) => (
                      <li
                        key={genre}
                        className="rounded-full border border-line bg-canvas px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-graphite"
                      >
                        {genre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* This week */}
          <section aria-label="This week" className="order-5 motion-enter motion-step-4 md:order-none">
            <Sticker>This week</Sticker>
            <div className="mt-3 rounded-[14px] border border-line bg-paper p-5">
              {weeklyTopTrack && (
                <div className="flex items-center gap-4">
                  <Artwork src={weeklyTopTrack.image} alt={weeklyTopTrack.name} size="h-20 w-20" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                      Top track · {weeklyTopTrack.playCount} plays
                    </p>
                    <p className="mt-1 line-clamp-1 font-serif text-xl leading-tight text-ink md:text-2xl">
                      {weeklyTopTrack.name}
                    </p>
                    <p className="truncate font-mono text-[0.7rem] uppercase tracking-[0.18em] text-graphite">
                      {weeklyTopTrack.artist}
                    </p>
                  </div>
                </div>
              )}
              <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {(data.weeklyArtists ?? []).map((artist, artistIndex) => (
                  <WallTile
                    key={artist.name}
                    image={artist.image}
                    title={artist.name}
                    subtitle={`${artist.playCount} plays`}
                    rank={artistIndex + 1}
                  />
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="contents md:col-span-8 md:flex md:flex-col md:gap-4">
          {/* The numbers */}
          <section aria-label="The numbers" className="order-2 motion-enter motion-step-3 md:order-none">
            <Sticker>The numbers</Sticker>
            <div className="mt-3 rounded-[14px] border border-line bg-paper p-5">
              <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <StatTile label="Scrobbles">
                  <span className="text-2xl font-medium leading-none text-ink md:text-3xl">
                    {data.totalScrobbles ?? 0}
                  </span>
                </StatTile>
                <StatTile label="Listening">
                  <span className="text-2xl font-medium leading-none text-ink md:text-3xl">
                    {listeningHours}h
                  </span>
                </StatTile>
                <StatTile label="Loved">
                  <span className="text-2xl font-medium leading-none text-ink md:text-3xl">
                    {data.lovedTracks ?? 0}
                  </span>
                </StatTile>
                <StatTile label="Artists">
                  <span className="text-2xl font-medium leading-none text-ink md:text-3xl">
                    {data.totalArtists ?? 0}
                  </span>
                </StatTile>
                <StatTile label="Albums">
                  <span className="text-2xl font-medium leading-none text-ink md:text-3xl">
                    {data.totalAlbums ?? 0}
                  </span>
                </StatTile>
                <StatTile label="Since">
                  <span className="text-2xl font-medium leading-none text-ink md:text-3xl">
                    {data.registeredYear || '—'}
                  </span>
                </StatTile>
              </dl>
            </div>
          </section>

          {/* Album wall */}
          <section aria-label="Album wall" className="order-4 motion-enter motion-step-4 md:order-none">
            <Sticker>Album wall</Sticker>
            <div className="mt-3 rounded-[14px] border border-line bg-paper p-5">
              <ul className="grid grid-cols-3 gap-3">
                {(data.albums ?? []).map((album) => (
                  <WallTile
                    key={`${album.artist}-${album.name}`}
                    image={album.image}
                    title={album.name}
                    subtitle={`${album.artist} · ${album.playCount} plays`}
                  />
                ))}
              </ul>
            </div>
          </section>

          {/* Artist wall */}
          <section aria-label="Artist wall" className="order-6 motion-enter motion-step-4 md:order-none">
            <Sticker>Artist wall</Sticker>
            <div className="mt-3 rounded-[14px] border border-line bg-paper p-5">
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {(data.artists ?? []).map((artist, artistIndex) => (
                  <WallTile
                    key={artist.name}
                    image={artist.image}
                    title={artist.name}
                    subtitle={`${artist.playCount} plays`}
                    rank={artistIndex + 1}
                  />
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Track wall */}
        <section
          aria-label="Track wall"
          className="order-7 motion-enter motion-step-5 md:order-none md:col-span-12"
        >
          <Sticker>Track wall</Sticker>
          <div className="mt-3 rounded-[14px] border border-line bg-paper p-5">
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-8">
              {(data.topTracks ?? []).map((track, trackIndex) => (
                <WallTile
                  key={`${track.artist}-${track.name}`}
                  image={track.image}
                  title={track.name}
                  subtitle={`${track.artist} · ${track.playCount} plays`}
                  rank={trackIndex + 1}
                />
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  )
}
