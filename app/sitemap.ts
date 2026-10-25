import type { MetadataRoute } from 'next'
import { ships, site } from '@/lib/ships'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.shiptickets.bd'
  const lastModified = new Date(site.updatedAt)

  const staticPages: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/saint-martin-ship-ticket-price', changeFrequency: 'weekly', priority: .9 },
    { path: '/saint-martin-cabin-price', changeFrequency: 'weekly', priority: .85 },
    { path: '/saint-martin-ship-schedule', changeFrequency: 'weekly', priority: .9 },
    { path: '/saint-martin-travel-pass', changeFrequency: 'monthly', priority: .8 },
    { path: '/saint-martin-travel-rules', changeFrequency: 'monthly', priority: .8 },
    { path: '/saint-martin-ship', changeFrequency: 'weekly', priority: .8 },
    { path: '/saint-martin-guide', changeFrequency: 'monthly', priority: .8 },
    { path: '/routes/coxs-bazar-to-saint-martin', changeFrequency: 'monthly', priority: .8 },
    { path: '/about', changeFrequency: 'monthly', priority: .7 },
    { path: '/how-we-verify-information', changeFrequency: 'monthly', priority: .7 },
    { path: '/contact', changeFrequency: 'monthly', priority: .7 },
    { path: '/privacy-policy', changeFrequency: 'monthly', priority: .6 },
  ]

  return [
    ...staticPages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...ships.map((ship) => ({
      url: `${base}/saint-martin-ship/${ship.slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: .75,
    })),
  ]
}
