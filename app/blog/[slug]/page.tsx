import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FaqAccordion } from '@/components/faq-accordion'
import { getAllSlugs, getPost, blogPosts } from '@/content/blog'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.seoTitle || post.titleBn,
    description: post.seoDescription || post.descriptionBn,
    alternates: { canonical: `/blog/${post.slug}`, languages: { 'bn-BD': `/blog/${post.slug}`, 'x-default': `/blog/${post.slug}` } },
    keywords: post.secondaryKeywords,
    openGraph: { title: post.seoTitle || post.titleBn, description: post.seoDescription || post.descriptionBn, type: 'article', url: `https://www.shiptickets.bd/blog/${post.slug}`, siteName: 'ShipTickets.bd', locale: 'bn_BD', images: [{ url: post.thumbnail, alt: post.imageAlt || post.titleBn, width: 1200, height: 630 }], publishedTime: `${post.date}T08:00:00+06:00`, modifiedTime: `${post.date}T08:00:00+06:00` },
    twitter: { card: 'summary_large_image', title: post.seoTitle || post.titleBn, description: post.seoDescription || post.descriptionBn, images: [post.thumbnail] },
  }
}

function renderBody(body: string) {
  const lines = body.split('\n')
  const normalized: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '' && i > 0 && i < lines.length - 1 && lines[i - 1].trim().startsWith('|') && lines[i + 1].trim().startsWith('|')) continue
    normalized.push(lines[i])
  }
  // convert tab-separated tables to pipe tables
  const converted = normalized.map((l) => (l.includes('\t') ? `| ${l.split('\t').map((c) => c.trim()).join(' | ')} |` : l))
  const blocks = converted.join('\n').split('\n\n')
  return blocks.map((block, i) => {
    const lines = block.split('\n')
    if (lines[0].trim().startsWith('|')) {
      const rows = lines.filter((l) => l.trim().startsWith('|'))
      return (
        <div key={i} className="overflow-x-auto my-4 rounded-xl border border-line-soft">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#f5faf9]">
                {rows[0].split('|').map((c) => c.trim()).filter(Boolean).map((c, ci) => <th key={ci} className="border-b border-line-soft px-3 py-2 text-left font-bold">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, ri) => {
                const cells = r.split('|').map((c) => c.trim()).filter(Boolean)
                if (cells.length === 0) return null
                if (cells.every((c) => /^-+$/.test(c))) return null
                return (
                  <tr key={ri} className={ri % 2 ? 'bg-[#fafcfc]' : ''}>
                    {cells.map((c, ci) => <td key={ci} className="border-t border-line-soft px-3 py-2">{c}</td>)}
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
          {lines.filter((l) => l.trim()).map((l, j) => {
            const txt = l.trim().replace(/^[-*]\s*/, '').replace(/^\[ \]\s*/, '☐ ').replace(/^\[x\]\s*/i, '☑ ').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-ink underline">$1</a>')
            return <li key={j} dangerouslySetInnerHTML={{ __html: txt }} />
          })}
        </ul>
      )
    }
    if (lines.every((l) => /^\d+\./.test(l.trim()))) {
      return (
        <ol key={i} className="list-decimal pl-6 space-y-1 my-3">
          {lines.filter((l) => l.trim()).map((l, j) => {
            const txt = l.trim().replace(/^\d+\.\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-ink underline">$1</a>')
            return <li key={j} dangerouslySetInnerHTML={{ __html: txt }} />
          })}
        </ol>
      )
    }
    const html = block.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-ink underline">$1</a>')
    if (html.includes('### ') || html.includes('## ')) {
      return (
        <div key={i}>
          {html.split('\n').map((line, j) => {
            const t = line.trim()
            if (t.startsWith('### ')) return <h3 key={j} className="text-lg font-black text-ink mt-4 mb-1">{t.replace(/^###\s*/, '')}</h3>
            if (t.startsWith('## ')) return <h2 key={j} className="text-xl font-black text-ink mt-4 mb-1">{t.replace(/^##\s*/, '')}</h2>
            if (!t) return null
            return <p key={j} className="text-prose leading-7 my-2" dangerouslySetInnerHTML={{ __html: t }} />
          })}
        </div>
      )
    }
    return <p key={i} className="text-prose leading-7 my-3" dangerouslySetInnerHTML={{ __html: html.replace(/\n/g, '<br/>') }} />
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
    datePublished: `${post.date}T08:00:00+06:00`,
    dateModified: `${post.date}T08:00:00+06:00`,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'ShipTickets.bd', url: 'https://www.shiptickets.bd', logo: { '@type': 'ImageObject', url: 'https://www.shiptickets.bd/og_image.png' } },
    image: `https://www.shiptickets.bd${post.thumbnail}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.shiptickets.bd/blog/${post.slug}` },
    keywords: post.secondaryKeywords?.join(', '),
    inLanguage: 'bn-BD',
  }
  const faqJsonLd = post.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null
  const headings = post.content.map((b) => b.heading).filter(Boolean) as string[]
  const related = blogPosts.filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))).slice(0, 2)
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.shiptickets.bd/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.shiptickets.bd/blog' },
      { '@type': 'ListItem', position: 3, name: post.titleBn, item: `https://www.shiptickets.bd/blog/${post.slug}` },
    ],
  }
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
        <nav className="text-sm text-quiet mb-4">
          <Link href="/" className="hover:text-brand-ink">Home</Link> / <Link href="/blog" className="hover:text-brand-ink">Blog</Link> / <span className="text-ink">{post.titleBn}</span>
        </nav>
        <div className="relative h-64 rounded-2xl overflow-hidden bg-[#dcefeb] mb-6">
          <Image src={post.thumbnail} alt={post.imageAlt || post.titleBn} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
        <h1 className="text-3xl font-black text-ink">{post.titleBn}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-quiet">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.author}</span>
          {post.lastReviewed && <span className="rounded-full bg-[#f5faf9] px-3 py-1 font-semibold text-brand-ink">Last reviewed: <time dateTime={post.lastReviewed}>{post.lastReviewed}</time></span>}
        </div>
        {headings.length > 2 && (
          <nav className="toc my-4 rounded-xl border border-line-soft bg-[#f5faf9] p-4">
            <p className="text-xs font-black uppercase tracking-[.2em] text-brand-ink mb-2">Contents</p>
            <ul className="space-y-1 text-sm">
              {headings.map((h) => <li key={h}><a href={`#${h.replace(/\s+/g, '-')}`} className="text-brand-ink hover:underline">{h}</a></li>)}
            </ul>
          </nav>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((t) => <span key={t} className="rounded-full bg-[#f5faf9] px-2.5 py-0.5 text-xs font-semibold text-brand-ink">{t}</span>)}
        </div>
        <article className="mt-6">
          {post.content.map((block, i) => (
            <section key={i} className="mb-6">
              {block.heading && <h2 id={block.heading.replace(/\s+/g, '-')} className="text-xl font-black text-ink mb-2">{block.heading}</h2>}
              {renderBody(block.body)}
            </section>
          ))}
        </article>
        {post.faqs?.length ? <FaqAccordion items={post.faqs.map((f) => [f.q, f.a])} heading="FAQ" headingBn="সচরাচর জিজ্ঞাসিত প্রশ্ন" id="faq" /> : null}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-black text-ink mb-3">Related posts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="flex gap-3 rounded-xl border border-line-soft bg-white p-3 hover:shadow-card">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#dcefeb]">
                    <Image src={p.thumbnail} alt={p.titleBn} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-sm line-clamp-2">{p.titleBn}</h3>
                    <p className="mt-1 text-xs text-quiet">{p.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}