import { useEffect, useState } from 'react'
import type { Tech } from '@/types/site'
import Field from '@/components/admin/Field'
import { ghostBtn, inputCls, panelCls, primaryBtn } from '@/components/admin/styles'

interface TechFormProps {
  initial: Tech
  isSaving: boolean
  onCancel: () => void
  onSave: (tech: Tech) => Promise<void>
}

export default function TechForm({
  initial,
  isSaving,
  onCancel,
  onSave,
}: TechFormProps) {
  const [form, setForm] = useState<Tech>(initial)

  useEffect(() => {
    setForm(initial)
  }, [initial])

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        await onSave(form)
      }}
      className={`space-y-3 ${panelCls} bg-canvas p-4`}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Id">
          <input
            type="number"
            className={inputCls}
            value={form.id}
            onChange={(event) => setForm((prev) => ({ ...prev, id: Number(event.target.value) }))}
            required
          />
        </Field>
        <Field label="Name">
          <input className={inputCls} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
        </Field>
        <Field label="Category">
          <select
            className={inputCls}
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as Tech['category'] }))}
          >
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="video">Video</option>
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" className={primaryBtn} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
