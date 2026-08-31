import { useEffect, useId, useState, type DragEvent } from 'react'
import type { Category, Project } from '@/types/site'
import type {
  UploadProjectMediaInput,
  UploadProjectMediaResult,
} from '@/server/admin'
import { PROJECT_DESCRIPTION_MAX_WORDS, countProjectDescriptionWords } from '@/lib/project-description'
import Field from '@/components/admin/Field'
import TagInput from '@/components/admin/TagInput'
import TechSelect from '@/components/admin/TechSelect'
import { ghostBtn, inputCls, labelCls, panelCls, primaryBtn } from '@/components/admin/styles'
import { jsonToBullets, readFileAsDataUrl, splitLines } from '@/components/admin/utils'
import Placeholder from '@/components/ui/Placeholder'

const MAX_IMAGE_BYTES = 8 * 1024 * 1024

const CREATIVE_CATEGORY_IDS = new Set(['ui-ux', 'videography', 'photography'])

const ROLE_SUGGESTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'UI/UX Designer',
  'Lead Developer',
  'DevOps Engineer',
  'Mobile Developer',
  'Data Engineer',
  'Machine Learning Engineer',
]

interface ProjectFormProps {
  initial: Project
  categories: Category[]
  techs: string[]
  isSaving: boolean
  onCancel: () => void
  onNotice: (message: string) => void
  onSave: (project: Project) => Promise<void>
  onUpload: (input: UploadProjectMediaInput) => Promise<UploadProjectMediaResult>
}

/* ─── Shared dropzone ─────────────────────────────────────────────────────── */

interface MediaDropzoneProps {
  disabled?: boolean
  label: string
  multiple?: boolean
  note: string
  onFilesSelected: (files: File[]) => void
}

