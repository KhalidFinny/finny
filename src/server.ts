import start, { createServerEntry } from '@tanstack/react-start/server-entry'
import { getMediaBucket } from '@/server/media'

const MEDIA_PREFIX = '/media/'

async function handleMediaRequest(request: Request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    })
  }

  const url = new URL(request.url)
  const rawKey = url.pathname.slice(MEDIA_PREFIX.length)
  if (!rawKey) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const bucket = await getMediaBucket()
    if (!bucket) {
      return new Response('Media storage unavailable', { status: 503 })
    }

    // Try the key as-is first (clean paths), then the decoded form (legacy
    // %2F-encoded paths) — tolerates whatever the server/browser normalized.
    let key = rawKey
    try {
      key = decodeURIComponent(rawKey)
    } catch {
      // malformed escape — keep raw
    }

    const object = await bucket.get(key)
    if (!object) {
      return new Response('Not found', { status: 404 })
    }

    const headers = new Headers()
    if (object.httpMetadata?.contentType) {
      headers.set('content-type', object.httpMetadata.contentType)
    }
    headers.set('etag', object.httpEtag)
    headers.set('cache-control', 'public, max-age=31536000, immutable')
    headers.set('x-content-type-options', 'nosniff')
    headers.set('content-security-policy', "default-src 'none'")

    return new Response(request.method === 'HEAD' ? null : object.body, {
      status: 200,
      headers,
    })
  } catch {
    return new Response('Media request failed', { status: 500 })
  }
}

export default createServerEntry({
  async fetch(...args) {
    const request = args[0] as Request
    const url = new URL(request.url)

    if (url.pathname.startsWith(MEDIA_PREFIX)) {
      return handleMediaRequest(request)
    }

    return start.fetch(...args)
  },
})
