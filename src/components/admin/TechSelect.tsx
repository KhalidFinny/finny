import { useEffect, useId, useRef, useState } from 'react'
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import FaIcon from '@/components/ui/FaIcon'
import { inputCls } from '@/components/admin/styles'

const SEPARATOR = ' | '

interface TechSelectProps {
  value: string
  onChange: (value: string) => void
  techs: string[]
  disabled?: boolean
}

export default function TechSelect({
  value,
  onChange,
  techs,
  disabled = false,
}: TechSelectProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonId = useId()
  const listId = useId()

  const selected = value ? value.split(SEPARATOR).filter(Boolean) : []

  useEffect(() => {
    if (!open) return
    const handleClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const toggle = (tech: string) => {
    const next = selected.includes(tech)
      ? selected.filter((item) => item !== tech)
      : [...selected, tech]
    onChange(next.join(SEPARATOR))
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        id={buttonId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`${inputCls} flex min-h-9 items-center justify-between gap-2 text-left`}
      >
        <span className={selected.length > 0 ? 'truncate' : 'text-mist'}>
          {selected.length > 0 ? selected.join(' · ') : 'Select techs…'}
        </span>
        <FaIcon
          icon={faChevronDown}
          className={`h-3 w-3 shrink-0 text-graphite transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          aria-multiselectable="true"
          className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-[10px] border border-line bg-paper"
        >
          {techs.length === 0 ? (
            <li className="px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-graphite">
              No techs added yet
            </li>
          ) : (
            techs.map((tech) => {
              const isSelected = selected.includes(tech)
              return (
                <li key={tech} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => toggle(tech)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                      isSelected
                        ? 'bg-canvas text-ink'
                        : 'text-graphite hover:bg-canvas hover:text-ink'
                    }`}
                  >
                    {tech}
                    <span className="w-3 shrink-0">
                      {isSelected ? (
                        <FaIcon icon={faCheck} className="h-3 w-3 text-brand" />
                      ) : null}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
