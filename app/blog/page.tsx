import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { BlogCard, BlogCover, PostMeta } from '@/components/blog/blog-cards'
import { BlogTopicFilter } from '@/components/blog/blog-topic-filter'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { HtmlLang } from '@/components/html-lang'
import { ContactLink } from '@/components/contact-link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Schema, breadcrumbSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { blogPosts } from '@/content/blog'
import { TOPICS, modifiedISO, newestFirst, photosFirst, postTopic, toBanglaDigits, topicLabel } from '@/lib/blog-helpers'
import { WHATSAPP_NUMBER, ships } from '@/lib/ships'

const title = 'সেন্টমার্টিন ভ্রমণ ব্লগ ২০২৬–২৭: জাহাজ, ভাড়া ও নিয়ম'
const description = 'সেন্টমার্টিন জাহাজের ভাড়া, এখন কোন জাহাজ চলছে, টিকেট বুকিং, ট্রাভেল পাস, রাত্রিযাপন ও ভ্রমণ খরচ নিয়ে সর্বশেষ বাংলা গাইড।'
const url = 'https://www.shiptickets.bd/blog'
/** The post shown large at the top. Change this when there is bigger news. */
const FEATURED_SLUG = 'saint-martin-ship-status-2026-27'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url, types: { 'application/rss+xml': 'https://www.shiptickets.bd/rss.xml' } },
  openGraph: { title, description, type: 'website', url, siteName: 'ShipTickets.bd', locale: 'bn_BD', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'ShipTickets.bd সেন্টমার্টিন ভ্রমণ ব্লগ' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/opengraph.jpg'] },
}

export default function BlogIndex() {
  const posts = photosFirst(newestFirst(blogPosts))
  const featured = posts.find((post) => post.slug === FEATURED_SLUG) ?? posts[0]
  const rest = posts.filter((post) => post.slug !== featured.slug)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      siteSchema,
      websiteSchema,
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        name: title,
        description,
        url,
        inLanguage: 'bn-BD',
        publisher: { '@id': 'https://www.shiptickets.bd/#organization' },
        blogPost: posts.map((post) => ({ '@type': 'BlogPosting', headline: post.titleBn, url: `${url}/${post.slug}`, datePublished: post.date, dateModified: modifiedISO(post) })),
      },
      breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Blog' }]),
    ],
  }

  return (
    <>
      <Header />
      <main id="main" lang="bn" className="bg-[#f7fbfa] text-ink">
        <HtmlLang lang="bn" />
        <Schema data={schema} />
        <section className="border-b border-line-soft bg-white">
          <div className="mx-auto max-w-7xl px-5 pb-8 pt-5 md:pb-10">
            <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Blog' }]} />
            <h1 className="t-display mt-4 max-w-3xl text-[clamp(1.85rem,1.3rem+2.4vw,3rem)] text-ink">সেন্টমার্টিন যাওয়ার আগে যা জানা দরকার</h1>
            <p className="t-lede mt-3 max-w-2xl text-prose">জাহাজের ভাড়া, এখন কোন জাহাজ চলছে, টিকেট বুকিং, ট্রাভেল পাস ও ভ্রমণ খরচ নিয়ে সহজ বাংলা গাইড।</p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
          <article className="group mb-8 grid overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card transition duration-200 hover:shadow-raised lg:grid-cols-2 [&>*]:min-w-0">
            <Link href={`/blog/${featured.slug}`} tabIndex={-1} aria-hidden="true" className="block min-w-0">
              <BlogCover post={featured} priority sizes="(min-width: 1024px) 620px, 100vw" className="aspect-[16/9] w-full lg:aspect-auto lg:h-full lg:min-h-80" />
            </Link>
            <div className="flex flex-col justify-center p-6 md:p-9">
              <p className="text-sm font-bold text-brand-ink">সর্বশেষ লেখা · {topicLabel(featured)}</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-snug text-ink md:text-3xl">
                <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-brand-ink">{featured.titleBn}</Link>
              </h2>
              <p className="t-body mt-3 text-prose">{featured.descriptionBn}</p>
              <div className="mt-4"><PostMeta post={featured} /></div>
              <Link href={`/blog/${featured.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-1.5 self-start font-extrabold text-brand-ink hover:underline">
                পুরো লেখা পড়ুন <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>

          <h2 className="t-title mb-4">সব লেখা</h2>
          <BlogTopicFilter topics={TOPICS}>
            {rest.map((post) => <div key={post.slug} data-topic={postTopic(post)} className="h-full"><BlogCard post={post} /></div>)}
          </BlogTopicFilter>

          <section className="mt-12 rounded-3xl bg-[#0d1b2a] p-6 text-white md:p-9">
            <h2 className="t-title">জাহাজ ধরে ভাড়া দেখুন</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ships.map((ship) => (
                <Link key={ship.slug} href={`/saint-martin-ship/${ship.slug}`} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-white/20 px-4 py-2.5 transition-colors hover:bg-white/10">
                  <span className="min-w-0">
                    <span className="block font-bold leading-snug">{ship.nameBn}</span>
                    <span className="block text-sm text-on-dark">একমুখী {toBanglaDigits(ship.oneWay)} থেকে</span>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" className="shrink-0" />
                </Link>
              ))}
              <ContactLink href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I want to book a Saint Martin ship ticket.')}`} kind="whatsapp" eventLabel="blog_index" className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand-ink px-4 py-2.5 font-extrabold transition-colors hover:bg-brand-ink-hover">
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp-এ টিকেট জানুন
              </ContactLink>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
