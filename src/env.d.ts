// Merges into the generated Cloudflare types (worker-configuration.d.ts).
// These keys live as secrets (wrangler secret put) — optional here so
// typecheck survives regenerating worker-configuration.d.ts, which no longer
// lists them once they leave wrangler.jsonc "vars".

interface Env {
  WORKER_SECRET?: string
  LASTFM_API_KEY?: string
  LASTFM_USER?: string
}

declare namespace Cloudflare {
  interface Env {
    WORKER_SECRET?: string
    LASTFM_API_KEY?: string
    LASTFM_USER?: string
  }
}
