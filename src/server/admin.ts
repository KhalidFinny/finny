import { createServerFn } from '@tanstack/react-start'
import type { Experience, Project, Social, Tech } from '@/types/site'
import { PROJECT_DESCRIPTION_MAX_WORDS, countProjectDescriptionWords } from '@/lib/project-description'
import { getDb } from '@/server/db'
import { getRuntimeEnv } from '@/server/platform'
import {
  collectProjectMediaKeys,
  getMediaBucket,
  mediaKeyToPath,
} from '@/server/media'

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

// Raster-only — SVG is denied because an uploaded SVG served from this origin
// can execute scripts when opened as a top-level document (stored XSS).
const IMAGE_EXTENSION_BY_TYPE: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export interface UploadProjectMediaResult {
  key: string
  path: string
}

type ProjectMediaRow = Pick<Project, 'image' | 'gallery'>

export interface UploadProjectMediaInput {
  fileName: string
  dataUrl: string
  thumbDataUrl?: string
}

/** Every admin mutation carries the secret and asserts it server-side. */
export interface AdminKeyed<T> {
  input: T
  adminKey: string
}

async function getAdminSecret(): Promise<string | null> {
  const env = await getRuntimeEnv()
  return env?.WORKER_SECRET ?? null
}

// Constant-time-ish comparison — no early exit on the first differing byte.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

async function assertAdmin(adminKey: string | null | undefined): Promise<void> {
  const secret = await getAdminSecret()
  if (!secret) throw new Error('Admin secret is not configured')
  if (typeof adminKey !== 'string' || !safeEqual(adminKey, secret)) {
    throw new Error('Unauthorized')
  }
}

async function requireDb(): Promise<D1Database> {
  const db = await getDb()
  if (!db) {
    throw new Error('D1 unavailable — admin writes require the Workers runtime')
  }
  return db
}

function decodeImageDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i)
  if (!match) {
    throw new Error('Unsupported image payload')
  }

  const [, contentType, base64] = match
  const bytes = Buffer.from(base64, 'base64')
  if (bytes.byteLength === 0) {
    throw new Error('Uploaded image is empty')
  }
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('Uploaded image is too large — keep it under 8 MB')
  }

  return { bytes, contentType }
}

function getUploadStem(fileName: string) {
  return (
    fileName
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 48) || 'asset'
  )
}

function getUploadExtension(fileName: string, contentType: string) {
  const explicit = fileName.split('.').pop()?.toLowerCase()
  if (explicit && /^[a-z0-9]{1,5}$/.test(explicit)) {
    if (explicit === 'svg' || explicit === 'html' || explicit === 'htm') {
      throw new Error('This file type is not allowed')
    }
    return explicit === 'jpeg' ? 'jpg' : explicit
  }

  const fallback = IMAGE_EXTENSION_BY_TYPE[contentType]
  if (!fallback) {
    throw new Error('Unsupported image type')
  }
  return fallback
}

async function normalizeProjectSortOrder(db: D1Database) {
  const rows = await db.prepare('SELECT id FROM projects ORDER BY sort_order, id').all<{ id: string }>()

  // One round trip instead of one UPDATE per project.
  await db.batch(
    rows.results.map((row, index) =>
      db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?').bind(index, row.id),
    ),
  )
}

export const verifyAdminKey = createServerFn({ method: 'POST' })
  .validator((key: string) => key)
  .handler(async ({ data: key }) => {
    const secret = await getAdminSecret()
    return !!secret && typeof key === 'string' && safeEqual(key, secret)
  })

export const uploadProjectMedia = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<UploadProjectMediaInput>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)

    const bucket = await getMediaBucket()
    if (!bucket) {
      throw new Error('Media storage unavailable — upload requires the MEDIA bucket')
    }

    const { bytes, contentType } = decodeImageDataUrl(data.input.dataUrl)
    if (contentType === 'image/svg+xml') {
      throw new Error('SVG uploads are not allowed')
    }

    const extension = getUploadExtension(data.input.fileName, contentType)
    const stem = getUploadStem(data.input.fileName)
    const key = `projects/${Date.now()}-${crypto.randomUUID()}-${stem}.${extension}`

    await bucket.put(key, bytes, {
      httpMetadata: { contentType },
      customMetadata: { originalName: data.input.fileName },
    })

    // Grid thumbnails — stored as a -thumb sibling so polaroid covers stay small.
    if (data.input.thumbDataUrl) {
      const thumb = decodeImageDataUrl(data.input.thumbDataUrl)
      if (thumb.contentType === 'image/svg+xml') {
        throw new Error('SVG uploads are not allowed')
      }
      const thumbKey = key.replace(/\.[^.]+$/, '-thumb.$&')
      await bucket.put(thumbKey, thumb.bytes, {
        httpMetadata: { contentType: thumb.contentType },
        customMetadata: { originalName: data.input.fileName },
      })
    }

    return {
      key,
      path: mediaKeyToPath(key),
    }
  })

