import type { Metadata } from 'next'
import Link from 'next/link'
import { SeoPage, Section, Bullet, LinkCard, Schema, siteSchema, websiteSchema, breadcrumbSchema, faqSchema, whatsapp, ProseSection } from '@/components/seo-page'
import { LAST_VERIFIED, ships } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/content-blocks'

const title = 'Saint Martin Ship Cabin & Seat Class Fares'
const description = `Compare Saint Martin ship seat classes and cabins (open deck, lounge, AC seating, single, twin, VIP and VVIP cabin) with reference fares for the current season.`

export const metadata: Metadata = {
  title: 'Saint Martin Cabin & Seat Fares',
  description,
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-cabin-price' },
  openGraph: {
    title,
    description,
    url: 'https://www.shiptickets.bd/saint-martin-cabin-price',
    images: [{ url: '/og_image.png', width: 1200, height: 630 }],
  },
}

const cabinReference: { name: string; price: string; note: string }[] = [
  { name: 'Single Cabin', price: 'From ৳3,300 one-way', note: 'Single-occupancy private cabin. The basis is operator-specific, so confirm whether it is quoted per cabin.' },
  { name: 'Twin Cabin', price: 'From ৳7,000 one-way', note: 'Two-passenger private cabin. Confirm whether the price covers both passengers.' },
  { name: 'VIP Cabin', price: 'From ৳8,500 one-way', note: 'Premium private accommodation, usually limited in number per sailing.' },
  { name: 'VVIP Cabin', price: 'From ৳10,500 one-way', note: 'Highest private category where offered. Availability is seasonal.' },
]

const categoryGlossary = [
  { term: 'Open Deck', text: 'Outdoor seating. On some ships it is the entry-level fare, while on others a named Economy seat is cheaper, so compare the fare table rather than assuming.' },
  { term: 'Sun Deck / Main Deck', text: 'Named deck sections. Sun deck is outdoor seating; main deck is usually the standard indoor-outdoor mix.' },
  { term: 'Lounge', text: 'Indoor comfort seating, often air-conditioned on some sailings.' },
  { term: 'AC Seating', text: 'Air-conditioned indoor seats, listed separately from lounge on some ships.' },
  { term: 'Bunker Bed', text: 'Shared berth accommodation, usually priced per person.' },
  { term: 'Cabin', text: 'Private or family accommodation, such as single, twin, VIP or VVIP. Often quoted per person or per cabin, so always confirm the basis.' },
]

const faqs: [string, string][] = [
  ['What is the Saint Martin ship cabin price?', 'Reference cabin pricing starts around ৳3,300 one-way for a single cabin, ৳7,000 for a twin cabin, ৳8,500 for a VIP cabin and ৳10,500 for a VVIP cabin where offered. Cabin pricing is seasonal and may be quoted per person or per cabin, so confirm the basis before payment.'],
  ['Is a Saint Martin ship cabin price per person or per cabin?', 'It depends on the operator and the category. Bunker beds and lounge seats are normally per person, while a twin or VIP cabin is sometimes quoted for the whole cabin. Always ask for the pricing basis in writing before you pay.'],
  ['Which ship has the cheapest cabin?', 'Cabin categories differ by ship rather than by price alone. MV Karnafuly Express lists single, twin and VIP cabins; MV Baro Awlia lists deluxe and family bunker/VIP cabins. Compare each ship page before deciding.'],
  ['Is open deck cheaper than a cabin?', 'Yes. Cabins are always the premium tier, and deck and lounge seating is the lower band. Reference one-way fares for deck and lounge seating start from ৳1,800 depending on the ship. Note that on some ships a named Economy seat is cheaper than Open Deck, so check the fare table rather than assuming.'],
  ['Can I get a cabin on any Cox’s Bazar to Saint Martin ship?', 'No. Cabin availability depends on the vessel and the sailing. Some ships list cabins, others only deck and lounge seating. Check the cabins table on the individual ship page, then confirm availability for your date.'],
]

