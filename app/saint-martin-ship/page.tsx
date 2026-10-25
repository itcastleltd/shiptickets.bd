import type { Metadata } from 'next'
import Link from 'next/link'
import { SeoPage, Section, LinkCard, Schema, siteSchema, websiteSchema, breadcrumbSchema, faqSchema, whatsapp, ProseSection } from '@/components/seo-page'
import { RelatedGuides } from '@/components/related-guides'
import { ShipDirectoryCard } from '@/components/ship-directory-card'
import { season, ships, type Ship } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'

const title = 'Saint Martin Ship Ticket Price, Schedule & Booking'
const description =
  'Compare the four passenger ships serving Cox’s Bazar to Saint Martin, with reference fares, seating classes, cabins, seasonal schedule information and boarding guidance.'

export const metadata: Metadata = {
  title: 'Saint Martin Ships: Fares & Schedule',
  description,
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-ship' },
  openGraph: {
    title: 'Saint Martin Ships Directory: Fares, Classes & Schedule',
    description,
    url: 'https://www.shiptickets.bd/saint-martin-ship',
    images: [{ url: '/og_image.png', width: 1200, height: 630 }],
  },
}

const cabinCount = (ship: Ship) => ship.cabins.length
const hasCabins = (ship: Ship) => ship.cabins.length > 0

const faqs: [string, string][] = [
  ['How much is a Saint Martin ship ticket?', 'Reference seating fares start at ৳1,800 one way for MV Karnafuly Express and MV Baro Awlia and reach ৳2,900 for MV Karnafuly Express Chrysanthemum Lounge seating. Private cabins are priced separately and cost more. Confirm the fare for your travel date before payment.'],
  ['Which ships go to Saint Martin from Cox’s Bazar?', 'Four vessels are associated with the route: MV Karnafuly Express, MV Baro Awlia, Keari Sindbad and Keari Cruise & Dine. Operating status is seasonal, so confirm your sailing date.'],
  ['Which ship has cabins?', 'MV Karnafuly Express and MV Baro Awlia publish private cabin categories. Keari Sindbad and Keari Cruise & Dine publish seating categories only, with no private cabin inventory listed.'],
  ['What is the cheapest Saint Martin ship ticket?', 'MV Karnafuly Express and MV Baro Awlia list the lowest published reference fare at ৳1,800 one way and ৳3,500 round trip. Treat that as a reference figure and confirm before booking.'],
]

