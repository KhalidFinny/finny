import type { PlatformProxy } from 'wrangler'

type RuntimeEnv = Env & { MEDIA?: R2Bucket }
type WranglerModule = {
  getPlatformProxy: () => Promise<PlatformProxy<RuntimeEnv>>
}

let platformPromise: Promise<RuntimeEnv> | null = null

export async function getRuntimeEnv(): Promise<RuntimeEnv | null> {
  try {
    const cf = await import('cloudflare:workers')
    return cf.env as RuntimeEnv
  } catch {
    // Node-based dev/preview falls through to Wrangler's local platform proxy.
  }

  try {
    platformPromise ??= (async () => {
      const WRANGLER_MODULE = 'wrangler'
      const wranglerModule = (await import(/* @vite-ignore */ WRANGLER_MODULE)) as WranglerModule
      const { env } = await wranglerModule.getPlatformProxy()
      return env
    })()

    return await platformPromise
  } catch {
    platformPromise = null
    return null
  }
}
