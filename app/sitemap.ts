import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.shiptickets.bd'
  const lastModified = new Date('2026-09-22')
  return [
    { url: base, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/saint-martin-ship-ticket-price`, lastModified, changeFrequency: 'weekly', priority: .9 },
    { url: `${base}/saint-martin-ship-schedule`, lastModified, changeFrequency: 'weekly', priority: .9 },
    { url: `${base}/saint-martin-travel-pass`, lastModified, changeFrequency: 'monthly', priority: .8 },
    { url: `${base}/saint-martin-travel-rules`, lastModified, changeFrequency: 'monthly', priority: .8 },
    { url: `${base}/saint-martin-ship`, lastModified, changeFrequency: 'weekly', priority: .8 },
    { url: `${base}/saint-martin-ship/keari-sindbad`, lastModified, changeFrequency: 'weekly', priority: .75 },
    { url: `${base}/saint-martin-ship/keari-cruise-dine`, lastModified, changeFrequency: 'weekly', priority: .75 },
    { url: `${base}/saint-martin-ship/bay-cruiser-1`, lastModified, changeFrequency: 'weekly', priority: .75 },
    { url: `${base}/saint-martin-ship/karnafuly-express`, lastModified, changeFrequency: 'weekly', priority: .75 },
    { url: `${base}/saint-martin-ship/baro-awlia`, lastModified, changeFrequency: 'weekly', priority: .75 },
    { url: `${base}/saint-martin-guide`, lastModified, changeFrequency: 'monthly', priority: .8 },
    { url: `${base}/routes/coxs-bazar-to-saint-martin`, lastModified, changeFrequency: 'monthly', priority: .8 },
  ]
}