export default function ShipsPage() {
  return (
    <SeoPage
      eyebrow="Ship directory · জাহাজ"
      title={title}
      intro={description}
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Saint Martin ships' }]}
    >
      <Section title="Quick Answer">
        <p>
          There is no single fixed Saint Martin ship ticket price. The fare depends on the ship, the seating or
          deck category, whether you want a cabin, one-way or round trip, your travel date and current availability.
        </p>
        <p>
          Reference seating fares on this site run from <strong>৳1,800 one way</strong> for standard deck seating up to
          <strong>৳2,900</strong> for the highest lounge category, with private cabins priced higher again. Always
          confirm the current fare for your travel date before booking.
        </p>
      </Section>

      <Section title="Current reference fare guide">
        <p>
          The fares below are reference values from operator-published information. They are not live inventory.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line-soft">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th className="px-4 py-3 font-bold">Ship</th>
                <th className="px-4 py-3 text-right font-bold">One way from</th>
                <th className="px-4 py-3 text-right font-bold">Round trip from</th>
                <th className="px-4 py-3 font-bold">Options</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <td className="px-4 py-3 font-extrabold">
                    <Link href={`/saint-martin-ship/${ship.slug}`} className="hover:text-brand-ink hover:underline">
                      {ship.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold text-brand-ink">{ship.oneWay}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-brand-ink">{ship.roundTrip}</td>
                  <td className="px-4 py-3 text-quiet">
                    {ship.ticketClasses.length} seating {ship.ticketClasses.length === 1 ? 'class' : 'classes'}
                    {hasCabins(ship) ? `, ${cabinCount(ship)} cabins` : ', no cabins published'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-quiet">
          Different sites can show different prices because a fare may refer to another season, another seat
          category or a promotion. Confirm your exact date and class before payment.
        </p>
      </Section>

      <Section title="Available Saint Martin ships">
        <p>
          Four vessels are associated with the Cox&apos;s Bazar to Saint Martin route for the {season.label} season.
          Operating status is seasonal, so confirm your sailing date before you travel.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {ships.map((ship) => (
            <ShipDirectoryCard key={ship.slug} ship={ship} />
          ))}
        </div>
      </Section>

      <ProseSection title="Which ship should you choose?">
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-ink">If ticket price matters most</h3>
            <p>
              <Link href="/saint-martin-ship/karnafuly-express">MV Karnafuly Express</Link> and{' '}
              <Link href="/saint-martin-ship/baro-awlia">MV Baro Awlia</Link> list the lowest published reference fare
              at ৳1,800 one way, and both carry more seating categories. Karnafuly Express also publishes private
              cabins.
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-ink">If you want a private cabin</h3>
            <p>
              Two vessels publish private cabins. <Link href="/saint-martin-ship/karnafuly-express">MV Karnafuly Express</Link>{' '}
              lists single, twin, VIP and VVIP cabins. <Link href="/saint-martin-ship/baro-awlia">MV Baro Awlia</Link>{' '}
              lists bunker, deluxe, family bunker, VIP and VVIP cabins. The other two publish seating categories
              only.
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-ink">If you want open-air seating</h3>
            <p>
              Open deck categories are published on{' '}
              <Link href="/saint-martin-ship/keari-sindbad">Keari Sindbad</Link>,{' '}
              <Link href="/saint-martin-ship/karnafuly-express">MV Karnafuly Express</Link> and{' '}
              <Link href="/saint-martin-ship/baro-awlia">MV Baro Awlia</Link>, the latter as a Sun Deck seat. Keari
              Sindbad adds a Bridge Deck category for passengers who want the position closest to the bridge.
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-ink">If dining matters to you</h3>
            <p>
              <Link href="/saint-martin-ship/keari-cruise-dine">Keari Cruise &amp; Dine</Link> is built around a
              floating restaurant and publishes three air-conditioned lounge categories. Food inclusion depends on
              the ticket and current operator terms, so confirm before paying.
            </p>
          </div>
        </div>
      </ProseSection>

      <Section title="Saint Martin ship ticket classes">
        <p>
          Operators use different names for similar seating. These are the categories you will meet across the four
          vessels.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line-soft p-4">
            <dt className="font-extrabold text-ink">Open Deck</dt>
            <dd className="t-small mt-1">Outdoor seating. On some vessels it is the cheapest fare, while on others a named Economy seat is cheaper.</dd>
          </div>
          <div className="rounded-2xl border border-line-soft p-4">
            <dt className="font-extrabold text-ink">AC Seating and Lounge</dt>
            <dd className="t-small mt-1">Indoor air-conditioned seating, listed under different names per operator.</dd>
          </div>
          <div className="rounded-2xl border border-line-soft p-4">
            <dt className="font-extrabold text-ink">Business or Premium Chair</dt>
            <dd className="t-small mt-1">Higher-tier seating, such as Panorama, Riviera, Mozarat and Gladiolus.</dd>
          </div>
          <div className="rounded-2xl border border-line-soft p-4">
            <dt className="font-extrabold text-ink">Cabin</dt>
            <dd className="t-small mt-1">
              Private accommodation, usually quoted per person or per cabin. See the{' '}
              <Link href="/saint-martin-cabin-price">cabin and seat class price guide</Link>.
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Related information">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard
            href="/saint-martin-ship-ticket-price"
            title="Full ticket price guide"
            text="Every ship, seating class and cabin fare in one table."
          />
          <LinkCard
            href="/saint-martin-ship-schedule"
            title="Ship schedule and departure times"
            text="How to verify reporting times, jetty and seasonal changes."
          />
          <LinkCard
            href="/saint-martin-cabin-price"
            title="Cabin and seat class prices"
            text="Reference cabin fares and what each category actually includes."
          />
          <LinkCard
            href="/saint-martin-travel-pass"
            title="Travel Pass and QR ticket"
            text="What the Travel Pass is and whether you need one."
          />
          <LinkCard
            href="/saint-martin-travel-rules"
            title="Travel rules and restrictions"
            text="Current entry requirements to check before you travel."
          />
          <LinkCard
            href="/saint-martin-guide"
            title="Saint Martin travel guide"
            text="Planning, packing and what to do once you arrive."
          />
          <LinkCard
            href="/routes/coxs-bazar-to-saint-martin"
            title="Cox’s Bazar to Saint Martin route"
            text="The route, timings and what to expect on the crossing."
          />
          <LinkCard
            href="/how-we-verify-information"
            title="How we verify information"
            text="What we refuse to publish and why every page carries a date."
          />
        </div>
      </Section>

      <RelatedGuides />

      <FaqAccordion items={faqs} />

      <Section title="Travelled with us? Share your experience">
        <p>
          We publish passenger feedback, but only feedback we have actually received and checked. Send us your
          experience on WhatsApp, or in the post-trip call we make after your return, and we will verify it before it
          appears on the ship page. Nothing is written from a guess, and no rating is published without a real
          customer behind it.
        </p>
        <ul className="t-small mt-4 grid gap-2 text-prose sm:grid-cols-2">
          <li className="rounded-xl border border-line-soft p-3">
            <strong className="text-ink">How to send it:</strong> message us on WhatsApp with the ship you travelled
            on, your travel date and your rating out of 5.
          </li>
          <li className="rounded-xl border border-line-soft p-3">
            <strong className="text-ink">Where it appears:</strong> as a &ldquo;What passengers say&rdquo; block on that
            ship&apos;s page, with your name, rating, date and how the review was collected.
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <ContactLink
            href={`${whatsapp}Hello ShipTickets.bd, I would like to share my experience. Ship: [name]. Travel date: [date]. Rating: [1-5]. Feedback: [your experience].`}
            kind="whatsapp"
            eventLabel="ship_review_submit"
            className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#13734f]"
          >
            Send your feedback on WhatsApp
          </ContactLink>
          <Link
            href="/how-we-verify-information"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-extrabold text-ink transition hover:border-brand-ink hover:text-brand-ink"
          >
            How we verify information
          </Link>
        </div>
      </Section>

      <ProseSection title="Check availability for your travel date">
        <p className="mb-4">
          Share your travel date, passenger count, preferred ship and whether you need one-way or round trip. We will
          check the current sailing and applicable fare before you pay.
        </p>
        <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please check Saint Martin ship availability for my travel date.`} kind="whatsapp" eventLabel="ship_list_whatsapp" className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white">
          Check availability on WhatsApp
        </ContactLink>
      </ProseSection>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            {
              '@type': 'ItemList',
              name: 'Saint Martin ships',
              description: 'Passenger ships serving Cox’s Bazar to Saint Martin',
              isPartOf: { '@id': 'https://www.shiptickets.bd/#website' },
              numberOfItems: ships.length,
              itemListElement: ships.map((ship, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: ship.name,
                url: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`,
              })),
            },
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Saint Martin ships', url: '/saint-martin-ship' },
            ]),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}