import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getAllSlugs, getPost } from '@/content/blog'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.seoTitle || `${post.titleBn} | ShipTickets.bd`,
    description: post.seoDescription || post.descriptionBn,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.secondaryKeywords,
    openGraph: { title: post.seoTitle || post.titleBn, description: post.seoDescription || post.descriptionBn, type: 'article', url: `https://www.shiptickets.bd/blog/${post.slug}`, images: [{ url: post.thumbnail, alt: post.imageAlt || post.titleBn }] },
  }
}

function renderBody(body: string) {
  const blocks = body.split('\n\n')
  return blocks.map((block, i) => {
    const lines = block.split('\n')
    if (lines[0].trim().startsWith('|')) {
      const rows = lines.filter((l) => l.trim().startsWith('|'))
      return (
        <div key={i} className="overflow-x-auto my-4">
          <table className="min-w-full border border-line-soft text-sm">
            <tbody>
              {rows.map((r, ri) => {
                const cells = r.split('|').map((c) => c.trim()).filter(Boolean)
                if (cells.every((c) => /^-+$/.test(c))) return null
                return (
                  <tr key={ri} className={ri === 0 ? 'bg-[#f5faf9] font-bold' : ''}>
                    {cells.map((c, ci) => <td key={ci} className="border border-line-soft px-3 py-2">{c}</td>)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
    if (lines.every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
      return (
        <ul key={i} className="list-disc pl-6 space-y-1 my-3">
          {lines.filter((l) => l.trim()).map((l, j) => <li key={j}>{l.trim().replace(/^[-*]\s*/, '')}</li>)}
        </ul>
      )
    }
    if (lines.every((l) => /^\d+\./.test(l.trim()))) {
      return (
        <ol key={i} className="list-decimal pl-6 space-y-1 my-3">
          {lines.filter((l) => l.trim()).map((l, j) => <li key={j}>{l.trim().replace(/^\d+\.\s*/, '')}</li>)}
        </ol>
      )
    }
    const text = block.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    return <p key={i} className="text-prose leading-7 my-3" dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
  })
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleBn,
    description: post.seoDescription || post.descriptionBn,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'ShipTickets.bd', url: 'https://www.shiptickets.bd', logo: { '@type': 'ImageObject', url: 'https://www.shiptickets.bd/og_image.png' } },
    image: `https://www.shiptickets.bd${post.thumbnail}`,
    mainEntityOfPage: `https://www.shiptickets.bd/blog/${post.slug}`,
    keywords: post.secondaryKeywords?.join(', '),
  }
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <nav className="text-sm text-quiet mb-4">
          <Link href="/" className="hover:text-brand-ink">Home</Link> / <Link href="/blog" className="hover:text-brand-ink">Blog</Link> / <span className="text-ink">{post.titleBn}</span>
        </nav>
        <div className="relative h-64 rounded-2xl overflow-hidden bg-[#dcefeb] mb-6">
          <Image src={post.thumbnail} alt={post.imageAlt || post.titleBn} fill className="object-cover" />
        </div>
        <h1 className="text-3xl font-black text-ink">{post.titleBn}</h1>
        <p className="mt-2 text-xs text-quiet">{post.date} · {post.author}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((t) => <span key={t} className="rounded-full bg-[#f5faf9] px-2.5 py-0.5 text-xs font-semibold text-brand-ink">{t}</span>)}
        </div>
        <article className="mt-6">
          {post.content.map((block, i) => (
            <section key={i} className="mb-6">
              {block.heading && <h2 className="text-xl font-black text-ink mb-2">{block.heading}</h2>}
              {renderBody(block.body)}
            </section>
          ))}
        </article>
        <div className="mt-8">
          <Link href="/blog" className="text-sm text-brand-ink">← ব্লগে ফিরুন</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}