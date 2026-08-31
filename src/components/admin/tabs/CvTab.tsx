import Field from '@/components/admin/Field'
import { panelCls, primaryBtn, sectionLabelCls, inputCls } from '@/components/admin/styles'
import type { AdminMutations } from '@/components/admin/useAdminMutations'

interface CvTabProps {
  cvPath: string | null
  mutations: AdminMutations
  setCvPath: (path: string) => void
}

export default function CvTab({ cvPath, mutations, setCvPath }: CvTabProps) {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        if (cvPath) {
          await mutations.saveCvPathMutation.mutateAsync(cvPath)
        }
      }}
      className={`space-y-3 ${panelCls} bg-canvas p-4`}
    >
      <p className={sectionLabelCls}>CV</p>
      <h2 className="font-serif text-2xl text-ink">Resume asset</h2>
      <Field label="CV file path">
        <input className={inputCls} value={cvPath ?? ''} onChange={(event) => setCvPath(event.target.value)} required />
      </Field>
      <p className="text-sm leading-relaxed text-graphite">
        Stored in public/ — drop the file there, save this path.
      </p>
      <button type="submit" disabled={mutations.saveCvPathMutation.isPending} className={primaryBtn}>
        {mutations.saveCvPathMutation.isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
