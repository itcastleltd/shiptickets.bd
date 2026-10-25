import Link from 'next/link'
import { Children, isValidElement } from 'react'
import { ArrowRight, Check, Star } from 'lucide-react'
import { site, WHATSAPP_NUMBER, LAST_REVIEWED, getBusinessRating, getReviewsForShip, type Ship } from '@/lib/ships'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackToTop } from '@/components/BackToTop'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { MobileCallBar } from '@/components/mobile-call-bar'
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
function RatingChip({ updated }: { updated: string }) {
  const rating = getBusinessRating()

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      <p className="t-small font-semibold text-quiet">Information last reviewed: {updated}</p>
      {rating && (
        <p className="inline-flex items-center gap-1.5 rounded-full border border-[#f3d9bf] bg-[#fff8ee] px-3 py-1.5 text-sm font-bold text-[#8a5a2f]">
          <Star size={15} className="fill-[#ef9f27] text-[#ef9f27]" aria-hidden="true" />
          <span className="sr-only">Customer rating </span>
          {rating.ratingValue.toFixed(1)} out of 5
          <span className="font-semibold text-warm">from {rating.reviewCount.toLocaleString('en-US')} reviews</span>
        </p>
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
function Eyebrow({ text }: { text: string }) {
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

export function SeoPage({ eyebrow, title, intro, updated = LAST_REVIEWED, crumbs, children }: { eyebrow: string; title: string; intro: string; updated?: string; crumbs?: Crumb[]; children: React.ReactNode }) {
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
    name: title,
    description: intro,
    datePublished: site.updatedAt,
    dateModified: site.updatedAt,
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
    <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 md:pb-16 md:pt-10"><p className="t-label mb-4 text-brand-ink"><Eyebrow text={eyebrow} /></p><h1 className="t-display max-w-4xl text-ink">{title}</h1><p className="t-lede mt-5 max-w-2xl text-prose">{intro}</p><RatingChip updated={updated} /></section>
    <div className="mx-auto max-w-7xl px-5 pb-20"><article className="min-w-0">{children}</article></div>
    <Footer />
    <BackToTop />
    <MobileCallBar />
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

export const siteSchema = { '@context': 'https://schema.org', '@type': 'Organization', '@id': 'https://www.shiptickets.bd/#organization', name: 'ShipTickets.bd', url: 'https://www.shiptickets.bd', areaServed: 'Bangladesh', description: 'Saint Martin ship ticket information, comparison and booking support.', sameAs: ['https://www.facebook.com/shipticketsbd', 'https://www.instagram.com/shipticketsbd'], contactPoint: { '@type': 'ContactPoint', telephone: '+880-1718-116799', contactType: 'customer service', availableLanguage: ['en', 'bn'] }, ...(() => { const rating = getBusinessRating(); return rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.ratingValue.toFixed(1), reviewCount: rating.reviewCount, bestRating: '5', worstRating: '1' } } : {} })() }

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

export const vehicleSchema = (ship: Ship) => {
  const publishedCapacity = Number(ship.capacity?.replace(/[^0-9]/g, ''))
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    '@id': `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}#vehicle`,
    name: ship.name,
    alternateName: ship.nameBn,
    description: `${ship.name} is a passenger vessel serving ${ship.route}. ${ship.detail}`,
    vehicleConfiguration: 'Passenger ship',
    brand: { '@type': 'Brand', name: ship.operator },
    ...(publishedCapacity > 0 ? { passengerCapacity: { '@type': 'QuantitativeValue', value: publishedCapacity } } : {}),
    offers: { '@id': `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}#product` },
  }
}

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
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : null

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productId,
    name: `${ship.name} Saint Martin ship ticket`,
    description: ship.detail,
    image: ship.image ? `https://www.shiptickets.bd${ship.image}` : undefined,
    brand: { '@type': 'Brand', name: ship.name },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BDT',
      offerCount: ship.ticketClasses.length,
      lowPrice: ship.ticketClasses.reduce((min, cls) => {
        const oneWayNum = Number(cls.oneWayFare.replace(/[^0-9]/g, ''))
        return oneWayNum < min ? oneWayNum : min
      }, Infinity).toString(),
      highPrice: ship.ticketClasses.reduce((max, cls) => {
        const oneWayNum = Number(cls.oneWayFare.replace(/[^0-9]/g, ''))
        return oneWayNum > max ? oneWayNum : max
      }, 0).toString(),
      availability: ship.status === 'verified' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
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

export { whatsapp }

export function Status({ children }: { children: React.ReactNode }) { return <Pill>{children}</Pill> }

export function LinkCard({ href, title, text }: { href: string; title: string; text: string }) { return <Link href={href} className="group rounded-2xl border border-line-soft bg-white p-5 transition hover:-translate-y-1 hover:border-brand-ink"><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-prose">{text}</p><ArrowRight className="mt-4 text-brand-ink transition group-hover:translate-x-1" size={17}/></Link> }
