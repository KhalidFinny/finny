import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SiteData } from '@/types/site'
import CvTab from '@/components/admin/tabs/CvTab'
import ExperiencesTab from '@/components/admin/tabs/ExperiencesTab'
import ProjectsTab from '@/components/admin/tabs/ProjectsTab'
import SocialsTab from '@/components/admin/tabs/SocialsTab'
import TechsTab from '@/components/admin/tabs/TechsTab'
import { TABS, type Draft, type Tab } from '@/components/admin/types'
import { useAdminMutations } from '@/components/admin/useAdminMutations'
import { siteQueryOptions } from '@/lib/queries'

export default function AdminPanel({ initialData }: { initialData: SiteData }) {
  const { data, isLoading } = useQuery({ ...siteQueryOptions, initialData })
  const [tab, setTab] = useState<Tab>('Projects')
  const [draft, setDraft] = useState<Draft>(null)
  const [cvPath, setCvPath] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const mutations = useAdminMutations(setNotice)

  useEffect(() => {
    if (data && cvPath === null) {
      setCvPath(data.profile.cv_path ?? '/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf')
    }
  }, [data, cvPath])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-wall p-4 md:p-8 animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">Loading…</p>
      </div>
    )
  }

  const { projects, experiences, socials, techs, categories } = data
  const projectDraft = draft?.kind === 'project' ? draft : null
  const experienceDraft = draft?.kind === 'experience' ? draft : null
  const socialDraft = draft?.kind === 'social' ? draft : null
  const techDraft = draft?.kind === 'tech' ? draft : null

  return (
    <div className="page-grid min-h-screen bg-wall p-4 md:p-8 animate-[page-in_300ms_ease-out] motion-reduce:animate-none">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Service bay</p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-ink">Admin</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
              Private content tooling for the portfolio. Projects now support staged image uploads, inline previews, explicit order controls, and a full reset path.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            {projects.length} projects · {experiences.length} experiences · {socials.length} socials · {techs.length} techs
          </p>
        </div>

        {notice ? (
          <p className="mt-4 rounded-[12px] border border-line bg-canvas px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-graphite">
            {notice}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item)
                setDraft(null)
              }}
              aria-pressed={tab === item}
              className={`rounded-md px-3 py-1.5 text-sm font-medium uppercase tracking-[0.14em] transition-colors ${
                tab === item ? 'bg-ink text-paper' : 'text-graphite hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'Projects' ? (
            <ProjectsTab
              categories={categories}
              draft={projectDraft}
              mutations={mutations}
              onNotice={(message) => setNotice(message)}
              projects={projects}
              setDraft={setDraft}
              techs={techs.map((tech) => tech.name)}
            />
          ) : null}

          {tab === 'Experiences' ? (
            <ExperiencesTab
              draft={experienceDraft}
              experiences={experiences}
              mutations={mutations}
              setDraft={setDraft}
            />
          ) : null}

          {tab === 'Socials' ? (
            <SocialsTab
              draft={socialDraft}
              mutations={mutations}
              setDraft={setDraft}
              socials={socials}
            />
          ) : null}

          {tab === 'Techs' ? (
            <TechsTab draft={techDraft} mutations={mutations} setDraft={setDraft} techs={techs} />
          ) : null}

          {tab === 'CV' ? (
            <CvTab cvPath={cvPath} mutations={mutations} setCvPath={setCvPath} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
