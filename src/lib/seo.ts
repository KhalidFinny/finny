import { ogImages } from '@/generated/ogImage'

export const SITE_URL = 'https://fiinnyy.my.id'
export const SITE_NAME = "Khalid's Garage"

type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

type PageHeadInput = {
  title: string
  description: string
  image: keyof typeof ogImages
  path: string
  // The router dedupes meta tags but not links, so only leaf routes emit the
  // canonical to avoid two <link rel="canonical"> on a page.
  canonical?: boolean
}

// One source for a page's share metadata: canonical URL, Open Graph, and
// Twitter card all point at the page's own card and URL.
export function buildPageHead({
  title,
  description,
  image,
  path,
  canonical = true,
}: PageHeadInput) {
  const url = `${SITE_URL}${path}`
  const imageUrl = `${SITE_URL}${ogImages[image]}`

  const meta: MetaEntry[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  return {
    meta,
    links: canonical ? [{ rel: 'canonical', href: url }] : [],
  }
}
