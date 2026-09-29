import type { IconDefinition } from '@fortawesome/fontawesome-common-types'

export default function FaIcon({
  icon,
  className,
  style,
}: {
  icon: IconDefinition
  className?: string
  style?: React.CSSProperties
}) {
  const [width, height, , , path] = icon.icon
  const paths = Array.isArray(path) ? path : [path]
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {paths.map((d, index) => (
        <path key={index} d={d} fill="currentColor" />
      ))}
    </svg>
  )
}
