import type { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, Clock, MessageCircle, RefreshCw, Share2, ShieldCheck, Ship, Zap } from 'lucide-react'
import { BackToTop } from '@/components/BackToTop'
import { BlogBody } from '@/components/blog/blog-body'
import { BlogCard, BlogCover } from '@/components/blog/blog-cards'
import { BlogReadingNav, BlogSideToc, CopyLinkButton, ReadingProgress } from '@/components/blog/blog-reading'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Schema, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { HtmlLang } from '@/components/html-lang'
import { blogPosts, getAllSlugs, getPost } from '@/content/blog'
import { banglaDate, blogImage, modifiedISO, newestFirst, readingMinutes, splitQuickAnswer, toBanglaDigits, topicLabel, wordCount } from '@/lib/blog-helpers'
import { WHATSAPP_NUMBER, ships } from '@/lib/ships'

const BASE = 'https://www.shiptickets.bd'
const headingId = (heading: string) => heading.replace(/\s+/g, '-')

/** Only the posts in content/blog.ts exist. Any other address returns a real 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const title = post.seoTitle || post.titleBn
  const description = post.seoDescription || post.descriptionBn
  const url = `${BASE}/blog/${post.slug}`
  return {
    title: `${title} | ShipTickets.bd`.length > 60 ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    keywords: [post.primaryKeyword, ...(post.secondaryKeywords ?? [])].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'ShipTickets.bd',
      locale: 'bn_BD',
      images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: post.titleBn }],
      publishedTime: `${post.date}T08:00:00+06:00`,
      modifiedTime: `${modifiedISO(post)}T08:00:00+06:00`,
      authors: [BASE],
      section: topicLabel(post),
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph.jpg'] },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const url = `${BASE}/blog/${post.slug}`
  const image = blogImage(post) ?? '/opengraph.jpg'
  const { quick, content } = splitQuickAnswer(post)
  const headings = content.map((block) => block.heading).filter(Boolean) as string[]

  const sameTopic = blogPosts.filter((other) => other.slug !== post.slug && other.tags.some((tag) => post.tags.includes(tag)))
  const others = newestFirst(blogPosts).filter((other) => other.slug !== post.slug && !sameTopic.includes(other))
  const related = [...sameTopic, ...others].slice(0, 3)

  const shareText = encodeURIComponent(`${post.titleBn} ${url}`)
  const help = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I want to check a Saint Martin ship ticket for my travel date.')}`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      siteSchema,
      websiteSchema,
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.titleBn,
        alternativeHeadline: post.title,
        description: post.seoDescription || post.descriptionBn,
        datePublished: `${post.date}T08:00:00+06:00`,
        dateModified: `${modifiedISO(post)}T08:00:00+06:00`,
        author: { '@type': 'Organization', name: 'ShipTickets.bd', url: BASE },
        publisher: { '@id': `${BASE}/#organization` },
        image: `${BASE}${image}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        isPartOf: { '@id': `${BASE}/blog#blog` },
        articleSection: topicLabel(post),
        keywords: [post.primaryKeyword, ...(post.secondaryKeywords ?? [])].filter(Boolean).join(', '),
        wordCount: wordCount(post),
        inLanguage: 'bn-BD',
        about: { '@type': 'Place', name: "Saint Martin's Island, Bangladesh" },
      },
      breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: post.titleBn }]),
      ...(post.faqs?.length ? [faqSchema(post.faqs.map((faq) => [faq.q, faq.a] as [string, string]))] : []),
    ],
  }

  const contents = [
    ...headings.map((heading) => ({ id: headingId(heading), label: heading })),
    ...(post.faqs?.length ? [{ id: 'faq', label: 'সচরাচর জিজ্ঞাসিত প্রশ্ন' }] : []),
  ]
  const ordered = newestFirst(blogPosts)
  const position = ordered.findIndex((other) => other.slug === post.slug)
  const newer = ordered[position - 1]
  const older = ordered[position + 1]
  const lowestFare = Math.min(...ships.map((ship) => Number(ship.oneWay.replace(/[^0-9]/g, ''))).filter(Boolean))

  return (
    <>
      <Header />
      <main id="main" lang="bn" className="bg-white text-ink">
        <HtmlLang lang="bn" />
        <Schema data={schema} />
        <ReadingProgress targetId="post-article" />

        <header className="border-b border-line-soft bg-[#f7fbfa]">
          <div className="mx-auto max-w-6xl px-5 pb-8 pt-5 md:pb-10">
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog' }]} />
            <p className="mt-4 text-sm font-bold text-brand-ink">{topicLabel(post)}</p>
            <h1 className="t-display mt-1.5 max-w-4xl text-[clamp(1.75rem,1.2rem+2.3vw,2.75rem)] leading-[1.25] tracking-normal text-ink">{post.titleBn}</h1>
            <p className="t-lede mt-3 max-w-3xl text-prose">{post.descriptionBn}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-quiet">
              <span className="inline-flex items-center gap-2 font-bold text-ink">
                <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-brand-ink text-white"><Ship size={16} /></span>
                ShipTickets.bd টিম
              </span>
              <span className="inline-flex items-center gap-1.5"><Calendar size={15} aria-hidden="true" /> <time dateTime={post.date}>{banglaDate(post.date)}</time></span>
              <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden="true" /> {toBanglaDigits(readingMinutes(post))} মিনিটে পড়ুন</span>
              {modifiedISO(post) !== post.date && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e4f2ee] px-3 py-1 font-bold text-[#1d5c4b]"><RefreshCw size={13} aria-hidden="true" /> হালনাগাদ <time dateTime={modifiedISO(post)}>{banglaDate(modifiedISO(post))}</time></span>}
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:py-10">
          <div id="post-article" className="min-w-0">
            {headings.length > 2 && <BlogReadingNav items={contents} />}
            {quick && (
              <section aria-label="সংক্ষেপে উত্তর" className="rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-6">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-brand-ink"><Zap size={18} aria-hidden="true" /> সংক্ষেপে উত্তর</h2>
                <div className="mt-1 text-[1.0625rem] font-medium leading-[1.85] text-ink [&>p]:my-1"><BlogBody body={quick} /></div>
              </section>
            )}

            {blogImage(post) && <BlogCover post={post} priority sizes="(min-width: 1024px) 760px, 100vw" className="mt-6 aspect-[16/9] rounded-3xl" />}

            <article className="mt-8 text-[1.0625rem] leading-[1.9] text-prose">
              {content.map((block, index) => (
                <Fragment key={index}>
                  <section className={index > 0 ? 'mt-9 border-t border-line-soft pt-8' : ''}>
                    {block.heading && <h2 id={headingId(block.heading)} className="mb-3 scroll-mt-28 text-[1.5rem] font-extrabold leading-snug text-ink md:text-[1.75rem]">{block.heading}</h2>}
                    <BlogBody body={block.body} />
                  </section>
                  {index === 1 && content.length > 3 && (
                    <aside aria-label="টিকেট" className="mt-8 flex flex-col gap-4 rounded-3xl bg-[#0d1b2a] p-5 text-white sm:flex-row sm:items-center sm:justify-between md:p-6">
                      <div>
                        <p className="text-lg font-extrabold leading-snug">যাত্রার তারিখ ঠিক করেছেন?</p>
                        <p className="t-small mt-1 text-on-dark">একমুখী ভাড়া {toBanglaDigits(`৳${lowestFare.toLocaleString('en-US')}`)} থেকে। আপনার তারিখের ভাড়া ও সিট আমরা জানিয়ে দেব।</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <ContactLink href={help} kind="whatsapp" eventLabel="blog_inline" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover">
                          <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                        </ContactLink>
                        <Link href="/saint-martin-ship" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-4 text-sm font-extrabold transition-colors hover:bg-white/10">জাহাজ দেখুন</Link>
                      </div>
                    </aside>
                  )}
                </Fragment>
              ))}
            </article>

            {post.sources?.length ? (
              <section className="mt-8 rounded-2xl border border-line-soft p-5">
                <h2 className="text-base font-extrabold text-ink">তথ্যের উৎস</h2>
                <ul className="t-small mt-2 list-disc space-y-1 pl-5 text-prose">
                  {post.sources.map((source) => (
                    <li key={source.label}>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-ink underline underline-offset-2">{source.label}</a> : source.label}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="mt-8 flex gap-3 rounded-2xl bg-[#f7fbfa] p-5">
              <ShieldCheck size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-ink" />
              <div className="t-small text-prose">
                <p>
                  লিখেছে ShipTickets.bd টিম। ShipTickets.bd পরিচালনা করে <a href="https://www.tripzic.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-ink underline underline-offset-2">Tripzic</a>। আমরা <Link href="/how-we-verify-information" className="font-semibold text-brand-ink underline underline-offset-2">কীভাবে তথ্য যাচাই করি</Link> তা দেখুন।
                  {post.lastReviewed && <> শেষ যাচাই: {new Date(`${post.lastReviewed} UTC`).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}।</>}
                </p>
                <p className="mt-1">ভাড়া ও সরকারি নিয়ম বদলাতে পারে, তাই পেমেন্টের আগে আপনার তারিখের তথ্য জেনে নিন।</p>
              </div>
            </section>

            {post.faqs?.length ? <div className="mt-8 [&_#faq]:scroll-mt-28"><FaqAccordion items={post.faqs.map((faq) => [faq.q, faq.a] as [string, string])} heading="সচরাচর জিজ্ঞাসিত প্রশ্ন" id="faq" /></div> : null}

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink"><Share2 size={16} aria-hidden="true" /> শেয়ার করুন:</span>
              <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-bold text-ink transition-colors hover:border-brand-ink hover:text-brand-ink">WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-bold text-ink transition-colors hover:border-brand-ink hover:text-brand-ink">Facebook</a>
              <CopyLinkButton url={url} />
            </div>

            {(newer || older) && (
              <nav aria-label="আরও লেখা" className="mt-8 grid gap-3 sm:grid-cols-2">
                {older ? (
                  <Link href={`/blog/${older.slug}`} className="group flex flex-col gap-1 rounded-2xl border border-line-soft p-4 transition duration-200 hover:border-brand-ink hover:shadow-card">
                    <span className="inline-flex items-center gap-1 text-[0.8125rem] font-bold text-quiet"><ArrowLeft size={14} aria-hidden="true" /> আগের লেখা</span>
                    <span className="font-bold leading-snug text-ink group-hover:text-brand-ink">{older.titleBn}</span>
                  </Link>
                ) : <span className="hidden sm:block" />}
                {newer && (
                  <Link href={`/blog/${newer.slug}`} className="group flex flex-col gap-1 rounded-2xl border border-line-soft p-4 text-right transition duration-200 hover:border-brand-ink hover:shadow-card">
                    <span className="inline-flex items-center justify-end gap-1 text-[0.8125rem] font-bold text-quiet">পরের লেখা <ArrowRight size={14} aria-hidden="true" /></span>
                    <span className="font-bold leading-snug text-ink group-hover:text-brand-ink">{newer.titleBn}</span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          <aside aria-label="এই লেখা ও টিকেট" className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {headings.length > 2 && <BlogSideToc items={contents} />}
              <div className="rounded-2xl bg-[#0d1b2a] p-5 text-white">
                <p className="font-extrabold">টিকেট লাগবে?</p>
                <p className="t-small mt-1 text-on-dark">যাত্রার তারিখ জানান, আমরা ভাড়া ও সিট আছে কি না জানিয়ে দেব।</p>
                <ContactLink href={help} kind="whatsapp" eventLabel="blog_sidebar" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover">
                  <MessageCircle size={17} aria-hidden="true" /> WhatsApp-এ জানুন
                </ContactLink>
              </div>
            </div>
          </aside>
        </div>

        <section className="border-t border-line-soft bg-[#f7fbfa]">
          <div className="mx-auto max-w-6xl px-5 py-10">
            <p className="t-title mb-4">জাহাজ ধরে ভাড়া দেখুন</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {ships.map((ship) => (
                <Link key={ship.slug} href={`/saint-martin-ship/${ship.slug}`} className="flex min-h-14 flex-col justify-center rounded-2xl border border-line-soft bg-white px-4 py-2.5 transition duration-200 hover:border-brand-ink hover:shadow-card">
                  <span className="font-bold leading-snug text-ink">{ship.nameBn}</span>
                  <span className="text-sm font-semibold text-brand-ink">একমুখী {toBanglaDigits(ship.oneWay)} থেকে</span>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <h2 className="t-title">আরও পড়ুন</h2>
              <Link href="/blog" className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-extrabold text-brand-ink hover:underline">সব লেখা <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => <BlogCard key={other.slug} post={other} headingAs="p" showSummary={false} />)}
            </div>
          </div>
        </section>
      </main>
      <div className="hidden lg:block"><BackToTop /></div>
      <Footer />
    </>
  )
}
