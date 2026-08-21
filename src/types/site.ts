// Shared content types — mirrors the D1 schema.
// NOTE: reconstructed 2026-08-08 after accidental deletion; field names/values
// match the D1 export and all usage in routes/data exactly.

export interface Profile {
  id: number
  name: string
  title: string
  about_headline: string
  about_profile: string
  about_study: string
  approach: string
  approach_detail: string
  approach_detail_2: string
  cv_path?: string
}

export interface Category {
  id: string
  title: string
  see_more_link: string
  sort_order: number
}

export type ProjectStatus = 'ongoing' | 'done'

export interface Project {
  id: string
  category_id: string
  title: string
  role: string
  stack: string
  year: string
  status: ProjectStatus
  image: string
  description: string
  youtube_embed: string | null
  instagram_link: string | null
  google_drive_link: string | null
  link: string | null
  source_link?: string | null
  gallery?: string | null
  sort_order: number
}

export type ExperienceType = 'work' | 'education' | 'organization'

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  period: string
  description: string
  type: ExperienceType
  sort_order: number
}

export interface Social {
  id: number
  url: string
  sort_order: number
}

export type TechCategory = 'programming' | 'design' | 'video'

export interface Tech {
  id: number
  name: string
  category: TechCategory
  sort_order: number
}

export interface SiteData {
  profile: Profile
  categories: Category[]
  projects: Project[]
  experiences: Experience[]
  socials: Social[]
  techs: Tech[]
}
