import type { Social } from '@/types/site'
import type { Draft } from '@/components/admin/types'
import type { AdminMutations } from '@/components/admin/useAdminMutations'
import SocialForm from '@/components/admin/forms/SocialForm'
import Modal from '@/components/ui/Modal'
import { ghostBtn, panelCls, primaryBtn, sectionLabelCls } from '@/components/admin/styles'
import { createEmptySocial } from '@/components/admin/utils'

interface SocialsTabProps {
  draft: Extract<Draft, { kind: 'social' }> | null
  mutations: AdminMutations
  setDraft: (draft: Draft) => void
  socials: Social[]
}

export default function SocialsTab({
  draft,
  mutations,
  setDraft,
  socials,
}: SocialsTabProps) {
  return (
    <section>
      <div className={`${panelCls} p-4`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={sectionLabelCls}>Socials</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">Outbound links</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
              Keep GitHub, LinkedIn, and social hosts current from here.
            </p>
          </div>
          <button
            type="button"
            className={primaryBtn}
            onClick={() =>
              setDraft({
                kind: 'social',
                isNew: true,
                item: createEmptySocial(
                  (socials[socials.length - 1]?.id ?? 0) + 1,
                  socials.length,
                ),
              })
            }
          >
            Add social
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {socials.map((social) => (
          <div
            key={social.id}
            className={`${panelCls} flex items-center justify-between gap-4 px-4 py-3`}
          >
            <p className="truncate font-mono text-xs uppercase tracking-[0.18em] text-graphite">
              {social.url}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className={ghostBtn}
                onClick={() =>
                  setDraft({ kind: 'social', item: social, isNew: false })
                }
              >
                Edit
              </button>
              <button
                type="button"
                className={ghostBtn}
                disabled={mutations.deleteSocialMutation.isPending}
                onClick={async () => {
                  if (!window.confirm(`Delete social "${social.url}"?`)) {
                    return
                  }
                  await mutations.deleteSocialMutation.mutateAsync(social.id)
                  if (draft?.item.id === social.id) setDraft(null)
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
        title={draft?.item.id ? 'Edit social link' : 'New social link'}
        subtitle={draft?.isNew ? 'New entry' : 'Edit entry'}
      >
        {draft ? (
          <SocialForm
            key={draft.item.id}
            initial={draft.item}
            isSaving={mutations.saveSocialMutation.isPending}
            onCancel={() => setDraft(null)}
            onSave={async (social) => {
              await mutations.saveSocialMutation.mutateAsync(social)
              setDraft(null)
            }}
          />
        ) : null}
      </Modal>
    </section>
  )
}