export default function CabinPricePage() {
  return (
    <SeoPage eyebrow="Cabin prices · কেবিন" title={title} intro={description}>
      <Section title="Quick Answer">
        <p><strong>How much is a Saint Martin ship cabin?</strong> Reference cabin fares start at about <strong>৳3,300 one-way</strong> for a single cabin, <strong>৳7,000</strong> for a twin cabin, <strong>৳8,500</strong> for VIP and <strong>৳10,500</strong> for VVIP where offered. Deck and lounge seating is cheaper, from <strong>৳1,800</strong> one-way depending on the ship.</p>
        <p className="mt-3"><strong>Why do prices differ so much?</strong> Category, occupancy basis, ship and season all matter. A twin cabin quoted per cabin is not comparable with a lounge seat quoted per person, so confirm the basis before payment.</p>
      </Section>

      <Section title="Cabin price reference (one-way)">
        <div className="overflow-x-auto rounded-xl border border-line-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#e3ecea] text-ink">
              <tr><th className="px-4 py-3 font-bold">Cabin</th><th className="px-4 py-3 font-bold">Reference fare</th><th className="px-4 py-3 font-bold">Notes</th></tr>
            </thead>
            <tbody>
              {cabinReference.map((cabin) => (
                <tr key={cabin.name} className="border-t border-line-soft">
                  <td className="px-4 py-3 font-extrabold">{cabin.name}</td>
                  <td className="px-4 py-3 font-extrabold text-brand-ink">{cabin.price}</td>
                  <td className="px-4 py-3 text-quiet">{cabin.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-quiet">Reference values, not live prices. Confirm the exact fare and pricing basis for your travel date.</p>
      </Section>

      <Section title="Seat class and cabin glossary">
        <p>Ships use specific terms for accommodation. We keep the operator wording instead of calling everything a "room".</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {categoryGlossary.map((item) => (
            <div key={item.term} className="rounded-2xl border border-[#dedad3] p-4">
              <dt className="font-extrabold text-ink">{item.term}</dt>
              <dd className="mt-1 text-sm">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Classes and cabins by ship">
        <div className="grid gap-4 md:grid-cols-2">
          {ships.map((ship) => (
            <div key={ship.slug} className="flex flex-col rounded-2xl border border-line-soft bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="t-subtitle text-ink">{ship.name}</h3>
                <p className="text-sm font-extrabold text-brand-ink">
                  From {ship.oneWay} one way, {ship.roundTrip} round trip
                </p>
              </div>
              <p className="mt-3 t-body text-prose">
                <strong className="text-ink">Classes:</strong>{' '}
                {ship.ticketClasses.map((ticketClass) => `${ticketClass.name} (${ticketClass.oneWayFare})`).join(', ')}
              </p>
              <p className="mt-2 t-body text-prose">
                <strong className="text-ink">Cabins:</strong>{' '}
                {ship.cabins.length > 0
                  ? ship.cabins.map((cabin) => `${cabin.name}, ${cabin.capacity}`).join('; ')
                  : 'None published for this vessel'}
              </p>
              <Link
                href={`/saint-martin-ship/${ship.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 self-start border-b border-transparent pb-0.5 text-sm font-extrabold text-brand-ink transition hover:border-brand-ink"
              >
                See the full {ship.name} page
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <ProseSection title="Before you pay for a cabin">
        <ul className="flex flex-col gap-3">
          <Bullet>Ask whether the cabin price is per person or for the whole cabin.</Bullet>
          <Bullet>Confirm occupancy. A twin cabin usually takes two passengers.</Bullet>
          <Bullet>Check what is included: meals, deck access, washroom and seating.</Bullet>
          <Bullet>Confirm cancellation terms before payment.</Bullet>
          <Bullet>Keep the passenger name on the ticket identical to your ID.</Bullet>
        </ul>
      </ProseSection>

      <Section title="Related pages">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard href="/saint-martin-ship-ticket-price" title="Full ticket price guide" text="Fares for every ship, class and cabin type." />
          <LinkCard href="/saint-martin-ship" title="All ships directory" text="Compare vessels, operators and seasonal status." />
          <LinkCard href="/saint-martin-ship-schedule" title="Ship schedule" text="Departure times and check-in guidance." />
          <LinkCard href="/how-we-verify-information" title="How we verify information" text="Why fares are reference values and how we check them." />
        </div>
      </Section>

      <FaqAccordion items={faqs} />

      <ProseSection title="Confirm the current cabin fare">
        <p className="mb-4">Send us your travel date, passenger count and preferred cabin. We will confirm availability, the pricing basis and the exact fare before you pay.</p>
        <ContactLink href={`${whatsapp}Hello ShipTickets.bd, I want to check cabin availability and price for my travel date.`} kind="whatsapp" eventLabel="cabin_price_whatsapp" className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white">Check cabin price on WhatsApp</ContactLink>
      </ProseSection>

      <Schema data={{
        '@context': 'https://schema.org',
        '@graph': [
          siteSchema,
          websiteSchema,
          breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Cabin and class prices' }]),
          faqSchema(faqs),
        ],
      }} />
    </SeoPage>
  )
}