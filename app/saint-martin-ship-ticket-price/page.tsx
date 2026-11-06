import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, Phone, ShieldCheck, Ticket } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, productSchema, siteSchema, websiteSchema, whatsapp } from '@/components/seo-page'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { PHONE_NUMBER, season, ships, type Ship } from '@/lib/ships'

const url = 'https://www.shiptickets.bd/saint-martin-ship-ticket-price'
const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const bangla = (value: string) => value.replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])
const byFare = [...ships].sort((a, b) => amount(a.oneWay) - amount(b.oneWay))
const cheapest = byFare[0]
const lowestRound = Math.min(...ships.map((ship) => amount(ship.roundTrip)))
const seatFares = ships.flatMap((ship) => ship.ticketClasses.map((item) => amount(item.oneWayFare)))
const highestSeat = Math.max(...seatFares)
const cabinRows = ships
  .flatMap((ship) => ship.cabins.filter((cabin) => cabin.oneWayFare).map((cabin) => ({ ship, cabin })))
const lowestCabin = Math.min(...cabinRows.map((row) => amount(row.cabin.oneWayFare)))
const highestCabin = Math.max(...cabinRows.map((row) => amount(row.cabin.oneWayFare)))
const withCabins = ships.filter((ship) => ship.cabins.length > 0).map((ship) => ship.name).join(', ').replace(/, ([^,]*)$/, ' and $1')

const h1 = 'Saint Martin Ship Ticket Price 2026–27'
const seoTitle = `Saint Martin Ship Ticket Price 2026-27: From ${cheapest.oneWay}`
const description = `Saint Martin ship ticket price 2026-27: one way from ${cheapest.oneWay}, round trip from ${taka(lowestRound)}. Compare every seat and cabin fare on all 5 ships from Cox’s Bazar.`

