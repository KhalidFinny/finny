import { getRuntimeEnv } from '@/server/platform'

export async function getDb(): Promise<D1Database | null> {
  const env = await getRuntimeEnv()
  return env?.DB ?? null
}
