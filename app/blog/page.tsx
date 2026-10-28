import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { blogPosts } from '@/content/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'সেন্টমার্টিন ভ্রমণ, জাহাজের টিকিট, রুট ও নিয়ম নিয়ে বাংলা ব্লগ পোস্ট।',
  alternates: { canonical: '/blog' },
  openGraph: { title: 'Blog | ShipTickets.bd', description: 'সেন্টমার্টিন ভ্রমণ, জাহাজের টিকিট, রুট ও নিয়ম নিয়ে বাংলা ব্লগ পোস্ট।', type: 'website', url: 'https://www.shiptickets.bd/blog', siteName: 'ShipTickets.bd', locale: 'bn_BD', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'Blog | ShipTickets.bd', description: 'সেন্টমার্টিন ভ্রমণ, জাহাজের টিকিট, রুট ও নিয়ম নিয়ে বাংলা ব্লগ পোস্ট।', images: ['/og_image.png'] },
}

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-3xl font-black text-ink mb-2">Blog / ব্লগ</h1>
      <p className="text-quiet mb-8">সেন্টমার্টিন ভ্রমণ, টিকিট ও নিয়ম নিয়ে বাংলা পোস্ট।</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((p) => (
          <article key={p.slug} className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
            <Link href={`/blog/${p.slug}`}>
              <div className="relative h-44 bg-[#dcefeb]">
                <Image src={p.thumbnail} alt={p.titleBn} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
            </Link>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-[#f5faf9] px-2.5 py-0.5 text-xs font-semibold text-brand-ink">{t}</span>
                ))}
              </div>
              <h2 className="text-lg font-black text-ink">
                <Link href={`/blog/${p.slug}`} className="hover:text-brand-ink">{p.titleBn}</Link>
              </h2>
              <p className="mt-2 text-sm text-quiet line-clamp-3">{p.descriptionBn}</p>
              <p className="mt-3 text-xs text-quiet">{p.date}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
      <Footer />
    </>
  )
}