import type { Experience as ExperienceItem, Project, Tech } from '@/types/site'

export default function Ticker({
  experiences,
  projects,
  techs,
}: {
  experiences: ExperienceItem[]
  projects: Project[]
  techs: Tech[]
}) {
  const segments = [
    'The Lab',
    'Khalid Atthoriq',
    `${experiences.length} records on file`,
    `${projects.length} projects built`,
    `${techs.length} techs in the stack`,
    'Malang, ID',
    'Est. 2024',
    'Tuned like an LS400',
  ] as const

  return (
    <footer aria-hidden="true" className="shrink-0 overflow-hidden border-t border-line bg-paper">
      <div className="flex w-max animate-[ticker-scroll_45s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center py-3">
            {segments.map((segment) => (
              <li
                key={`${copy}-${segment}`}
                className="flex items-center gap-6 pr-6 font-mono text-xs uppercase tracking-[0.25em] text-graphite md:text-sm"
              >
                <span>{segment}</span>
                <span className="h-1 w-1 rounded-full bg-rosso" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </footer>
  )
}
