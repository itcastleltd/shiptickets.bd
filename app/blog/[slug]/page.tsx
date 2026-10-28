import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSlugs, getPost } from '@/content/blog'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.titleBn} | ShipTickets.bd`,
    description: post.descriptionBn,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.titleBn, description: post.descriptionBn, type: 'article', url: `https://www.shiptickets.bd/blog/${post.slug}` },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleBn,
    description: post.descriptionBn,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'ShipTickets.bd', url: 'https://www.shiptickets.bd' },
    mainEntityOfPage: `https://www.shiptickets.bd/blog/${post.slug}`,
  }
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="text-sm text-brand-ink">← ব্লগ</Link>
      <h1 className="mt-4 text-3xl font-black text-ink">{post.titleBn}</h1>
      <p className="mt-2 text-xs text-quiet">{post.date}</p>
      <article className="mt-6 space-y-6">
        {post.content.map((block, i) => (
          <section key={i}>
            {block.heading && <h2 className="text-xl font-black text-ink mb-2">{block.heading}</h2>}
            {block.paragraphs.map((para, j) => (
              <p key={j} className="text-prose leading-7 mb-3">{para}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )
}
