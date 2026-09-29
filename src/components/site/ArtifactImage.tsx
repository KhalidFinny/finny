import { useState } from 'react'

export default function ArtifactImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center border border-line bg-paper">
        <span className="text-sm font-medium text-graphite">artifact missing</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className ?? ''}`}
    />
  )
}
