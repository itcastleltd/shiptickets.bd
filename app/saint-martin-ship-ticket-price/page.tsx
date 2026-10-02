import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, MessageCircle } from 'lucide-react'
import {
  LinkCard,
  Pill,
  Schema,
  Section,
  SeoPage,
  faqSchema,
  siteSchema,
  websiteSchema,
  breadcrumbSchema,
  whatsapp,
} from '@/components/seo-page'
import { RelatedGuides } from '@/components/related-guides'
import { LAST_REVIEWED, season, ships, type Ship, type TicketClass } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const title = 'Saint Martin ship ticket price'
const description =
  'Compare Saint Martin ship ticket prices from Cox’s Bazar, including one-way, round-trip, seating class and cabin fares for all four vessels on the route.'

export const metadata: Metadata = {
  title: 'Saint Martin Ship Ticket Price 2026',
  description,
  keywords: [
    'saint martin ship ticket price',
    'সেন্টমার্টিন জাহাজের টিকিটের দাম',
    'saint martin ship cabin price',
    "cox's bazar to saint martin ship ticket",
  ],
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-ship-ticket-price' },
  openGraph: {
    title: 'Saint Martin Ship Ticket Price 2026',
    description,
    url: 'https://www.shiptickets.bd/saint-martin-ship-ticket-price',
    images: [{ url: '/og_image.png', width: 1200, height: 630 }],
  },
}

const toAmount = (fare: string) => Number(fare.replace(/[^0-9]/g, ''))

/** [label, ship, oneWay, roundTrip] */
const cabinFares: [string, string, string, string][] = ships.flatMap((ship): [string, string, string, string][] =>
  ship.cabins
    .filter((cabin) => cabin.oneWayFare)
    .map((cabin) => [cabin.name, ship.name, cabin.oneWayFare!, cabin.roundTripFare ?? 'Not published']),
)

const cheapest = ships.reduce((lowest, ship) =>
  toAmount(ship.oneWay) < toAmount(lowest.oneWay) ? ship : lowest,
)

const lowestCabin = cabinFares.length
  ? cabinFares.reduce((lowest, row) => (toAmount(row[2]) < toAmount(lowest[2]) ? row : lowest))
  : null

const faqs: [string, string][] = [
  [
    'How much does a Saint Martin ship ticket cost?',
    `Reference fares start from ${cheapest.oneWay} one way on ${cheapest.name}. The highest published one-way figure is for VVIP cabins. Fares depend on ship, seating class, cabin type, one-way versus round trip and the current season, so confirm the fare for your travel date before payment.`,
  ],
  [
    'Which ship has the cheapest ticket?',
    `${cheapest.name} lists the lowest published reference fare at ${cheapest.oneWay} one way and ${cheapest.roundTrip} round trip. Treat that as a reference figure rather than a quoted price.`,
  ],
  [
    'How much is a Saint Martin ship cabin?',
    lowestCabin
      ? `Published cabin fares start at ${lowestCabin[2]} one way. Cabins are quoted either per person or for the whole cabin depending on the operator, so always confirm the basis before payment.`
      : 'Cabin fares are published per vessel on the cabin and seat class price guide.',
  ],
  [
    'What is the difference between one-way and round-trip fares?',
    'A one-way fare covers a single crossing. A round-trip fare covers the outward and return legs, and on some vessels the return leg is priced separately from the outward leg. Confirm whether the quoted round trip is the total or a per-leg figure.',
  ],
  [
    'Is food included in the ticket price?',
    'Not necessarily. Keari Cruise & Dine publishes a floating restaurant, and Keari Sindbad publishes a canteen, but dining inclusion depends on the ticket and current operator terms. Confirm before paying.',
  ],
  [
    'Do I need a Travel Pass or QR ticket as well?',
    'Seasonal entry requirements can apply alongside your ship ticket. Check the Travel Pass guide and current travel rules before you travel.',
  ],
]

/**
 * `rows` is either [label, oneWay, roundTrip] for a single ship, or
 * [label, ship, oneWay, roundTrip] when `includeType` is set, so cabin fares
 * can show which vessel each category belongs to.
 */
