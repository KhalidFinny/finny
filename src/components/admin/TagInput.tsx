import { useEffect, useRef, useState } from 'react'
import { ghostBtn, inputCls } from '@/components/admin/styles'

const SEPARATOR = ' | '

interface TagInputProps {
  value: string
  onChange: (value: string) => void
  suggestions?: string[]
  placeholder?: string
  disabled?: boolean
}

export default function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder,
  disabled = false,
}: TagInputProps) {
  const [input, setInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const tags = value ? value.split(SEPARATOR).filter(Boolean) : []
  const filtered = suggestions.filter(
    (item) => !tags.includes(item) && item.toLowerCase().includes(input.toLowerCase()),
  )

  useEffect(() => {
    if (!showDropdown) return
    const handleClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showDropdown])

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed].join(SEPARATOR))
    setInput('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index).join(SEPARATOR))
  }

  return (
    <div ref={wrapRef} className="relative">
      {tags.length > 0 ? (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-graphite"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                disabled={disabled}
                aria-label={`Remove ${tag}`}
                className="text-mist transition-colors hover:text-ink"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <input
        ref={inputRef}
        className={inputCls}
        value={input}
        disabled={disabled}
        placeholder={placeholder ?? (tags.length > 0 ? 'Add more…' : 'Type and press enter…')}
        onChange={(event) => {
          setInput(event.target.value)
          setShowDropdown(true)
        }}
        onFocus={() => {
          if (filtered.length > 0) setShowDropdown(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault()
            addTag(input)
          }
          if (event.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags.length - 1)
          }
        }}
      />
      {showDropdown && filtered.length > 0 ? (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-[10px] border border-line bg-paper">
          {filtered.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.18em] text-graphite transition-colors hover:bg-canvas hover:text-ink"
                onMouseDown={(event) => {
                  event.preventDefault()
                  addTag(item)
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
