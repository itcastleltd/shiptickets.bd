import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SeoPage, Schema, siteSchema, websiteSchema, breadcrumbSchema, faqSchema, vehicleSchema, productSchema } from '@/components/seo-page'
import {
  BeforeYouPay,
  BookingCta,
  BookingSteps,
  CabinBlock,
  CategoryCompare,
  ConfidenceBadge,
  CustomerReviews,
  FacilitiesGrid,
  FareTable,
  FaqAccordion,
  JettyNote,
  ProvenanceNote,
  QuickAnswer,
  QuickFacts,
  ScheduleBlock,
  TicketCards,
} from '@/components/content-blocks'
import { ShipPageNav } from '@/components/ship-page-nav'
import { LAST_REVIEWED, STATUS_LABELS, getReviewsForShip, season, ships, type Ship } from '@/lib/ships'

export function shipMetadata(ship: Ship, title: string, description: string): Metadata {
  const canonical = `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`

  return {
    title,
    description,
    /*
     * Bengali is served inline on this same page, through `summaryBn` and the
     * Bengali quick-answer row, rather than from a parallel /bn tree. There is
     * therefore no second URL to declare and no `hreflang` pair to keep
     * reciprocal, and `x-default` is unnecessary for a single URL.
     *
     * If a full Bengali translation is ever built, it should cover the whole site
     * rather than four ship pages, and it should arrive with both sides annotated:
     *        languages: { en: canonical, bn: `https://www.shiptickets.bd/bn/saint-martin-ship/${ship.slug}`, 'x-default': canonical }
     */
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      alternateLocale: ['bn_BD'],
      images: ship.image ? [{ url: `https://www.shiptickets.bd${ship.image}`, width: 1264, height: 848, alt: ship.imageAlt ?? `${ship.name} passenger ship` }] : undefined,
    },
  }
}

const DEFAULT_BEFORE_YOU_PAY = [
  'Travel date and one-way or round trip',
  'Number of passengers',
  'Exact fare for your date',
  'Whether meals or dining are included',
  'Reporting time and departure time',
  'Boarding jetty printed on your ticket',
  'Travel Pass and QR ticket requirements',
  'Cancellation and rescheduling policy',
  'Passenger name spelling on the ticket',
]

export function ShipPage({
  ship,
  title,
  description,
  quickAnswer,
  beforeYouPay = DEFAULT_BEFORE_YOU_PAY,
  relatedShips = [],
}: {
  ship: Ship
  title: string
  description: string
  quickAnswer: [string, string][]
  beforeYouPay?: string[]
  relatedShips?: Ship[]
}) {
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Saint Martin ships', href: '/saint-martin-ship' },
    { name: ship.name },
  ]

  /**
   * Jump links, built from what the page actually renders.
   *
   * A vessel with no published cabins and a vessel with no collected reviews
   * must not be linked to anchors that do not exist, so both are conditional.
   */
  const navItems = [
    { id: 'quick-answer', label: 'Quick answer' },
    { id: 'at-a-glance', label: 'At a glance' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'fares', label: 'Fare table' },
    ...(ship.cabins.length > 0 ? [{ id: 'cabins', label: 'Cabins' }] : []),
    { id: 'categories', label: 'Choosing a class' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'schedule', label: 'Schedule' },
    ...(getReviewsForShip(ship.slug).length > 0 ? [{ id: 'reviews', label: 'Reviews' }] : []),
    { id: 'faq', label: 'FAQ' },
  ]

  return (
    <SeoPage
      eyebrow={`Ship guide · ${ship.nameBn}`}
      title={title}
      intro={`${ship.name} (${ship.nameBn}) serves ${ship.route}. ${description}`}
      updated={LAST_REVIEWED}
      crumbs={crumbs}
    >
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <ConfidenceBadge kind="seasonal">Season {season.label}</ConfidenceBadge>
        <ConfidenceBadge kind="reference">Reference fares</ConfidenceBadge>
        <ConfidenceBadge kind="confirm">Confirm before booking</ConfidenceBadge>
      </div>

      {ship.image && (
        <figure className="mb-8">
          <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-[#dcefeb] sm:h-[380px] lg:h-[440px]">
            <Image
              src={ship.image}
              alt={ship.imageAlt ?? `${ship.name} passenger ship`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 720px"
              className="object-cover"
              priority
            />
            {ship.photoPending && (
              <p className="absolute inset-x-0 bottom-0 bg-[#0d1b2a]/80 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-white">
                Official operator photo coming soon
              </p>
            )}
          </div>
          <figcaption className="t-small mt-3 text-quiet">
            {ship.name} on the {ship.route} route.
          </figcaption>
        </figure>
      )}

      <ShipPageNav items={navItems} />

      <QuickAnswer items={quickAnswer} id="quick-answer" />

      <QuickFacts ship={ship} id="at-a-glance" />
      <TicketCards ship={ship} id="tickets" />
      <FareTable ship={ship} id="fares" />
      <CabinBlock ship={ship} id="cabins" />
      <CategoryCompare ship={ship} id="categories" />
      <FacilitiesGrid ship={ship} id="facilities" />

      {/*
        The Bangla summary sits here, next to the schedule, rather than directly
        under the English Quick Answer. Up there it read as a second Quick
        Answer — same panel, same border, same position — and pushed the actual
        reference data a screen further down. A Bangla reader now finds the
        translation next to the sailing information it describes, and it is
        styled as a translation rather than as another answer block.
      */}
      <section id="bn-summary" lang="bn" className="mb-10 scroll-mt-32 rounded-3xl border border-dashed border-[#bcd9d3] bg-[#f7fbfa] p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="t-label bn text-brand-ink">জাহাজ সম্পর্কে সংক্ষিপ্ত তথ্য</h2>
          <span className="text-xs font-semibold text-quiet">Bangla summary</span>
        </div>
        <p className="t-body mt-4 t-measure text-prose">{ship.summaryBn}</p>
        <p className="mt-4 border-t border-[#dcece9] pt-3 text-sm font-bold text-ink">{ship.nameBn}</p>
      </section>

      <ScheduleBlock ship={ship} id="schedule" />
      <JettyNote ship={ship} />
      <BookingSteps ship={ship} />
      <BeforeYouPay items={beforeYouPay} />
      <CustomerReviews ship={ship} id="reviews" />
      <FaqAccordion items={ship.faq} heading={`${ship.name} FAQ`} id="faq" />
      <ProvenanceNote ship={ship} />
      <BookingCta ship={ship} />

      {relatedShips.length > 0 && (
        <section className="mb-10">
          <h2 className="t-title mb-4">Compare other Saint Martin ships</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedShips.map((other) => (
              <Link
                key={other.slug}
                href={`/saint-martin-ship/${other.slug}`}
                className="group flex flex-col rounded-2xl border border-line-soft bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-ink hover:shadow-raised"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="t-subtitle text-ink">{other.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-brand-ink" lang="bn">
                      {other.nameBn}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f1f0ec] px-2.5 py-1 t-label text-[#6b6a63]">
                    {STATUS_LABELS[other.status]}
                  </span>
                </div>
                <p className="t-body mt-3 text-prose">{other.detail}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
                  <p className="text-sm font-extrabold text-brand-ink">
                    From {other.oneWay} one way, {other.roundTrip} round trip
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-ink">
                    See full details
                    <ArrowRight size={16} className="text-brand-ink transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            vehicleSchema(ship),
            productSchema(ship),
            breadcrumbSchema(crumbs.map((crumb) => ({ name: crumb.name, url: crumb.href }))),
            faqSchema(ship.faq),
          ],
        }}
      />
    </SeoPage>
  )
}
