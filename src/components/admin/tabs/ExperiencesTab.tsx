import type { Experience } from '@/types/site'
import type { Draft } from '@/components/admin/types'
import type { AdminMutations } from '@/components/admin/useAdminMutations'
import ExperienceForm from '@/components/admin/forms/ExperienceForm'
import Modal from '@/components/ui/Modal'
import { ghostBtn, panelCls, primaryBtn, sectionLabelCls } from '@/components/admin/styles'
import { createEmptyExperience } from '@/components/admin/utils'

interface ExperiencesTabProps {
  draft: Extract<Draft, { kind: 'experience' }> | null
  experiences: Experience[]
  mutations: AdminMutations
  setDraft: (draft: Draft) => void
}

export default function ExperiencesTab({
  draft,
  experiences,
  mutations,
  setDraft,
}: ExperiencesTabProps) {
  return (
    <section>
      <div className={`${panelCls} p-4`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={sectionLabelCls}>Experiences</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">Timeline entries</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
              Work, organization, and education entries feed the timeline surfaces across the site.
            </p>
          </div>
          <button
            type="button"
            className={primaryBtn}
            onClick={() =>
              setDraft({
                kind: 'experience',
                isNew: true,
                item: createEmptyExperience(experiences.length),
              })
            }
          >
            Add experience
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className={`${panelCls} flex items-center justify-between gap-4 px-4 py-3`}
          >
            <div className="min-w-0">
              <p className="font-serif text-lg leading-tight text-ink">{experience.role}</p>
              <p className="mt-0.5 truncate font-mono text-xs uppercase tracking-[0.18em] text-graphite">
                {experience.company} · {experience.period}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className={ghostBtn}
                onClick={() =>
                  setDraft({ kind: 'experience', item: experience, isNew: false })
                }
              >
                Edit
              </button>
              <button
                type="button"
                className={ghostBtn}
                disabled={mutations.deleteExperienceMutation.isPending}
                onClick={async () => {
                  if (!window.confirm(`Delete experience "${experience.role}"?`)) {
                    return
                  }
                  await mutations.deleteExperienceMutation.mutateAsync(experience.id)
                  if (draft?.item.id === experience.id) setDraft(null)
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
        title={draft?.item.id ? draft.item.role || 'Edit experience' : 'New experience'}
        subtitle={draft?.isNew ? 'New entry' : 'Edit entry'}
      >
        {draft ? (
          <ExperienceForm
            key={draft.item.id}
            initial={draft.item}
            isSaving={mutations.saveExperienceMutation.isPending}
            onCancel={() => setDraft(null)}
            onSave={async (experience) => {
              await mutations.saveExperienceMutation.mutateAsync(experience)
              setDraft(null)
            }}
          />
        ) : null}
      </Modal>
    </section>
  )
}
