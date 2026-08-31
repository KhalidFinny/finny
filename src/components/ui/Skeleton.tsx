export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-reveal rounded-[14px] border border-line bg-canvas ${className}`}
    />
  )
}
