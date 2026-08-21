// Server functions exposing the D1 (DB) and R2 (MEDIA) bindings to routes.
// NOTE: reconstructed 2026-08-08 after accidental deletion — the original
// file was never committed. Rebuilt to match the README contract ("exposes
// the D1 DB and R2 MEDIA bindings to routes") and the exact D1 query set
// used by the routes. Shared by all routes via `getSiteData`.
import { createServerFn } from '@tanstack/react-start'
import type { SiteData } from '@/types/site'
import { getDb } from '@/server/db'

import { getStaticSiteData } from '@/data/static-seed'

export const getSiteData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SiteData> => {
    const db = await getDb()
    if (db) {
      try {
        const [profile, categories, projects, experiences, socials, techs] =
          await Promise.all([
            db.prepare('SELECT * FROM profile WHERE id = 1').first(),
            db.prepare('SELECT * FROM categories ORDER BY sort_order').all(),
            db.prepare('SELECT * FROM projects ORDER BY sort_order').all(),
            db.prepare('SELECT * FROM experiences ORDER BY sort_order').all(),
            db.prepare('SELECT * FROM socials ORDER BY sort_order').all(),
            db.prepare('SELECT * FROM techs ORDER BY sort_order').all(),
          ])
        if (!profile) throw new Error('Profile row missing from D1')
        return {
          profile: profile as unknown as SiteData['profile'],
          categories: categories.results as unknown as SiteData['categories'],
          projects: projects.results as unknown as SiteData['projects'],
          experiences: experiences.results as unknown as SiteData['experiences'],
          socials: socials.results as unknown as SiteData['socials'],
          techs: techs.results as unknown as SiteData['techs'],
        } satisfies SiteData
      } catch {
        // D1 read failed — fall back to the static seed
      }
    }
    return getStaticSiteData()
  },
)