function FareTable({
  rows,
  title,
  includeType = false,
}: {
  rows: string[][]
  title: string
  includeType?: boolean
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-[#dedcd3] bg-[#f7f6f2] p-5">
        <p className="t-body text-[#4a5a5c]">
          No private cabin inventory is published for any vessel on this page. Check the cabin and seat class guide
          for the current picture.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dedcd3]">
      <div className="flex items-center justify-between gap-3 border-b border-[#dedcd3] bg-[#f7f6f2] px-4 py-4">
        <h3 className="font-extrabold">{title}</h3>
        <Pill>Reference fare</Pill>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-[#0d1b2a] text-white">
            <tr>
              <th className="px-4 py-3 font-bold">Category</th>
              {includeType && <th className="px-4 py-3 font-bold">Ship</th>}
              <th className="px-4 py-3 text-right font-bold">One way</th>
              <th className="px-4 py-3 text-right font-bold">Round trip</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row[0]}-${row[1]}`} className="border-b border-[#eceae3] last:border-0">
                <td className="px-4 py-3 font-bold text-[#0d1b2a]">{row[0]}</td>
                {includeType && <td className="px-4 py-3 text-[#5f5e5a]">{row[1]}</td>}
                <td className="px-4 py-3 text-right font-extrabold text-[#1d9e75]">
                  {includeType ? row[2] : row[1]}
                </td>
                <td className="px-4 py-3 text-right font-extrabold text-[#0d1b2a]">
                  {includeType ? row[3] : row[2]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function perShipRows(ship: Ship): [string, string, string][] {
  return ship.ticketClasses.map((ticketClass: TicketClass): [string, string, string] => [
    ticketClass.name,
    ticketClass.oneWayFare,
    ticketClass.roundTripFare,
  ])
}

export default function PricePage() {
  const productSchema = ships.map((ship) => {
    const fares = ship.ticketClasses.map((ticketClass) => toAmount(ticketClass.oneWayFare))
    return {
      '@type': 'Product',
      name: `${ship.name} Saint Martin ship ticket`,
      description: `Reference fares and booking information for ${ship.name} from Cox's Bazar to Saint Martin.`,
      brand: { '@type': 'Brand', name: ship.name },
      category: 'Saint Martin ship ticket',
      areaServed: 'Bangladesh',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BDT',
        lowPrice: String(Math.min(...fares)),
        highPrice: String(Math.max(...fares)),
        offerCount: String(ship.ticketClasses.length),
        availability: 'https://schema.org/LimitedAvailability',
        url: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`,
      },
    }
  })

  return (
    <SeoPage
      eyebrow="Price guide · ভাড়ার তথ্য"
      title={title}
      intro="Compare reference fares from Cox’s Bazar to Saint Martin by ship, seating class and cabin. Every figure on this page comes from operator-published information and must be confirmed for your travel date before payment."
      updated={LAST_REVIEWED}
      crumbs={[
        { name: 'Home', href: '/' },
        { name: 'Saint Martin ships', href: '/saint-martin-ship' },
        { name: 'Ticket prices' },
      ]}
    >
      <Section title="Quick Answer">
        <p>
          Saint Martin ship ticket prices range from <strong>{cheapest.oneWay} one way</strong> on{' '}
          {cheapest.name} up to considerably more for premium lounge seating and private VVIP cabins. Four vessels
          serve this route: MV Karnafuly Express, MV Baro Awlia, Keari Sindbad and Keari Cruise &amp; Dine.
        </p>
        <p>
          Fares depend on ship, class, cabin type, one-way versus round trip and the current season. The{' '}
          {season.label} season opens {season.startDate}. All prices shown are operator-published references, so
          confirm the latest fare for your date before payment.
        </p>
      </Section>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Lowest reference fare', value: cheapest.oneWay, note: `one way on ${cheapest.name}` },
          {
            label: 'Cabin fare',
            value: lowestCabin ? `${lowestCabin[2]}+` : 'Not published',
            note: 'subject to availability',
          },
          { label: 'Last reviewed', value: LAST_REVIEWED, note: 'confirm before payment' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#dedcd3] bg-white p-5">
            <p className="t-label text-[#888780]">{stat.label}</p>
            <p className="t-subtitle mt-2 text-[#0d1b2a]">{stat.value}</p>
            <p className="t-small mt-1 text-[#5f5e5a]">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-col gap-4 rounded-3xl bg-[#0d1b2a] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#ef9f27]">
            <BadgeCheck size={17} /> Fare status: operator-published reference
          </div>
          <h2 className="t-title mt-3">Need the fare for your date?</h2>
          <p className="t-body mt-2 max-w-xl text-white/70">
            Send your travel date and passenger count. We will confirm the latest price, ship status and cabin
            availability before you pay.
          </p>
        </div>
        <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please confirm the latest Saint Martin ship ticket price for my travel date.`} kind="whatsapp" eventLabel="price_page_whatsapp" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ef9f27] px-5 py-3 text-sm font-extrabold text-[#0d1b2a]">
          <MessageCircle size={17} /> WhatsApp for latest fare
        </ContactLink>
      </div>

      <Section title="Saint Martin ship ticket price at a glance">
        <div className="overflow-x-auto rounded-xl border border-[#d4e6e2]">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-[#0d1b2a]/[4%]">
              <tr>
                <th className="px-4 py-3 font-bold">Ship</th>
                <th className="px-4 py-3 text-right font-bold">One way from</th>
                <th className="px-4 py-3 text-right font-bold">Round trip from</th>
                <th className="px-4 py-3 font-bold">Cabins</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-[#e7f0ee]">
                  <td className="px-4 py-3 font-extrabold">
                    <Link href={`/saint-martin-ship/${ship.slug}`} className="hover:text-[#1d9e75] hover:underline">
                      {ship.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold text-[#1d9e75]">{ship.oneWay}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-[#1d9e75]">{ship.roundTrip}</td>
                  <td className="px-4 py-3 text-[#628187]">
                    {ship.cabins.length > 0 ? `${ship.cabins.length} categories` : 'None published'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Seating class fares by ship">
        <div className="flex flex-col gap-4">
          {ships.map((ship) => (
            <FareTable key={ship.slug} rows={perShipRows(ship)} title={`${ship.name} · Cox's Bazar to Saint Martin`} />
          ))}
        </div>
      </Section>

      <Section title="Saint Martin ship cabin price">
        <p>
          Cabin fares are published by MV Karnafuly Express and MV Baro Awlia. Keari Sindbad and Keari Cruise
          &amp; Dine list seating categories only, with no private cabin inventory published.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <FareTable rows={cabinFares} title="Private cabin reference fares" includeType />
        </div>
        <p className="t-small mt-3 text-[#67878c]">
          Cabins are quoted either per person or for the whole cabin depending on the operator. Always confirm the
          basis before payment. See the{' '}
          <Link href="/saint-martin-cabin-price" className="font-extrabold text-[#1d9e75] hover:underline">
            cabin and seat class price guide
          </Link>{' '}
          for a fuller breakdown.
        </p>
      </Section>

      <Section title="What to confirm before you pay">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            'Ship name and boarding point',
            'One-way or round-trip fare, and whether the round trip is a total or per-leg figure',
            'Exact fare for your travel date',
            'Seating class or cabin, and whether the price is per person or per cabin',
            'Whether meals or dining are included',
            'Reporting time and departure time',
            'Travel Pass and QR ticket requirements',
            'Cancellation and rescheduling policy',
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1d9e75]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Related information">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard
            href="/saint-martin-cabin-price"
            title="Cabin and seat class prices"
            text="What each category includes and how cabin pricing is quoted."
          />
          <LinkCard
            href="/saint-martin-ship"
            title="Compare Saint Martin ships"
            text="All four vessels with classes, cabins and facilities."
          />
          <LinkCard
            href="/saint-martin-ship-schedule"
            title="Ship schedule"
            text="Seasonal departure times and reporting guidance."
          />
          <LinkCard
            href="/saint-martin-travel-pass"
            title="Travel Pass and QR ticket"
            text="Seasonal entry requirements to check before you travel."
          />
          <LinkCard
            href="/saint-martin-travel-rules"
            title="Travel rules"
            text="Current restrictions affecting your sailing."
          />
          <LinkCard
            href="/how-we-verify-information"
            title="How we verify information"
            text="Why fares are reference values and how we check them."
          />
        </div>
      </Section>

      <RelatedGuides
        title="Planning your trip"
        intro="Fare and schedule pages cover the ticket itself. These guides cover the trip around it."
      />

      <Section title="Frequently asked questions">
        <div className="divide-y divide-[#eceae3]">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-extrabold text-[#0d1b2a]">
                {question}
                <span className="text-[#1d9e75] transition group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[#4a5a5c]">{answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            ...productSchema,
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Saint Martin ships', url: '/saint-martin-ship' },
              { name: 'Ticket prices', url: '/saint-martin-ship-ticket-price' },
            ]),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}