export const metadata: Metadata = {
  title: { absolute: seoTitle },
  description,
  keywords: ['saint martin ship ticket price', 'saint martin ship ticket price 2026', 'cox’s bazar to saint martin ship ticket price', 'saint martin ship cabin price', 'সেন্টমার্টিন জাহাজের টিকিটের দাম', 'সেন্টমার্টিন জাহাজ ভাড়া'],
  alternates: { canonical: url },
  openGraph: { title: seoTitle, description, url, type: 'website', siteName: 'ShipTickets.bd', locale: 'en_BD', alternateLocale: ['bn_BD'], images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Saint Martin ship ticket prices from ShipTickets.bd' }] },
  twitter: { card: 'summary_large_image', title: seoTitle, description, images: ['/opengraph.jpg'] },
}

const faqs: [string, string][] = [
  ['How much does a Saint Martin ship ticket cost?', `For the ${season.label} season, seat fares from Cox’s Bazar run from ${cheapest.oneWay} to ${taka(highestSeat)} one way per person, and start at ${taka(lowestRound)} round trip. Private cabins cost ${taka(lowestCabin)} to ${taka(highestCabin)} one way. Confirm the fare for your date before payment.`],
  ['Which ship has the cheapest Saint Martin ticket?', `${cheapest.name} has the lowest published fare: ${cheapest.oneWay} one way and ${cheapest.roundTrip} round trip per person on Main Deck.`],
  ['How much is a Saint Martin ship cabin?', `Published cabin fares start at ${taka(lowestCabin)} one way and reach ${taka(highestCabin)}. ${withCabins} publish cabins. Confirm occupancy and whether the fare is for the person or the whole cabin before payment.`],
  ['Is the Travel Pass included in the ticket price?', 'Yes, when you book through ShipTickets.bd. The QR-coded Travel Pass and the ৳100 environmental conservation fee are included with your ticket.'],
  ['Is food included in the ticket price?', 'Not necessarily. Keari Cruise & Dine has a floating restaurant and Keari Sindbad a canteen, but whether food comes with your ticket depends on the ticket and operator terms. Confirm before paying.'],
  ['Is there a ship from Teknaf to Saint Martin, and how much is the ticket?', `No. For the 2026–27 season, tourist ships leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar, and tourists are not permitted to travel by water from Teknaf. MV Teknaf is only a ship’s name: it sails from Cox’s Bazar, with fares from ${ships.find((ship) => ship.slug === 'mv-teknaf')?.oneWay} one way.`],
  ['সেন্টমার্টিন জাহাজের ভাড়া কত?', `২০২৬–২৭ মৌসুমে কক্সবাজার থেকে সিটের ভাড়া জনপ্রতি একমুখী ${bangla(cheapest.oneWay)} থেকে ${bangla(taka(highestSeat))} এবং যাওয়া-আসা ${bangla(taka(lowestRound))} থেকে শুরু। কেবিনের একমুখী ভাড়া ${bangla(taka(lowestCabin))} থেকে ${bangla(taka(highestCabin))}।`],
  ['সবচেয়ে কম ভাড়া কোন জাহাজে?', `এমভি টেকনাফের মেইন ডেকে: জনপ্রতি একমুখী ${bangla(cheapest.oneWay)} এবং যাওয়া-আসা ${bangla(cheapest.roundTrip)}।`],
]

function ShipFares({ ship }: { ship: Ship }) {
  const seatLow = Math.min(...ship.ticketClasses.map((item) => amount(item.oneWayFare)))
  const hasDownFare = ship.ticketClasses.some((item) => item.downFare)
  return (
    <section id={ship.slug} aria-labelledby={`${ship.slug}-fares`} className="scroll-mt-24 overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 id={`${ship.slug}-fares`} className="text-lg font-black leading-snug text-ink">{ship.name} ticket price</h3>
          <span lang="bn" className="text-sm font-semibold text-brand-ink">{ship.nameBn}</span>
        </div>
        <Link href={`/saint-martin-ship/${ship.slug}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand-ink hover:underline">Ship details <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{ship.name} seat and cabin fares per category for the {season.label} season, in Bangladeshi taka</caption>
        <thead className="bg-[#e3ecea] text-ink">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-bold sm:px-5">Category</th>
            <th scope="col" className="px-3 py-2.5 text-right font-bold sm:px-5">One way</th>
            <th scope="col" className="px-3 py-2.5 text-right font-bold sm:px-5">Round trip</th>
          </tr>
        </thead>
        <tbody>
          {ship.ticketClasses.map((item) => (
            <tr key={item.name} className="border-t border-line-soft">
              <th scope="row" className="px-3 py-2.5 font-bold text-ink sm:px-5">
                {item.name}
                {amount(item.oneWayFare) === seatLow && <span lang="bn" className="ml-1.5 inline-block rounded-md bg-[#e4f2ee] px-1.5 py-0.5 text-[0.75rem] font-bold text-[#1d5c4b]">কম ভাড়া</span>}
              </th>
              <td className="px-3 py-2.5 text-right font-extrabold tabular-nums text-ink sm:px-5">
                {item.oneWayFare}
                {hasDownFare && item.downFare && <span className="block text-xs font-semibold text-quiet">Return {item.downFare}</span>}
              </td>
              <td className="px-3 py-2.5 text-right font-extrabold tabular-nums text-ink sm:px-5">{item.roundTripFare}</td>
            </tr>
          ))}
          {ship.cabins.length > 0 && (
            <tr className="border-t border-line-soft bg-[#f7fbfa]"><th colSpan={3} scope="colgroup" className="px-3 py-2 text-xs font-extrabold text-quiet sm:px-5">Private cabins</th></tr>
          )}
          {ship.cabins.map((cabin) => (
            <tr key={cabin.name} className="border-t border-line-soft">
              <th scope="row" className="px-3 py-2.5 font-bold text-ink sm:px-5">{cabin.name}</th>
              <td className="px-3 py-2.5 text-right font-extrabold tabular-nums text-ink sm:px-5">{cabin.oneWayFare ?? 'Ask us'}</td>
              <td className="px-3 py-2.5 text-right font-extrabold tabular-nums text-ink sm:px-5">{cabin.roundTripFare ?? 'Ask us'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {ship.cabins.length === 0 && <p className="t-small border-t border-line-soft px-4 py-2.5 text-quiet sm:px-5">No private cabins are published for this ship.</p>}
    </section>
  )
}

function Hero() {
  const stats = [
    { label: 'One way from', value: cheapest.oneWay, note: cheapest.name },
    { label: 'Round trip from', value: taka(lowestRound), note: cheapest.name },
    { label: 'Cabins from', value: taka(lowestCabin), note: 'one way' },
  ]
  return (
    <div>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Saint Martin ships', href: '/saint-martin-ship' }, { name: 'Ticket prices' }]} />
      <h1 className="t-display mt-4 max-w-4xl text-[clamp(1.85rem,1.25rem+2.5vw,3.1rem)] text-ink">Saint Martin Ship Ticket Price <span className="whitespace-nowrap">2026–27</span></h1>
      <p className="t-lede mt-3 max-w-3xl text-prose">
        <strong className="font-extrabold text-ink">Saint Martin ship tickets from Cox’s Bazar cost {cheapest.oneWay} to {taka(highestSeat)} one way per person for a seat in {season.label}.</strong> Round trips start at {taka(lowestRound)}, and private cabins cost {taka(lowestCabin)} to {taka(highestCabin)} one way.
      </p>
      <p lang="bn" className="mt-2 max-w-3xl font-semibold text-prose">সেন্টমার্টিন জাহাজের টিকিটের দাম জনপ্রতি একমুখী {bangla(cheapest.oneWay)} এবং যাওয়া-আসা {bangla(taka(lowestRound))} থেকে শুরু।</p>
      <dl className="mt-5 grid max-w-3xl grid-cols-3 divide-x divide-[#d9e8e4] rounded-2xl bg-[#f1f8f6] py-4">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 px-3 sm:px-5">
            <dt className="text-xs font-bold text-quiet">{stat.label}</dt>
            <dd className="mt-0.5 text-xl font-black leading-tight tabular-nums text-ink sm:text-[1.75rem]">{stat.value}</dd>
            <dd className="mt-0.5 truncate text-xs font-semibold text-quiet">{stat.note}</dd>
          </div>
        ))}
      </dl>
      <p className="t-small mt-3 font-semibold text-quiet">Fares last reviewed: 6 November 2026</p>
    </div>
  )
}

export default function PricePage() {
  const askFare = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, please confirm the latest Saint Martin ship ticket price for my travel date.')}`
  const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

  return (
    <SeoPage eyebrow="Price guide · ভাড়ার তথ্য" title={h1} intro={description} canonical={url} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:gap-12">
        <div className="min-w-0">
          <section id="compare" className="mb-10 scroll-mt-24">
            <h2 className="t-title mb-1">Saint Martin ship ticket price by ship</h2>
            <p className="t-small mb-4 text-prose">Lowest published fare per person from Cox’s Bazar. Tap a ship to see all its fares.</p>
            <div className="overflow-hidden rounded-2xl border border-line-soft bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Lowest one-way and round-trip ticket price on each Saint Martin ship, in Bangladeshi taka</caption>
                <thead className="bg-[#e3ecea] text-ink">
                  <tr>
                    <th scope="col" className="px-3 py-3 font-bold sm:px-4">Ship</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">One way from</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Round trip from</th>
                  </tr>
                </thead>
                <tbody>
                  {ships.map((ship) => (
                    <tr key={ship.slug} className="border-t border-line-soft">
                      <th scope="row" className="px-3 py-3 font-extrabold sm:px-4"><a href={`#${ship.slug}`} className="text-ink underline-offset-2 hover:text-brand-ink hover:underline">{ship.name}</a></th>
                      <td className="px-3 py-3 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.oneWay}</td>
                      <td className="px-3 py-3 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.roundTrip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="t-title mb-1">All seat and cabin fares</h2>
            <p className="t-small mb-4 text-prose">Published fares for the {season.label} season, per person for seats. Prices may vary by date, so confirm yours before you pay.</p>
            <div className="grid gap-5">
              {ships.map((ship) => <ShipFares key={ship.slug} ship={ship} />)}
            </div>
          </section>

          <section id="cabins" className="mb-10 scroll-mt-24">
            <h2 className="t-title mb-1">Saint Martin ship cabin price</h2>
            <p className="t-small mb-4 text-prose">Every published cabin, cheapest first. {withCabins} publish cabins. Keari Sindbad and Keari Cruise &amp; Dine publish seats only. See the <Link href="/saint-martin-cabin-price" className="font-bold text-brand-ink underline underline-offset-2">cabin price guide</Link> for what each includes.</p>
            <div className="overflow-hidden rounded-2xl border border-line-soft bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">All published Saint Martin ship cabin fares, in Bangladeshi taka</caption>
                <thead className="bg-[#e3ecea] text-ink">
                  <tr>
                    <th scope="col" className="px-3 py-3 font-bold sm:px-4">Cabin</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">One way</th>
                    <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Round trip</th>
                  </tr>
                </thead>
                <tbody>
                  {cabinRows.map(({ ship, cabin }) => (
                    <tr key={`${ship.slug}-${cabin.name}`} className="border-t border-line-soft">
                      <th scope="row" className="px-3 py-2.5 sm:px-4">
                        <span className="block font-bold text-ink">{cabin.name}</span>
                        <Link href={`/saint-martin-ship/${ship.slug}`} className="block text-xs font-semibold text-brand-ink hover:underline">{ship.name}</Link>
                      </th>
                      <td className="px-3 py-2.5 text-right font-extrabold tabular-nums text-ink sm:px-4">{cabin.oneWayFare}</td>
                      <td className="px-3 py-2.5 text-right font-extrabold tabular-nums text-ink sm:px-4">{cabin.roundTripFare ?? 'Ask us'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="t-small mt-3 text-quiet">Confirm occupancy, and whether the fare is for the person or the whole cabin, before payment.</p>
          </section>

          <section className="mb-10 rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
            <h2 className="t-title">What your ticket price includes</h2>
            <ul className="t-body mt-3 grid gap-2 text-prose">
              <li className="flex gap-2"><Ticket size={18} aria-hidden="true" className="mt-1 shrink-0 text-brand" /><span>With ShipTickets.bd, the <Link href="/saint-martin-travel-pass" className="font-bold text-brand-ink underline underline-offset-2">QR-coded Travel Pass</Link> and ৳100 environmental fee are included. The government portal is <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">travelpass.gov.bd</a>.</span></li>
              <li className="flex gap-2"><Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-brand" /><span>A round trip usually costs less than two one-way tickets. {cheapest.name} Main Deck saves {taka(amount(cheapest.oneWay) * 2 - lowestRound)}.</span></li>
              <li className="flex gap-2"><Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-brand" /><span>Food is not automatically included, so ask if it matters to you. For your full budget, see <Link href="/saint-martin-trip-cost" className="font-bold text-brand-ink underline underline-offset-2">Saint Martin trip cost</Link>.</span></li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="t-title mb-4">What to confirm before you pay</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
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
                <li key={item} className="t-small flex items-start gap-2 text-prose"><Check size={16} aria-hidden="true" className="mt-1 shrink-0 text-brand-ink" />{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10 flex gap-3 rounded-2xl bg-[#f7fbfa] p-5">
            <ShieldCheck size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-ink" />
            <div className="t-small text-prose">
              <h2 className="font-extrabold text-ink">Where these fares come from</h2>
              <p className="mt-1">Fares come from operator-published information. On 6 November 2026 we checked MV Baro Awlia against the operator’s fare sheet, and MV Teknaf’s round-trip fares against its published list. Fares may change, and these are not live seat availability. See <Link href="/how-we-verify-information" className="font-bold text-brand-ink underline underline-offset-2">how we verify information</Link>.</p>
              <p className="mt-1">Ships leave from the <a href="https://biwta.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">BIWTA</a> jetty at Nuniarchhara. See the <Link href="/saint-martin-ship-schedule" className="font-bold text-brand-ink underline underline-offset-2">ship schedule</Link> for sailing times.</p>
            </div>
          </section>

          <FaqAccordion items={faqs} heading="Saint Martin ticket price questions" id="faq" />

          <section className="mb-4">
            <h2 className="t-title mb-4">Related guides</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                ['/saint-martin-ship', 'Compare all Saint Martin ships'],
                ['/cheapest-saint-martin-ship-ticket', 'Cheapest Saint Martin ship ticket'],
                ['/saint-martin-cabin-price', 'Cabin and seat class prices'],
                ['/saint-martin-trip-cost', 'Saint Martin trip cost'],
                ['/saint-martin-ship-schedule', 'Ship schedule and departure times'],
                ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ship ticket'],
                ['/saint-martin-travel-pass', 'Travel Pass and QR ticket'],
                ['/saint-martin-travel-rules', 'Travel rules and restrictions'],
                ['/how-we-verify-information', 'How we verify information'],
                ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin route'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line-soft bg-white px-4 py-2.5 text-sm font-bold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
                    {label}
                    <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="t-small mt-3 text-prose">Planning the island too? See the <a href="https://www.tripzic.com/destinations/saint-martin-island" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">Saint Martin Island guide</a> and <a href="https://www.tripzic.com/visit-bangladesh/saint-martins-island" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">visitor guide</a> from Tripzic, or find us on <a href="https://www.facebook.com/shiptickets" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">Facebook</a>.</p>
          </section>
        </div>

        <aside aria-label="Check your fare" className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-line-soft bg-white p-6 shadow-raised">
            <p className="text-xs font-bold text-quiet">Tickets from</p>
            <p className="text-4xl font-black tabular-nums text-ink">{cheapest.oneWay}</p>
            <p className="mt-1 text-sm font-bold text-prose">one way, {taka(lowestRound)} round trip</p>
            <div className="mt-5 grid gap-2">
              {BOOKING_ENABLED && <Link href="/booking" rel="nofollow" className="flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-4 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">Book now</Link>}
              <ContactLink href={askFare} kind="whatsapp" eventLabel="price_page_whatsapp" className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition duration-200 ${BOOKING_ENABLED ? 'border border-line text-ink hover:border-brand-ink hover:text-brand-ink' : 'bg-brand-ink text-white hover:bg-brand-ink-hover'}`}><MessageCircle size={16} aria-hidden="true" /> Fare for my date</ContactLink>
              <ContactLink href={phoneHref} kind="phone" eventLabel="price_page_phone" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink"><Phone size={16} aria-hidden="true" /> {PHONE_NUMBER}</ContactLink>
            </div>
            <p className="mt-4 text-sm font-extrabold text-ink">Jump to a ship</p>
            <ul className="mt-1 grid gap-0.5">
              {ships.map((ship) => (
                <li key={ship.slug}><a href={`#${ship.slug}`} className="flex min-h-9 items-center justify-between gap-2 rounded-lg px-2 text-sm font-semibold text-prose transition-colors hover:bg-[#f1f8f6] hover:text-brand-ink"><span>{ship.name}</span><span className="tabular-nums text-quiet">{ship.oneWay}</span></a></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            ...ships.map((ship) => productSchema(ship)),
            breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Saint Martin ships', url: '/saint-martin-ship' }, { name: 'Ticket prices', url: '/saint-martin-ship-ticket-price' }]),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}