function MediaDropzone({
  disabled = false,
  label,
  multiple = false,
  note,
  onFilesSelected,
}: MediaDropzoneProps) {
  const inputId = useId()
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    onFilesSelected(Array.from(event.dataTransfer.files))
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed px-4 py-4 text-center transition-colors ${
          disabled
            ? 'border-line bg-canvas/70 text-mist'
            : isDragging
              ? 'border-ink bg-paper text-ink'
              : 'border-line bg-canvas text-graphite hover:border-deep-line'
        }`}
      >
        <span className={labelCls}>{label}</span>
        <span className="text-sm leading-relaxed">
          Drag and drop {multiple ? 'images' : 'an image'} here or click to choose
        </span>
        <span className="font-mono text-sm uppercase tracking-[0.18em] text-mist">
          {note}
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        hidden
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          onFilesSelected(Array.from(event.target.files ?? []))
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}

/* ─── Form ────────────────────────────────────────────────────────────────── */

export default function ProjectForm({
  initial,
  categories,
  techs,
  isSaving,
  onCancel,
  onNotice,
  onSave,
  onUpload,
}: ProjectFormProps) {
  const [form, setForm] = useState<Project>(initial)
  const [galleryText, setGalleryText] = useState(jsonToBullets(initial.gallery ?? ''))
  const [pendingImage, setPendingImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initial.image || null)
  const [pendingGallery, setPendingGallery] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    setForm(initial)
    setGalleryText(jsonToBullets(initial.gallery ?? ''))
    setPendingImage(null)
    setImagePreview(initial.image || null)
    setPendingGallery([])
    setGalleryPreviews([])
  }, [initial])

  const isCreative = CREATIVE_CATEGORY_IDS.has(form.category_id)
  const isBusy = isSaving || isUploading
  const existingGallery = splitLines(galleryText)
  const allGallery = [...existingGallery, ...galleryPreviews]
  const descriptionWordCount = countProjectDescriptionWords(form.description ?? '')
  const descriptionTooLong = descriptionWordCount > PROJECT_DESCRIPTION_MAX_WORDS

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  /* ── Image handlers ──────────────────────────────────────────────────── */

  const convertToWebp = async (file: File): Promise<File> => {
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const context = canvas.getContext('2d')
      if (!context) {
        bitmap.close()
        return file
      }
      context.drawImage(bitmap, 0, 0)
      bitmap.close()

      const { promise, resolve } = Promise.withResolvers<Blob | null>()
      canvas.toBlob(resolve, 'image/webp', 0.85)
      const blob = await promise
      if (!blob) return file

      const baseName = file.name.replace(/\.[^.]+$/, '')
      return new File([blob], `${baseName}.webp`, { type: 'image/webp' })
    } catch {
      // Conversion unsupported (e.g. tainted SVG) — keep the original file
      return file
    }
  }

  const handlePrimaryFiles = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      onNotice('Only image files are supported')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onNotice('Keep images under 8 MB')
      return
    }
    const webp = await convertToWebp(file)
    setPendingImage(webp)
    setImagePreview(await readFileAsDataUrl(webp))
  }

  const handleGalleryFiles = async (files: File[]) => {
    const accepted: File[] = []
    const previews: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        onNotice(`Skipped ${file.name} — only image files are supported`)
        continue
      }
      if (file.size > MAX_IMAGE_BYTES) {
        onNotice(`Skipped ${file.name} — keep images under 8 MB`)
        continue
      }
      const webp = await convertToWebp(file)
      accepted.push(webp)
      previews.push(await readFileAsDataUrl(webp))
    }

    if (accepted.length === 0) return
    setPendingGallery((current) => [...current, ...accepted])
    setGalleryPreviews((current) => [...current, ...previews])
  }

  const clearImage = () => {
    setPendingImage(null)
    setImagePreview(null)
    set('image', '')
  }

  const removeGalleryItem = (index: number) => {
    if (index < existingGallery.length) {
      const next = [...existingGallery]
      next.splice(index, 1)
      setGalleryText(next.join('\n'))
    } else {
      const pendingIndex = index - existingGallery.length
      setPendingGallery((prev) => prev.filter((_, i) => i !== pendingIndex))
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== pendingIndex))
    }
  }

  /* ── Submit ──────────────────────────────────────────────────────────── */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (descriptionTooLong) {
      onNotice(`Keep project descriptions to ${PROJECT_DESCRIPTION_MAX_WORDS} words or fewer`)
      return
    }

    setIsUploading(true)

    try {
      let nextImage = form.image
      if (pendingImage) {
        const uploaded = await onUpload({
          fileName: pendingImage.name,
          dataUrl: await readFileAsDataUrl(pendingImage),
        })
        nextImage = uploaded.path
      }

      const galleryItems = [...existingGallery]
      if (pendingGallery.length > 0) {
        const uploadedGallery = await Promise.all(
          pendingGallery.map(async (file) => {
            const uploaded = await onUpload({
              fileName: file.name,
              dataUrl: await readFileAsDataUrl(file),
            })
            return uploaded.path
          }),
        )
        galleryItems.push(...uploadedGallery)
      }

      await onSave({
        ...form,
        image: nextImage,
        gallery: JSON.stringify(galleryItems),
      })
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Failed to save project')
    } finally {
      setIsUploading(false)
    }
  }

  /* ── Common fields ───────────────────────────────────────────────────── */

  const categoryField = (
    <Field label="Category">
      <select
        className={inputCls}
        value={form.category_id}
        onChange={(event) => set('category_id', event.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
    </Field>
  )

  const statusField = (
    <Field label="Status">
      <div
        role="radiogroup"
        aria-label="Project status"
        className="mt-1.5 grid grid-cols-2 gap-1.5"
      >
        {(['ongoing', 'done'] as const).map((status) => {
          const isActive = (form.status ?? 'done') === status
          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={isBusy}
              onClick={() => set('status', status)}
              className={`min-h-9 rounded-md border px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                isActive
                  ? 'border-ink bg-ink text-canvas'
                  : 'border-line bg-canvas text-graphite hover:border-deep-line'
              }`}
            >
              {status}
            </button>
          )
        })}
      </div>
    </Field>
  )

  const heroSection = (
    <div className="space-y-3">
      <Field label="Hero image">
        <input
          className={inputCls}
          value={form.image}
          onChange={(event) => {
            setPendingImage(null)
            setImagePreview(event.target.value || null)
            set('image', event.target.value)
          }}
          placeholder="/media/projects/... or https://…"
        />
      </Field>
      <MediaDropzone
        disabled={isBusy}
        label="Drop hero image"
        note="Single image, max 8 MB."
        onFilesSelected={(files) => {
          void handlePrimaryFiles(files)
        }}
      />
      {imagePreview ? (
        <div className="space-y-2">
          <img
            src={imagePreview}
            alt={`${form.title || 'Project'} hero`}
            className="aspect-[4/3] w-full rounded-[12px] border border-line object-cover"
          />
          <button type="button" onClick={clearImage} className={ghostBtn} disabled={isBusy}>
            Clear hero image
          </button>
        </div>
      ) : (
        <div className={`flex items-center justify-center ${panelCls} bg-paper p-3`}>
          <Placeholder
            label={form.title || 'Project preview'}
            className="aspect-[4/3] w-full rounded-[12px] border border-line"
          />
        </div>
      )}
    </div>
  )

  const gallerySection = (
    <div className="space-y-3">
      <Field label={`Gallery images${allGallery.length > 0 ? ` (${allGallery.length})` : ''}`}>
        <textarea
          className={inputCls}
          rows={3}
          value={galleryText}
          onChange={(event) => setGalleryText(event.target.value)}
          placeholder={'/media/projects/shot-01.webp\n/media/projects/shot-02.webp'}
        />
      </Field>
      <MediaDropzone
        disabled={isBusy}
        label="Drop additional images"
        multiple
        note="Append multiple images to the gallery."
        onFilesSelected={(files) => {
          void handleGalleryFiles(files)
        }}
      />
      {allGallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {allGallery.map((src, index) => (
            <figure key={`${src}-${index}`} className="group relative border border-line bg-paper p-1.5 pb-1">
              <div className="relative overflow-hidden bg-canvas">
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  disabled={isBusy}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-canvas text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
              <figcaption className="px-0.5 pt-1.5">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      {pendingGallery.length > 0 ? (
        <button type="button" onClick={() => { setPendingGallery([]); setGalleryPreviews([]) }} className={ghostBtn} disabled={isBusy}>
          Discard pending uploads
        </button>
      ) : null}
    </div>
  )

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${panelCls} bg-canvas p-4`}>
      {/* Header row */}
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Id">
          <input className={inputCls} value={form.id} onChange={(event) => set('id', event.target.value)} required />
        </Field>
        {categoryField}
        {statusField}
      </div>

      <Field label="Title">
        <input className={inputCls} value={form.title} onChange={(event) => set('title', event.target.value)} required />
      </Field>

      <Field label="Description">
        <textarea className={inputCls} rows={4} value={form.description ?? ''} onChange={(event) => set('description', event.target.value)} />
        <p className={`mt-2 text-sm leading-relaxed ${descriptionTooLong ? 'text-brand' : 'text-graphite'}`}>
          {descriptionWordCount}/{PROJECT_DESCRIPTION_MAX_WORDS} words
        </p>
      </Field>

      {isCreative ? (
        /* ── Creative layout: hero + gallery side by side ─────────────── */
        <div className="grid gap-3 xl:grid-cols-2">
          {heroSection}
          {gallerySection}
        </div>
      ) : (
        /* ── Programming layout: hero + role/stack/year ───────────────── */
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Role">
              <TagInput
                value={form.role ?? ''}
                onChange={(value) => set('role', value)}
                suggestions={ROLE_SUGGESTIONS}
                disabled={isBusy}
              />
            </Field>
            <Field label="Stack">
              <TechSelect
                value={form.stack ?? ''}
                onChange={(value) => set('stack', value)}
                techs={techs}
                disabled={isBusy}
              />
            </Field>
            <Field label="Year">
              <input className={inputCls} value={form.year ?? ''} onChange={(event) => set('year', event.target.value)} />
            </Field>
          </div>
          {heroSection}
          {gallerySection}
        </>
      )}

      {/* ── Media links (variant-aware) ─────────────────────────────────── */}
      {isCreative ? (
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="YouTube embed">
            <input className={inputCls} value={form.youtube_embed ?? ''} onChange={(event) => set('youtube_embed', event.target.value || null)} placeholder="https://www.youtube.com/embed/…" />
          </Field>
          <Field label="Instagram link">
            <input className={inputCls} value={form.instagram_link ?? ''} onChange={(event) => set('instagram_link', event.target.value || null)} />
          </Field>
          <Field label="Google Drive link">
            <input className={inputCls} value={form.google_drive_link ?? ''} onChange={(event) => set('google_drive_link', event.target.value || null)} />
          </Field>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Website link">
            <input className={inputCls} value={form.link ?? ''} onChange={(event) => set('link', event.target.value || null)} />
          </Field>
          <Field label="GitHub link">
            <input className={inputCls} value={form.source_link ?? ''} onChange={(event) => set('source_link', event.target.value || null)} />
          </Field>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        <button type="submit" className={primaryBtn} disabled={isBusy || descriptionTooLong}>
          {isBusy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className={ghostBtn} disabled={isBusy}>
          Cancel
        </button>
      </div>
    </form>
  )
}
