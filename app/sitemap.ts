import type { MetadataRoute } from 'next'
import { ships, site } from '@/lib/ships'
import { blogPosts } from '@/content/blog'
import { blogImage } from '@/lib/blog-helpers'
import { seatPhotoSrc } from '@/lib/seat-photos'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.shiptickets.bd'
  const lastModified = new Date(site.updatedAt)

  const staticPages: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; updated?: string }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1, updated: '2026-11-07' },
    { path: '/saint-martin-ship-ticket-price', changeFrequency: 'weekly', priority: .9, updated: '2026-11-06' },
    { path: '/saint-martin-cabin-price', changeFrequency: 'weekly', priority: .85, updated: '2026-11-06' },
    { path: '/cheapest-saint-martin-ship-ticket', changeFrequency: 'weekly', priority: .85, updated: '2026-11-06' },
    { path: '/saint-martin-trip-cost', changeFrequency: 'monthly', priority: .8, updated: '2026-11-06' },
    { path: '/routes/coxs-bazar-to-saint-martin-distance', changeFrequency: 'monthly', priority: .7, updated: '2026-11-06' },
    { path: '/saint-martin-ship-schedule', changeFrequency: 'weekly', priority: .9, updated: '2026-11-07' },
    { path: '/saint-martin-travel-pass', changeFrequency: 'monthly', priority: .8, updated: '2026-11-06' },
    { path: '/saint-martin-travel-rules', changeFrequency: 'monthly', priority: .8, updated: '2026-11-06' },
    { path: '/saint-martin-ship', changeFrequency: 'weekly', priority: .8, updated: '2026-11-07' },
    { path: '/saint-martin-guide', changeFrequency: 'monthly', priority: .8, updated: '2026-11-06' },
    { path: '/routes/coxs-bazar-to-saint-martin', changeFrequency: 'monthly', priority: .8, updated: '2026-11-07' },
    { path: '/about', changeFrequency: 'monthly', priority: .7, updated: '2026-11-06' },
    { path: '/how-we-verify-information', changeFrequency: 'monthly', priority: .7, updated: '2026-11-06' },
    { path: '/contact', changeFrequency: 'monthly', priority: .7, updated: '2026-11-07' },
    { path: '/privacy-policy', changeFrequency: 'monthly', priority: .6, updated: '2026-11-07' },
    { path: '/booking-policy', changeFrequency: 'monthly', priority: .6, updated: '2026-11-07' },
  ]

  return [
    ...staticPages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified: page.updated ? new Date(page.updated) : lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...ships.map((ship) => ({
      url: `${base}/saint-martin-ship/${ship.slug}`,
      images: [ship.image, ...[...ship.ticketClasses, ...ship.cabins].map((item) => seatPhotoSrc(ship.slug, item.name))].filter((src): src is string => Boolean(src)).map((src) => `${base}${src}`),
      lastModified: ship.pageUpdated ? new Date(ship.pageUpdated) : lastModified,
      changeFrequency: 'weekly' as const,
      priority: .75,
    })),
    { url: `${base}/blog`, lastModified: new Date(blogPosts.map((post) => post.updated ?? post.date).sort().at(-1) ?? site.updatedAt), changeFrequency: 'weekly', priority: .8 },
    ...blogPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      images: blogImage(post) ? [`${base}${blogImage(post)}`] : undefined,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: 'monthly' as const,
      priority: .7,
    })),
  ]
}
