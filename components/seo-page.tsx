import Link from 'next/link'
import { Children, isValidElement } from 'react'
import { ArrowRight, CalendarCheck, Check, Star } from 'lucide-react'
import { site, WHATSAPP_NUMBER, LAST_REVIEWED, getBusinessRating, getReviewsForShip, type Ship } from '@/lib/ships'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackToTop } from '@/components/BackToTop'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { SeasonBar } from '@/components/season-bar'

const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=`

/**
  * Business rating chip.
  *
  * Renders nothing until `businessRating` in content/site.json holds a real
  * rating and review count. An aggregateRating in the markup is only legitimate
  * if the same number is visible to the visitor, so the chip and the schema
  * read the same value.
  */
export function RatingChip({ updated }: { updated: string }) {
  const rating = getBusinessRating()

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-soft bg-[#f1f8f6] px-3 py-1 text-[0.8125rem] font-semibold text-prose sm:text-sm">
        <CalendarCheck size={15} className="shrink-0 text-brand" aria-hidden="true" />
        Information last reviewed: {updated}
      </p>
      {rating && (
        <p className="inline-flex items-center gap-1.5 rounded-full border border-[#f3d9bf] bg-[#fff8ee] px-3 py-1.5 text-sm font-bold text-[#8a5a2f]">
          <Star size={15} className="fill-[#ef9f27] text-[#ef9f27]" aria-hidden="true" />
          <span className="sr-only">Customer rating </span>
          {rating.ratingValue.toFixed(1)} out of 5
          <span className="font-semibold text-warm">from {rating.reviewCount.toLocaleString('en-US')} reviews</span>
        </p>
      )}
      {!rating && site.googleReviewsUrl && (
        <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#f3d9bf] bg-[#fff8ee] px-3 py-1 text-sm font-bold text-[#8a5a2f] transition-colors hover:border-[#8a5a2f]">
          <Star size={15} className="shrink-0 fill-[#ef9f27] text-[#ef9f27]" aria-hidden="true" />
          Read our reviews on Google
        </a>
      )}
    </div>
  )
}

const BENGALI = /[\u0980-\u09FF]/

/**
 * Page eyebrow, with the Bengali half marked up separately.
 *
 * Every eyebrow mixes English with a Bengali word ("Ship directory · জাহাজ").
 * Rendered as one string, both halves inherited `.t-label`'s 0.14em tracking,
 * which is fine for the English but visibly breaks the Bengali conjuncts. The
 * Bengali segment is wrapped in a `lang="bn"` span with tracking neutralised, so
 * screen readers switch voice and the script is set correctly.
 */
export function Eyebrow({ text }: { text: string }) {
  const separator = text.indexOf('·')
  if (separator === -1) {
    return BENGALI.test(text)
      ? <span lang="bn" className="bn">{text}</span>
      : <>{text}</>
  }
  const english = text.slice(0, separator)
  const bengali = text.slice(separator + 1).trim()
  return (
    <>
      {english}
      {' · '}
      <span lang="bn" className="bn">{bengali}</span>
    </>
  )
}

export function SeoPage({ eyebrow, title, intro, updated = LAST_REVIEWED, crumbs, canonical, modifiedISO, hero, mobileBar, backToTopDesktopOnly, children }: { eyebrow: string; title: string; intro: string; updated?: string; crumbs?: Crumb[]; canonical?: string; modifiedISO?: string; hero?: React.ReactNode; mobileBar?: React.ReactNode; backToTopDesktopOnly?: boolean; children: React.ReactNode }) {
  /*
   * `dateModified` and `datePublished` are read from content/site.json rather
   * than hardcoded, because a stale freshness claim is worse than none. The same
   * value already drives the visible "last reviewed" line, so the markup can
   * never claim a date the page does not show. Generative engines weight
   * freshness heavily when deciding whether to cite a page.
   */
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...(canonical ? { '@id': `${canonical}#webpage`, url: canonical } : {}),
    name: title,
    description: intro,
    ...(modifiedISO ? { dateModified: modifiedISO } : { datePublished: site.updatedAt, dateModified: site.updatedAt }),
    inLanguage: 'en',
    isPartOf: { '@id': 'https://www.shiptickets.bd/#website' },
    publisher: { '@id': 'https://www.shiptickets.bd/#organization' },
    about: { '@type': 'Place', name: "Saint Martin's Island, Bangladesh" },
  }
  return <main id="main" className="min-h-screen bg-white text-ink">
    <Schema data={pageSchema} />
    <SeasonBar />
    <Header />
    {crumbs && crumbs.length > 0 && <div className="mx-auto max-w-7xl px-5 pt-6"><Breadcrumbs items={crumbs} /></div>}
    {hero
      ? <section className="mx-auto max-w-7xl px-5 pb-8 pt-4 md:pb-12 md:pt-6">{hero}</section>
      : <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 md:pb-16 md:pt-10"><p className="t-label mb-4 text-brand-ink"><Eyebrow text={eyebrow} /></p><h1 className="t-display max-w-4xl text-ink">{title}</h1><p className="t-lede mt-5 max-w-2xl text-prose">{intro}</p><RatingChip updated={updated} /></section>}
    <div className="mx-auto max-w-7xl px-5 pb-20"><article className="min-w-0">{children}</article></div>
    <Footer />
    {backToTopDesktopOnly ? <div className="hidden lg:block"><BackToTop /></div> : <BackToTop />}
    {mobileBar}
  </main>
}

