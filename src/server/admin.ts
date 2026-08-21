import { createServerFn } from '@tanstack/react-start'
import type { Experience, Project, Social, Tech } from '@/types/site'
import { getDb } from '@/server/db'
import {
  collectProjectMediaKeys,
  getMediaBucket,
  mediaKeyToPath,
} from '@/server/media'

const ADMIN_KEY = 'ls400'
const MAX_IMAGE_BYTES = 8 * 1024 * 1024

const IMAGE_EXTENSION_BY_TYPE: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
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
    return explicit === 'jpeg' ? 'jpg' : explicit
  }

  return IMAGE_EXTENSION_BY_TYPE[contentType] ?? 'bin'
}

async function normalizeProjectSortOrder(db: D1Database) {
  const rows = await db.prepare('SELECT id FROM projects ORDER BY sort_order, id').all<{ id: string }>()

  for (const [index, row] of rows.results.entries()) {
    await db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?').bind(index, row.id).run()
  }
}

export const verifyAdminKey = createServerFn({ method: 'POST' })
  .validator((key: string) => key)
  .handler(async ({ data: key }) => key === ADMIN_KEY)

export const uploadProjectMedia = createServerFn({ method: 'POST' })
  .validator((input: UploadProjectMediaInput) => input)
  .handler(async ({ data }) => {
    const bucket = await getMediaBucket()
    if (!bucket) {
      throw new Error('Media storage unavailable — upload requires the MEDIA bucket')
    }

    const { bytes, contentType } = decodeImageDataUrl(data.dataUrl)
    const extension = getUploadExtension(data.fileName, contentType)
    const stem = getUploadStem(data.fileName)
    const key = `projects/${Date.now()}-${crypto.randomUUID()}-${stem}.${extension}`

    await bucket.put(key, bytes, {
      httpMetadata: { contentType },
      customMetadata: { originalName: data.fileName },
    })

    return {
      key,
      path: mediaKeyToPath(key),
    }
  })

export const saveProject = createServerFn({ method: 'POST' })
  .validator((project: Project) => project)
  .handler(async ({ data }) => {
    const db = await requireDb()
    await db
      .prepare(
        `INSERT OR REPLACE INTO projects
          (id, category_id, title, role, stack, year, status, image, description, youtube_embed, instagram_link, google_drive_link, link, source_link, gallery, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        data.id,
        data.category_id,
        data.title,
        data.role ?? '',
        data.stack ?? '',
        data.year ?? '',
        data.status ?? 'done',
        data.image ?? '',
        data.description ?? '',
        data.youtube_embed ?? null,
        data.instagram_link ?? null,
        data.google_drive_link ?? null,
        data.link ?? null,
        data.source_link ?? null,
        data.gallery ?? null,
        data.sort_order ?? 0,
      )
      .run()
    return { ok: true }
  })

export const reorderProjects = createServerFn({ method: 'POST' })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const db = await requireDb()
    const orderedIds = [...new Set(ids.filter(Boolean))]

    for (const [index, id] of orderedIds.entries()) {
      await db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?').bind(index, id).run()
    }

    return { ok: true }
  })

export const deleteProject = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await requireDb()
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
  .validator((confirmed: boolean) => confirmed)
  .handler(async ({ data: confirmed }) => {
    if (!confirmed) {
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
  .validator((experience: Experience) => experience)
  .handler(async ({ data }) => {
    const db = await requireDb()
    await db
      .prepare(
        `INSERT OR REPLACE INTO experiences
          (id, role, company, location, period, description, type, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        data.id,
        data.role,
        data.company,
        data.location,
        data.period,
        data.description,
        data.type,
        data.sort_order,
      )
      .run()
    return { ok: true }
  })

export const deleteExperience = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const db = await requireDb()
    await db.prepare('DELETE FROM experiences WHERE id = ?').bind(id).run()
    return { ok: true }
  })

export const saveSocial = createServerFn({ method: 'POST' })
  .validator((social: Social) => social)
  .handler(async ({ data }) => {
    const db = await requireDb()
    await db
      .prepare('INSERT OR REPLACE INTO socials (id, url, sort_order) VALUES (?, ?, ?)')
      .bind(data.id, data.url, data.sort_order)
      .run()
    return { ok: true }
  })

export const deleteSocial = createServerFn({ method: 'POST' })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const db = await requireDb()
    await db.prepare('DELETE FROM socials WHERE id = ?').bind(id).run()
    return { ok: true }
  })

export const saveTech = createServerFn({ method: 'POST' })
  .validator((tech: Tech) => tech)
  .handler(async ({ data }) => {
    const db = await requireDb()
    await db
      .prepare('INSERT OR REPLACE INTO techs (id, name, category, sort_order) VALUES (?, ?, ?, ?)')
      .bind(data.id, data.name, data.category, data.sort_order)
      .run()
    return { ok: true }
  })

export const deleteTech = createServerFn({ method: 'POST' })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const db = await requireDb()
    await db.prepare('DELETE FROM techs WHERE id = ?').bind(id).run()
    return { ok: true }
  })

export const saveCvPath = createServerFn({ method: 'POST' })
  .validator((path: string) => path)
  .handler(async ({ data: path }) => {
    const db = await requireDb()
    await db.prepare('UPDATE profile SET cv_path = ? WHERE id = 1').bind(path).run()
    return { ok: true }
  })
