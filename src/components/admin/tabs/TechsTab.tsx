import type { Tech } from '@/types/site'
import type { Draft } from '@/components/admin/types'
import type { AdminMutations } from '@/components/admin/useAdminMutations'
import TechForm from '@/components/admin/forms/TechForm'
import Modal from '@/components/ui/Modal'
import { ghostBtn, panelCls, primaryBtn, sectionLabelCls } from '@/components/admin/styles'
import { createEmptyTech } from '@/components/admin/utils'

interface TechsTabProps {
  draft: Extract<Draft, { kind: 'tech' }> | null
  mutations: AdminMutations
  setDraft: (draft: Draft) => void
  techs: Tech[]
}

export default function TechsTab({
  draft,
  mutations,
  setDraft,
  techs,
}: TechsTabProps) {
  return (
    <section>
      <div className={`${panelCls} p-4`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={sectionLabelCls}>Techs</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">Skill chips</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
              Manage the programming, design, and video labels used across the portfolio.
            </p>
          </div>
          <button
            type="button"
            className={primaryBtn}
            onClick={() =>
              setDraft({
                kind: 'tech',
                isNew: true,
                item: createEmptyTech(
                  (techs[techs.length - 1]?.id ?? 0) + 1,
                  techs.length,
                ),
              })
            }
          >
            Add tech
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {techs.map((tech) => (
          <div
            key={tech.id}
            className={`${panelCls} flex items-center justify-between gap-4 px-4 py-3`}
          >
            <div className="min-w-0">
              <p className="font-serif text-lg leading-tight text-ink">{tech.name}</p>
              <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.18em] text-graphite">
                {tech.category}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className={ghostBtn}
                onClick={() =>
                  setDraft({ kind: 'tech', item: tech, isNew: false })
                }
              >
                Edit
              </button>
              <button
                type="button"
                className={ghostBtn}
                disabled={mutations.deleteTechMutation.isPending}
                onClick={async () => {
                  if (!window.confirm(`Delete tech "${tech.name}"?`)) {
                    return
                  }
                  await mutations.deleteTechMutation.mutateAsync(tech.id)
                  if (draft?.item.id === tech.id) setDraft(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.item.id ? draft.item.name || 'Edit tech' : 'New tech'}
        subtitle={draft?.isNew ? 'New entry' : 'Edit entry'}
      >
        {draft ? (
          <TechForm
            key={draft.item.id}
            initial={draft.item}
            isSaving={mutations.saveTechMutation.isPending}
            onCancel={() => setDraft(null)}
            onSave={async (tech) => {
              await mutations.saveTechMutation.mutateAsync(tech)
              setDraft(null)
            }}
          />
        ) : null}
      </Modal>
    </section>
  )
}