/**
 * Count the readable blocks a section actually contains.
 *
 * Counting direct children does not work: almost every list is wrapped in a
 * single `<div>` or `<ul>`, so a six-item FAQ arrives as one child. This walks
 * the tree instead, treating a host element that only wraps other blocks as
 * transparent and a leaf as one block.
 *
 * A custom component counts as one block, because its internals are not visible
 * from here, and table parts count as one so a data table is never mistaken for
 * a run of short paragraphs.
 */
const TABLE_PARTS = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption'])

function countBlocks(node: React.ReactNode): number {
  return Children.toArray(node).reduce((total: number, child) => {
    if (!isValidElement(child)) return total
    if (typeof child.type !== 'string') return total + 1
    if (TABLE_PARTS.has(child.type)) return total + 1
    const inner = (child.props as { children?: React.ReactNode }).children
    const nested = countBlocks(inner)
    return total + (nested > 0 ? nested : 1)
  }, 0)
}

/**
 * Section for running text.
 *
 * The box is always full width. A 46rem box with the text in the left half was
 * tried in both alignments and rejected: centred, the page had two different
 * left edges, and left-aligned, the framed box was visibly half empty. So the
 * frame spans the shell like every other section, and the reading problem is
 * solved inside it.
 *
 * Two ways, chosen per section by how much text there is:
 *
 * - Two or more blocks (a Quick Answer list, "What we will not publish", an
 *   FAQ) run in two columns from `xl` up. At 1280px each column is ~572px,
 *   about 67 characters, so the section fills the width and every line stays
 *   comfortable. This is why the page no longer looks half used.
 * - A single-block section would leave one of two columns empty, so its heading
 *   moves beside the text instead: the h2 sits in a 17rem column and the body
 *   runs to its right, which fills the frame the way a term-and-description row
 *   does rather than leaving a half-empty box.
 *
 * Between `md` and `xl` the available width is 664-920px, so a single column is
 * still capped at 78ch and there is modest slack; above `xl` the two-column
 * layout takes over and the slack disappears.
 */
export function ProseSection({ title, children }: { title: string; children: React.ReactNode }) {
  const twoColumn = countBlocks(children) >= 2

  if (!twoColumn) {
    return (
      <section className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8">
        <div className="md:grid md:grid-cols-[17rem_minmax(0,1fr)] md:items-baseline md:gap-8">
          <h2 className="t-title">{title}</h2>
          <div className="section-body t-body mt-4 space-y-4 text-prose md:mt-0">{children}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8">
      <h2 className="t-title">{title}</h2>
      <div className="section-body t-body prose-columns mt-4 space-y-4 text-prose columns-1 gap-8 xl:columns-2">
        {children}
      </div>
    </section>
  )
}
export function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8"><h2 className="t-title">{title}</h2><div className="section-body t-body mt-4 space-y-4 text-prose">{children}</div></section> }
export function Bullet({ children }: { children: React.ReactNode }) { return <li className="flex gap-3"><Check className="mt-1 shrink-0 text-brand-ink" size={17}/><span>{children}</span></li> }
export function Pill({ children }: { children: React.ReactNode }) { return <span className="inline-flex rounded-full bg-[#e1f5ee] px-3 py-1 text-xs font-extrabold text-[#0f6e56]">{children}</span> }
export function Schema({ data }: { data: object }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} /> }

