const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

export const dynamic = 'force-static'

export default function sitemap() {
  if (!siteUrl) return []
  return [{ url: siteUrl, lastModified: new Date('2026-09-06'), changeFrequency: 'weekly', priority: 1 }]
}
