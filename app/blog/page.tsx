import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/content/blog'

export const metadata: Metadata = {
  title: 'Blog | ShipTickets.bd',
  description: 'সেন্টমার্টিন ভ্রমণ, জাহাজের টিকিট, রুট ও নিয়ম নিয়ে বাংলা ব্লগ পোস্ট।',
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-black text-ink mb-6">Blog / ব্লগ</h1>
      <ul className="space-y-6">
        {blogPosts.map((p) => (
          <li key={p.slug} className="rounded-2xl border border-line-soft bg-white p-5 shadow-card">
            <h2 className="text-xl font-black text-ink">
              <Link href={`/blog/${p.slug}`} className="hover:text-brand-ink">{p.titleBn}</Link>
            </h2>
            <p className="mt-2 text-sm text-quiet">{p.descriptionBn}</p>
            <p className="mt-2 text-xs text-quiet">{p.date}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