export const faqSchema = (items: [string, string][]) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) })

export const siteSchema = { '@context': 'https://schema.org', '@type': 'Organization', '@id': 'https://www.shiptickets.bd/#organization', name: 'ShipTickets.bd', url: 'https://www.shiptickets.bd', logo: 'https://www.shiptickets.bd/Logo.png', areaServed: 'Bangladesh', description: 'Saint Martin ship ticket information, comparison and booking support.', sameAs: ['https://www.facebook.com/shiptickets', 'https://www.instagram.com/shipticketsbd'], contactPoint: { '@type': 'ContactPoint', telephone: '+880-1718-116799', contactType: 'customer service', availableLanguage: ['en', 'bn'] }, ...(() => { const rating = getBusinessRating(); return rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.ratingValue.toFixed(1), reviewCount: rating.reviewCount, bestRating: '5', worstRating: '1' } } : {} })() }

export const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': 'https://www.shiptickets.bd/#website', url: 'https://www.shiptickets.bd/', name: 'ShipTickets.bd', publisher: { '@id': 'https://www.shiptickets.bd/#organization' } }

export const breadcrumbSchema = (items: { name: string; url?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    ...(item.url ? { item: `https://www.shiptickets.bd${item.url}` } : {}),
  })),
})

/**
 * One Product node per ship, carrying the fare range and any verified reviews.
 *
 * Reviews are folded in here instead of being emitted as a second Product node:
 * two Products for the same ticket compete with each other, and only one could
 * ever carry the aggregate rating. Review data appears only when
 * content/reviews.json actually holds entries for this ship.
 */
export const productSchema = (ship: Ship) => {
  const reviews = getReviewsForShip(ship.slug)
  const productId = `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}#product`
  // One-way fares for every seat and cabin category that has one.
  const offerFares = [...ship.ticketClasses, ...ship.cabins].map((item) => Number((item.oneWayFare ?? '').replace(/[^0-9]/g, ''))).filter((fare) => fare > 0)
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null
  const publishedCapacity = Number(ship.capacity?.match(/\d[\d,]*/)?.[0].replace(/,/g, ''))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productId,
    name: `${ship.name} Saint Martin ship ticket`,
    // Google treats a Vehicle as a Product that needs its own price, so the ship's details live here.
    alternateName: [ship.name, ship.nameBn, ...(ship.alternateNames ?? [])],
    description: ship.detail,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Operator', value: ship.operator },
      { '@type': 'PropertyValue', name: 'Route', value: ship.route },
      ...(publishedCapacity > 0 ? [{ '@type': 'PropertyValue', name: 'Passenger capacity', value: publishedCapacity }] : []),
    ],
    image: ship.image ? `https://www.shiptickets.bd${ship.image}` : undefined,
    brand: { '@type': 'Brand', name: ship.name },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BDT',
      offerCount: offerFares.length,
      lowPrice: String(Math.min(...offerFares)),
      highPrice: String(Math.max(...offerFares)),
      priceValidUntil: site.season.endISO,
      url: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`,
      seller: { '@id': 'https://www.shiptickets.bd/#organization' },
    },
    ...(average
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: average.toFixed(1),
            reviewCount: reviews.length,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
    ...(reviews.length
      ? {
          review: reviews.map((review) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: review.name },
            datePublished: review.date,
            reviewBody: review.review_text,
            reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: '5', worstRating: '1' },
            itemReviewed: { '@id': productId },
          })),
        }
      : {}),
  }
}

export const articleSchema = (post: { title: string; slug: string; excerpt?: string; publishedAt?: string; updatedAt?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  url: `https://www.shiptickets.bd/blog/${post.slug}`,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt ?? post.publishedAt,
  author: { '@type': 'Organization', name: 'ShipTickets.bd' },
  publisher: { '@id': 'https://www.shiptickets.bd/#organization' },
})

export { whatsapp }

export function Status({ children }: { children: React.ReactNode }) { return <Pill>{children}</Pill> }

export function LinkCard({ href, title, text }: { href: string; title: string; text: string }) { return <Link href={href} className="group rounded-2xl border border-line-soft bg-white p-5 transition hover:-translate-y-1 hover:border-brand-ink"><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-prose">{text}</p><ArrowRight className="mt-4 text-brand-ink transition group-hover:translate-x-1" size={17}/></Link> }
