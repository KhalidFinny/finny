import type { Category, Project } from '@/types/site'
import type { Draft } from '@/components/admin/types'
import type { AdminMutations } from '@/components/admin/useAdminMutations'
import ProjectForm from '@/components/admin/forms/ProjectForm'
import Modal from '@/components/ui/Modal'
import {
  dangerBtn,
  ghostBtn,
  panelCls,
  primaryBtn,
  sectionLabelCls,
} from '@/components/admin/styles'
import { createEmptyProject } from '@/components/admin/utils'
import Placeholder from '@/components/ui/Placeholder'

interface ProjectsTabProps {
  categories: Category[]
  draft: Extract<Draft, { kind: 'project' }> | null
  mutations: AdminMutations
  onNotice: (message: string) => void
  projects: Project[]
  setDraft: (draft: Draft) => void
  techs: string[]
}

export default function ProjectsTab({
  categories,
  draft,
  mutations,
  onNotice,
  projects,
  setDraft,
  techs,
}: ProjectsTabProps) {
  const orderedProjects = [...projects].sort(
    (left, right) => left.sort_order - right.sort_order || left.title.localeCompare(right.title),
  )
  const categoryById = Object.fromEntries(
    categories.map((category) => [category.id, category.title]),
  ) as Record<string, string>

  const moveProject = async (projectId: string, direction: 'up' | 'down') => {
    const currentIndex = orderedProjects.findIndex((project) => project.id === projectId)
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= orderedProjects.length) return

    const nextOrder = [...orderedProjects]
    const [moved] = nextOrder.splice(currentIndex, 1)
    nextOrder.splice(nextIndex, 0, moved)
    await mutations.reorderProjectsMutation.mutateAsync(nextOrder.map((project) => project.id))
  }

  return (
    <section>
      <div className={`${panelCls} p-4`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={sectionLabelCls}>Projects</p>
            <h2 className="mt-2 font-serif text-2xl text-ink">Portfolio control</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
              {orderedProjects.length} project{orderedProjects.length === 1 ? '' : 's'} in order.
              Uploads are staged until you save, so canceling an edit will not orphan files.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              className={primaryBtn}
              onClick={() =>
                setDraft({
                  kind: 'project',
                  isNew: true,
                  item: { ...createEmptyProject(orderedProjects.length), category_id: 'programming' },
                })
              }
            >
              Add programming
            </button>
            <button
              type="button"
              className={primaryBtn}
              onClick={() =>
                setDraft({
                  kind: 'project',
                  isNew: true,
                  item: { ...createEmptyProject(orderedProjects.length), category_id: 'ui-ux' },
                })
              }
            >
              Add creative
            </button>
            <button
              type="button"
              className={dangerBtn}
              disabled={mutations.resetProjectsMutation.isPending || orderedProjects.length === 0}
              onClick={async () => {
                if (
                  !window.confirm(
                    'Reset all projects? This deletes every project row and any uploaded /media assets tied to them.',
                  )
                ) {
                  return
                }
                await mutations.resetProjectsMutation.mutateAsync(true)
              }}
            >
              {mutations.resetProjectsMutation.isPending ? 'Resetting…' : 'Reset all'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {orderedProjects.length === 0 ? (
          <div className={`${panelCls} bg-paper p-5`}>
            <p className={sectionLabelCls}>Empty state</p>
            <h3 className="mt-2 font-serif text-2xl text-ink">No projects yet</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
              Your portfolio is reset. Click the button above to add the first project.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {orderedProjects.map((project, index) => {
              const canMoveUp = index > 0
              const canMoveDown = index < orderedProjects.length - 1

              return (
                <li key={project.id} className={`${panelCls} overflow-hidden`}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full border-b border-line object-cover"
                    />
                  ) : (
                    <Placeholder
                      label={project.title}
                      className="aspect-[4/3] w-full border-b border-line"
                    />
                  )}

                  <div className="space-y-4 p-4">
                    <div>
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-graphite">
                        {categoryById[project.category_id] ?? project.category_id}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl leading-tight text-ink">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-graphite">
                        {project.description || 'No project summary yet.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.18em] text-graphite">
                      <span>{project.role || '—'}</span>
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 self-center rounded-full bg-rosso"
                      />
                      <span>{project.year || '—'}</span>
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 self-center rounded-full bg-rosso"
                      />
                      <span>{project.stack || '—'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={ghostBtn}
                        onClick={() =>
                          setDraft({ kind: 'project', item: project, isNew: false })
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={ghostBtn}
                        disabled={
                          !canMoveUp || mutations.reorderProjectsMutation.isPending
                        }
                        onClick={() => {
                          void moveProject(project.id, 'up')
                        }}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className={ghostBtn}
                        disabled={
                          !canMoveDown || mutations.reorderProjectsMutation.isPending
                        }
                        onClick={() => {
                          void moveProject(project.id, 'down')
                        }}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className={ghostBtn}
                        disabled={mutations.deleteProjectMutation.isPending}
                        onClick={async () => {
                          if (!window.confirm(`Delete project "${project.title}"?`)) {
                            return
                          }
                          await mutations.deleteProjectMutation.mutateAsync(project.id)
                          if (draft?.item.id === project.id) setDraft(null)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        wide
        title={draft?.item.title || (draft?.isNew ? 'New project' : 'Edit project')}
        subtitle={
          draft
            ? draft.item.category_id === 'programming'
              ? 'Programming project'
              : 'Creative project'
            : undefined
        }
      >
        {draft ? (
          <ProjectForm
            key={draft.item.id}
            initial={draft.item}
            categories={categories}
            techs={techs}
            isSaving={
              mutations.saveProjectMutation.isPending ||
              mutations.uploadProjectMediaMutation.isPending
            }
            onCancel={() => setDraft(null)}
            onNotice={onNotice}
            onSave={async (project) => {
              await mutations.saveProjectMutation.mutateAsync(project)
              setDraft(null)
            }}
            onUpload={mutations.uploadProjectMediaMutation.mutateAsync}
          />
        ) : null}
      </Modal>
    </section>
  )
}
