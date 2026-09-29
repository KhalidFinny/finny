import { useEffect, useState } from 'react'
import type { Experience } from '@/types/site'
import Field from '@/components/admin/Field'
import { ghostBtn, inputCls, panelCls, primaryBtn } from '@/components/admin/styles'
import { bulletsToJson, jsonToBullets } from '@/components/admin/utils'

interface ExperienceFormProps {
  initial: Experience
  isSaving: boolean
  onCancel: () => void
  onSave: (experience: Experience) => Promise<void>
}

export default function ExperienceForm({
  initial,
  isSaving,
  onCancel,
  onSave,
}: ExperienceFormProps) {
  const [form, setForm] = useState<Experience>(initial)
  const [bullets, setBullets] = useState(jsonToBullets(initial.description))

  useEffect(() => {
    setForm(initial)
    setBullets(jsonToBullets(initial.description))
  }, [initial])

  const set = <K extends keyof Experience>(key: K, value: Experience[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        await onSave({ ...form, description: bulletsToJson(bullets) })
      }}
      className={`space-y-3 ${panelCls} bg-canvas p-4`}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Id">
          <input className={inputCls} value={form.id} onChange={(event) => set('id', event.target.value)} required />
        </Field>
        <Field label="Type">
          <select className={inputCls} value={form.type} onChange={(event) => set('type', event.target.value as Experience['type'])}>
            <option value="work">Work</option>
            <option value="organization">Organization</option>
            <option value="education">Education</option>
          </select>
        </Field>
      </div>
      <Field label="Role">
        <input className={inputCls} value={form.role} onChange={(event) => set('role', event.target.value)} required />
      </Field>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Company">
          <input className={inputCls} value={form.company} onChange={(event) => set('company', event.target.value)} />
        </Field>
        <Field label="Location">
          <input className={inputCls} value={form.location} onChange={(event) => set('location', event.target.value)} />
        </Field>
      </div>
      <Field label="Period">
        <input className={inputCls} value={form.period} onChange={(event) => set('period', event.target.value)} />
      </Field>
      <Field label="Bullets (one per line)">
        <textarea className={inputCls} rows={5} value={bullets} onChange={(event) => setBullets(event.target.value)} />
      </Field>
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