export const saveProject = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<Project>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)

    const project = data.input
    if (countProjectDescriptionWords(project.description ?? '') > PROJECT_DESCRIPTION_MAX_WORDS) {
      throw new Error(`Keep project descriptions to ${PROJECT_DESCRIPTION_MAX_WORDS} words or fewer`)
    }

    const db = await requireDb()
    await db
      .prepare(
        `INSERT OR REPLACE INTO projects
          (id, category_id, title, role, stack, year, status, image, description, youtube_embed, instagram_link, google_drive_link, link, source_link, gallery, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        project.id,
        project.category_id,
        project.title,
        project.role ?? '',
        project.stack ?? '',
        project.year ?? '',
        project.status ?? 'done',
        project.image ?? '',
        project.description ?? '',
        project.youtube_embed ?? null,
        project.instagram_link ?? null,
        project.google_drive_link ?? null,
        project.link ?? null,
        project.source_link ?? null,
        project.gallery ?? null,
        project.sort_order ?? 0,
      )
      .run()
    return { ok: true }
  })

export const reorderProjects = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<string[]>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    const orderedIds = [...new Set(data.input.filter(Boolean))]

    // One round trip instead of one UPDATE per project.
    await db.batch(
      orderedIds.map((id, index) =>
        db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?').bind(index, id),
      ),
    )

    return { ok: true }
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<string>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    const id = data.input
    const project = await db
      .prepare('SELECT image, gallery FROM projects WHERE id = ?')
      .bind(id)
      .first<ProjectMediaRow>()

    await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run()
    await normalizeProjectSortOrder(db)

    const mediaKeys = project ? collectProjectMediaKeys(project) : []
    if (mediaKeys.length > 0) {
      const bucket = await getMediaBucket()
      if (bucket) {
        await bucket.delete(mediaKeys)
      }
    }

    return { ok: true }
  })

export const resetProjects = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<boolean>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)

    if (!data.input) {
      throw new Error('Confirmation required')
    }

    const db = await requireDb()
    const projects = await db.prepare('SELECT image, gallery FROM projects').all<ProjectMediaRow>()
    await db.prepare('DELETE FROM projects').run()

    const mediaKeys = projects.results.flatMap((project) => collectProjectMediaKeys(project))
    if (mediaKeys.length > 0) {
      const bucket = await getMediaBucket()
      if (bucket) {
        await bucket.delete([...new Set(mediaKeys)])
      }
    }

    return { ok: true }
  })

export const saveExperience = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<Experience>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    const experience = data.input
    await db
      .prepare(
        `INSERT OR REPLACE INTO experiences
          (id, role, company, location, period, description, type, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        experience.id,
        experience.role,
        experience.company,
        experience.location,
        experience.period,
        experience.description,
        experience.type,
        experience.sort_order,
      )
      .run()
    return { ok: true }
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<string>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    await db.prepare('DELETE FROM experiences WHERE id = ?').bind(data.input).run()
    return { ok: true }
  })

export const saveSocial = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<Social>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    const social = data.input
    await db
      .prepare('INSERT OR REPLACE INTO socials (id, url, sort_order) VALUES (?, ?, ?)')
      .bind(social.id, social.url, social.sort_order)
      .run()
    return { ok: true }
  })

export const deleteSocial = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<number>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    await db.prepare('DELETE FROM socials WHERE id = ?').bind(data.input).run()
    return { ok: true }
  })

export const saveTech = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<Tech>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    const tech = data.input
    await db
      .prepare('INSERT OR REPLACE INTO techs (id, name, category, sort_order) VALUES (?, ?, ?, ?)')
      .bind(tech.id, tech.name, tech.category, tech.sort_order)
      .run()
    return { ok: true }
  })

export const deleteTech = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<number>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    await db.prepare('DELETE FROM techs WHERE id = ?').bind(data.input).run()
    return { ok: true }
  })

export const saveCvPath = createServerFn({ method: 'POST' })
  .validator((payload: AdminKeyed<string>) => payload)
  .handler(async ({ data }) => {
    await assertAdmin(data.adminKey)
    const db = await requireDb()
    await db.prepare('UPDATE profile SET cv_path = ? WHERE id = 1').bind(data.input).run()
    return { ok: true }
  })
