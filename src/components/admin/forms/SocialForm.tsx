import { useEffect, useState } from 'react'
import type { Social } from '@/types/site'
import Field from '@/components/admin/Field'
import { ghostBtn, inputCls, panelCls, primaryBtn } from '@/components/admin/styles'

interface SocialFormProps {
  initial: Social
  isSaving: boolean
  onCancel: () => void
  onSave: (social: Social) => Promise<void>
}

export default function SocialForm({
  initial,
  isSaving,
  onCancel,
  onSave,
}: SocialFormProps) {
  const [form, setForm] = useState<Social>(initial)

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
        <div className="md:col-span-2">
          <Field label="URL">
            <input
              className={inputCls}
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              required
            />
          </Field>
        </div>
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
