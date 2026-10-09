import { useMemo, useRef, useState } from 'react'
import {
  faCalendar,
  faClock,
  faCompactDisc,
  faHeart,
  faMicrophoneLines,
  faPause,
  faPlay,
  faRecordVinyl,
} from '@fortawesome/free-solid-svg-icons'
import type { LastFmData, LastFmItem } from '@/server/lastfm'
import FaIcon from '@/components/ui/FaIcon'
import {
  Artwork,
  StatTile,
  Sticker,
  WallTile,
  initialOf,
  listeningHours,
} from '@/components/sections/music/musicParts'

// The music page: the turntable and player on top (with the current record and
// the numbers beside it), then the shelf below — albums, artists, tracks.
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
  const featured = data.nowPlaying ?? data.recent[0] ?? current ?? null

  const play = () => {
    if (audioRef.current) void audioRef.current.play()
  }
  const pause = () => audioRef.current?.pause()
  const next = () => {
    if (playlist.length === 0) return
    setIndex((i) => (i + 1) % playlist.length)
  }

  const statusLabel = playing ? 'Now playing' : current ? 'On the turntable' : 'Idle'

  return (
    <section aria-labelledby="music-heading" className="px-4 py-6 md:px-6">
      <h2 id="music-heading" className="sr-only">
        Music
      </h2>

      <div className="grid gap-6 xl:grid-cols-12 xl:items-start">
        {/* Turntable + player */}
        <div className="flex flex-col gap-4 xl:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Sticker>On the turntable</Sticker>
            <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${playing ? 'animate-pulse bg-rosso' : 'bg-line'}`}
              />
              {statusLabel}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative aspect-square w-full max-w-[22rem] rounded-full bg-ink">
              {current?.image ? (
                <img
                  src={current.image}
                  alt=""
                  className={`h-full w-full rounded-full object-cover ${
                    playing ? 'animate-[spin_15s_linear_infinite] motion-reduce:animate-none' : ''
                  }`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-paper">
                  <span className="font-serif text-6xl text-brand/50">
                    {initialOf(current?.name ?? featured?.name ?? '♪')}
                  </span>
                </div>
              )}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-ink/30 bg-brand"
              />
            </div>
          </div>

          <article className="motion-enter motion-step-3 rounded-[14px] border border-line bg-paper p-4 md:p-5">
            <div className="flex items-center gap-4">
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
        </div>

        {/* Current record + the numbers */}
        <div className="flex flex-col gap-4 xl:col-span-7">
          {featured && (
            <div className="motion-enter motion-step-2 flex items-center gap-4 rounded-[14px] border border-line bg-paper p-4 md:p-5">
              <Artwork src={featured.image} alt={featured.name} size="h-20 w-20 md:h-24 md:w-24" />
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-graphite">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${data.nowPlaying ? 'animate-pulse bg-rosso' : 'bg-line'}`}
                  />
                  {data.nowPlaying ? 'Now playing' : 'Last played'}
                </p>
                <p className="mt-2 line-clamp-2 font-serif text-2xl leading-tight text-ink md:text-3xl">
                  {featured.name}
                </p>
                <p className="mt-1 line-clamp-1 text-base text-graphite">
                  {featured.artist}
                  {featured.album ? ` · ${featured.album}` : ''}
                </p>
              </div>
            </div>
          )}

          <section aria-label="The numbers" className="motion-enter motion-step-3">
            <Sticker>The numbers</Sticker>
            <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <StatTile label="Scrobbles" icon={faCompactDisc}>
                {data.totalScrobbles}
              </StatTile>
              <StatTile label="Listening" icon={faClock}>
                {listeningHours(data.totalScrobbles)}h
              </StatTile>
              <StatTile label="Loved" icon={faHeart}>
                {data.lovedTracks}
              </StatTile>
              <StatTile label="Artists" icon={faMicrophoneLines}>
                {data.totalArtists}
              </StatTile>
              <StatTile label="Albums" icon={faRecordVinyl}>
                {data.totalAlbums}
              </StatTile>
              <StatTile label="Since" icon={faCalendar}>
                {data.registeredYear || '—'}
              </StatTile>
            </dl>
          </section>

          {data.topGenres.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {data.topGenres.map((genre) => (
                <li
                  key={genre}
                  className="rounded-full border border-line bg-canvas px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] text-graphite"
                >
                  {genre}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Shelf */}
      {data.albums.length > 0 && (
        <section aria-label="Albums" className="motion-enter motion-step-4 mt-8">
          <Sticker>Albums</Sticker>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {data.albums.map((album) => (
              <WallTile
                key={`${album.artist}-${album.name}`}
                image={album.image}
                title={album.name}
                subtitle={album.artist}
              />
            ))}
          </ul>
        </section>
      )}

      {data.artists.length > 0 && (
        <section aria-label="Artists" className="motion-enter motion-step-4 mt-8">
          <Sticker>Artists</Sticker>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {data.artists.map((artist, artistIndex) => (
              <WallTile
                key={artist.name}
                image={artist.image}
                title={artist.name}
                subtitle={`${artist.playCount} plays`}
                rank={artistIndex + 1}
              />
            ))}
          </ul>
        </section>
      )}

      {data.topTracks.length > 0 && (
        <section aria-label="Tracks" className="motion-enter motion-step-5 mt-8">
          <Sticker>Tracks</Sticker>
          <ul className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {data.topTracks.map((track, trackIndex) => (
              <WallTile
                key={`${track.artist}-${track.name}`}
                image={track.image}
                title={track.name}
                subtitle={track.artist}
                rank={trackIndex + 1}
              />
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
