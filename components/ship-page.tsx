import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
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
  FaqList,
  JettyNote,
  ProvenanceNote,
  QuickFacts,
  ScheduleBlock,
  SeasonNotice,
  TicketCards,
} from '@/components/content-blocks'
import { LAST_REVIEWED, season, ships, type Ship } from '@/lib/ships'

export function shipMetadata(ship: Ship, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`,
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
          <figcaption className="t-small mt-3 text-[#6f8a8e]">
            {ship.name} on the {ship.route} route.
          </figcaption>
        </figure>
      )}

      <SeasonNotice compact />

      <section className="mb-10 rounded-3xl border-l-4 border-[#1d9e75] bg-[#f7fbfa] p-6 md:p-7">
        <h2 className="t-label text-[#1d9e75]">Quick Answer</h2>
        <div className="mt-4 flex flex-col gap-4">
          {quickAnswer.map(([question, answer]) => (
            <div key={question}>
              <p className="font-extrabold text-[#0d1b2a]">{question}</p>
              <p className="t-body mt-1.5 text-[#4a5a5c]">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <QuickFacts ship={ship} />
      <TicketCards ship={ship} />
      <FareTable ship={ship} />
      <CabinBlock ship={ship} />
      <CategoryCompare ship={ship} />
      <FacilitiesGrid ship={ship} />
      <ScheduleBlock ship={ship} />
      <JettyNote ship={ship} />
      <BookingSteps ship={ship} />
      <BeforeYouPay items={beforeYouPay} />
      <CustomerReviews ship={ship} />
      <FaqList items={ship.faq} heading={`${ship.name} FAQ`} />
      <ProvenanceNote ship={ship} />
      <BookingCta ship={ship} />

      {relatedShips.length > 0 && (
        <section className="mb-10">
            <h2 className="t-title">Compare other Saint Martin ships</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedShips.map((other) => (
                <Link key={other.slug} href={`/saint-martin-ship/${other.slug}`} className="group rounded-2xl border border-[#dedcd3] p-5 transition hover:-translate-y-1 hover:border-[#1d9e75]">
                  <h3 className="t-subtitle text-[#0d1b2a]">{other.name}</h3>
                  <p className="t-body mt-1 text-[#4a5a5c]">{other.detail}</p>
                  <p className="mt-3 text-sm font-extrabold text-[#1d9e75]">From {other.oneWay} one way, {other.roundTrip} round trip</p>
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
