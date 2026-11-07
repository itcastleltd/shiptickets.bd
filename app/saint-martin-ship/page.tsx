import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BedDouble, Check, ChevronDown, MapPin, MessageCircle, Phone, Ticket, Users } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'
import { RatingChip, Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema, whatsapp } from '@/components/seo-page'
import { ShipListCard } from '@/components/ship-list-card'
import { ShipScheduleBoard } from '@/components/ship-schedule-board'
import { TEKNAF_TIME_NOTE, dhakaToday, getShipSchedule, getUsualTimes } from '@/content/ship-schedules'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { isApproved, PHONE_NUMBER, season, ships } from '@/lib/ships'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const url = 'https://www.shiptickets.bd/saint-martin-ship'
const h1 = 'Saint Martin Ship List 2026–27: Compare All 5 Ships'
const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const byFare = [...ships].sort((a, b) => amount(a.oneWay) - amount(b.oneWay))
const cheapest = byFare[0]
const lowestRound = Math.min(...ships.map((ship) => amount(ship.roundTrip)))
const highestSeat = Math.max(...ships.flatMap((ship) => ship.ticketClasses.map((item) => amount(item.oneWayFare))))
const withCabins = ships.filter((ship) => ship.cabins.length > 0)
const lowestCabin = Math.min(...withCabins.flatMap((ship) => ship.cabins.map((cabin) => amount(cabin.oneWayFare)).filter(Boolean)))
const bangla = (value: string) => value.replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])
const cabinShips = withCabins.map((ship) => ship.name).join(', ').replace(/, ([^,]*)$/, ' and $1')

const description = `All 5 Saint Martin ships from Cox’s Bazar for 2026-27: compare ticket prices from ${cheapest.oneWay}, seats, cabins and sailing times, then check your date.`

export const metadata: Metadata = {
  title: { absolute: 'Saint Martin Ship List 2026-27: Fares & Schedule' },
  description,
  alternates: { canonical: url },
  keywords: ['saint martin ship list', 'saint martin ship', 'saint martin ship schedule', 'সেন্টমার্টিন জাহাজের তালিকা', 'সেন্টমার্টিন জাহাজ', 'সেন্টমার্টিন জাহাজ টিকেট বুকিং', 'saint martin ship ticket online booking', 'saint martin launch ticket', 'cox’s bazar to saint martin ship'],
  openGraph: { title: 'Saint Martin Ship List 2026-27: Fares & Schedule', description, url, type: 'website', siteName: 'ShipTickets.bd', locale: 'en_BD', alternateLocale: ['bn_BD'], images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Saint Martin ship tickets from ShipTickets.bd' }] },
  twitter: { card: 'summary_large_image', title: 'Saint Martin Ship List 2026-27: Fares & Schedule', description, images: ['/opengraph.jpg'] },
}

const faqs: [string, string][] = [
  ['Which ships go to Saint Martin from Cox’s Bazar?', 'MV Karnafuly Express, MV Baro Awlia and MV Teknaf are approved for the 2026–27 season. Keari Cruise & Dine and Keari Sindbad are awaiting approval. Ships leave from Cox’s Bazar. Updated dated schedules have not been received for every ship yet, so confirm your sailing time.'],
  ['What is the cheapest Saint Martin ship?', `${cheapest.name} has the lowest published fare: ${cheapest.oneWay} one way and ${cheapest.roundTrip} round trip per person on Main Deck.`],
  ['Which Saint Martin ship has cabins?', `${cabinShips} publish private cabins. Keari Cruise & Dine and Keari Sindbad publish seating categories only.`],
  ['What time do Saint Martin ships leave Cox’s Bazar?', 'Departures are in the morning. MV Teknaf leaves at 7:00 AM every day, while the dated schedule for MV Karnafuly Express and MV Baro Awlia changes with the tide. Check the schedule on this page, then confirm the time printed on your ticket.'],
  ['Can I go to Saint Martin by ship from Teknaf?', 'No. For the 2026–27 season, tourist ships leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar, and tourists are not permitted to travel by water from Teknaf. MV Teknaf is only the name of a ship, and it also sails from Cox’s Bazar.'],
  ['Is a Saint Martin launch ticket the same as a ship ticket?', 'Many travellers say “launch” for these boats. Tourist travel from Cox’s Bazar to Saint Martin is on the passenger ships listed on this page, so use the ship’s name when you book.'],
  ['সেন্টমার্টিনে কোন কোন জাহাজ যায়?', 'এই মৌসুমে অনুমোদিত জাহাজ: এমভি কর্ণফুলী এক্সপ্রেস, এমভি বার আউলিয়া ও এমভি টেকনাফ। কেয়ারী ক্রুজ অ্যান্ড ডাইন ও কেয়ারী সিন্দবাদ এখনো ২০২৬–২৭ মৌসুমের অনুমোদন পায়নি। জাহাজ কক্সবাজার থেকে ছাড়ে। সব জাহাজের হালনাগাদ সময়সূচি এখনো আমাদের হাতে আসেনি, তাই আপনার তারিখের সময় জেনে নিন।'],
]

const CHOICES = [
  { icon: Ticket, title: 'Lowest fare', text: <><Link href="/saint-martin-ship/mv-teknaf" className="font-bold text-brand-ink underline underline-offset-2">MV Teknaf</Link> starts at {shipFare('mv-teknaf')} one way. <Link href="/saint-martin-ship/keari-sindbad" className="font-bold text-brand-ink underline underline-offset-2">Keari Sindbad</Link> follows at {shipFare('keari-sindbad')}.</> },
  { icon: BedDouble, title: 'A private cabin', text: <><Link href="/saint-martin-ship/karnafuly-express" className="font-bold text-brand-ink underline underline-offset-2">MV Karnafuly Express</Link>, <Link href="/saint-martin-ship/baro-awlia" className="font-bold text-brand-ink underline underline-offset-2">MV Baro Awlia</Link> and <Link href="/saint-martin-ship/mv-teknaf" className="font-bold text-brand-ink underline underline-offset-2">MV Teknaf</Link> publish cabins. See the <Link href="/saint-martin-cabin-price" className="font-bold text-brand-ink underline underline-offset-2">cabin price guide</Link>.</> },
  { icon: Users, title: 'Open-air seating', text: <>Open-view decks are published on <Link href="/saint-martin-ship/keari-sindbad" className="font-bold text-brand-ink underline underline-offset-2">Keari Sindbad</Link>, <Link href="/saint-martin-ship/karnafuly-express" className="font-bold text-brand-ink underline underline-offset-2">MV Karnafuly Express</Link> and <Link href="/saint-martin-ship/baro-awlia" className="font-bold text-brand-ink underline underline-offset-2">MV Baro Awlia</Link>.</> },
  { icon: Check, title: 'Dining on board', text: <><Link href="/saint-martin-ship/keari-cruise-dine" className="font-bold text-brand-ink underline underline-offset-2">Keari Cruise &amp; Dine</Link> has a floating restaurant and three AC lounges. Confirm whether food comes with your ticket.</> },
]

function shipFare(slug: string) {
  return ships.find((ship) => ship.slug === slug)?.oneWay ?? ''
}

function Hero() {
  const stats = [
    { label: 'Approved ships', value: String(ships.filter(isApproved).length), note: `${ships.filter((ship) => !isApproved(ship)).length} more awaiting approval` },
    { label: 'One way from', value: cheapest.oneWay, note: cheapest.name },
    { label: 'Round trip from', value: taka(lowestRound), note: cheapest.name },
    { label: 'Journey time', value: '6–7 hrs', note: 'about 120 km' },
  ]
  return (
    <div>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Saint Martin ships' }]} />
      <h1 className="t-display mt-4 max-w-4xl text-[clamp(1.85rem,1.25rem+2.5vw,3.1rem)] text-ink">Saint Martin Ship List <span className="whitespace-nowrap">2026–27:</span> Compare All 5 Ships</h1>
      <p className="t-lede mt-3 max-w-3xl text-prose">
        <strong className="font-extrabold text-ink">Five passenger ships serve Cox’s Bazar to Saint Martin in {season.label}.</strong> Fares start at {cheapest.oneWay} one way and {taka(lowestRound)} round trip per person, and the crossing takes about 6 to 7 hours.
      </p>
      <p lang="bn" className="mt-2 max-w-3xl font-semibold text-prose">সেন্টমার্টিনের পাঁচটি জাহাজের ভাড়া, সিট, কেবিন ও সময়সূচি এক জায়গায় মিলিয়ে দেখুন।</p>

      <dl className="mt-5 grid grid-cols-2 gap-y-4 rounded-2xl bg-[#f1f8f6] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[#d9e8e4]">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 px-4">
            <dt className="text-xs font-bold text-quiet">{stat.label}</dt>
            <dd className="mt-0.5 text-[1.5rem] font-black leading-tight tabular-nums text-ink sm:text-[1.75rem]">{stat.value}</dd>
            <dd className="mt-0.5 truncate text-xs font-semibold text-quiet">{stat.note}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-ink">
        <li className="inline-flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" className="text-brand" /> Nuniarchhara Jetty, Cox’s Bazar</li>
        <li className="inline-flex items-center gap-1.5"><Ticket size={16} aria-hidden="true" className="text-brand" /> Travel Pass included</li>
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <a href="#ships" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">Compare ships</a>
        <a href="#schedule" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">See schedule</a>
        <Link href="/saint-martin-ship-ticket-price" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">All ticket prices</Link>
      </div>
      <RatingChip updated="6 November 2026" />
    </div>
  )
}

export default function ShipsPage() {
  const boardShips = ships.map((ship) => ({ slug: ship.slug, name: ship.name, rows: getShipSchedule(ship.slug)?.rows, usual: getUsualTimes(ship.slug) }))
  const askSchedule = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, please confirm the Saint Martin ship schedule for my travel date.')}`
  const askDate = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, please check Saint Martin ship availability for my travel date.')}`
  const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

  return (
    <SeoPage eyebrow="Ship directory · জাহাজ" title={h1} intro={description} canonical={url} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <section id="compare" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">Saint Martin ship fares compared</h2>
        <p className="t-small mb-4 text-prose">Lowest published fare per person from Cox’s Bazar, {season.label} season. Confirm the fare for your date before you pay.</p>
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lowest one-way and round-trip fares on all five Saint Martin ships, in Bangladeshi taka</caption>
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Ship</th>
                <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">One way</th>
                <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Round trip</th>
                <th scope="col" className="hidden px-4 py-3 font-bold md:table-cell">Options</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3 font-extrabold text-ink sm:px-4"><Link href={`/saint-martin-ship/${ship.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{ship.name}</Link></th>
                  <td className="px-3 py-3 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.oneWay}</td>
                  <td className="px-3 py-3 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.roundTrip}</td>
                  <td className="hidden px-4 py-3 text-prose md:table-cell">{ship.ticketClasses.length} seat classes, {ship.cabins.length > 0 ? `${ship.cabins.length} cabin types` : 'no cabins published'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-prose">Every seat and cabin fare is on the <Link href="/saint-martin-ship-ticket-price" className="font-bold text-brand-ink underline underline-offset-2">Saint Martin ship ticket price</Link> page.</p>
      </section>

      <section id="ships" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">All Saint Martin ships</h2>
        <p lang="bn" className="mb-5 text-[0.9375rem] font-semibold text-prose">আপনার জন্য কোন জাহাজ ঠিক হবে, দেখে নিন</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ships.map((ship) => <ShipListCard key={ship.slug} ship={ship} cheapest={ship.slug === cheapest.slug} eventLabel="ship_directory" />)}
          <div className="flex flex-col justify-center rounded-3xl bg-[#0d1b2a] p-6 text-white">
            <p className="t-subtitle">Not sure which ship?</p>
            <p className="t-small mt-1 text-on-dark">Send your date and passenger count, and we will suggest what is available.</p>
            <ContactLink href={askDate} kind="whatsapp" eventLabel="ship_list_whatsapp" className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover"><MessageCircle size={16} aria-hidden="true" /> Check on WhatsApp</ContactLink>
            <ContactLink href={phoneHref} kind="phone" eventLabel="ship_list_phone" className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-extrabold transition-colors hover:bg-white/10"><Phone size={16} aria-hidden="true" /> {PHONE_NUMBER}</ContactLink>
          </div>
        </div>
      </section>

      <section id="schedule" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">Saint Martin ship schedule</h2>
        <p className="t-small mb-4 text-prose">Sailing times for the coming days. We have not received updated schedules for every ship yet, and tide and weather can change times, so confirm the time on your ticket.</p>
        <ShipScheduleBoard ships={boardShips} whatsappHref={askSchedule} initialToday={dhakaToday()} />
        <p className="t-small mt-3 text-quiet">* {TEKNAF_TIME_NOTE} Dated times for MV Karnafuly Express and MV Baro Awlia are from Karnafuly Cruise Line’s November 2026 schedule.</p>
        <p className="t-small mt-2 text-prose">See every date on the <Link href="/saint-martin-ship-schedule" className="font-bold text-brand-ink underline underline-offset-2">Saint Martin ship schedule</Link> page, or read <Link href="/blog/saint-martin-ship-status-2026-27" className="font-bold text-brand-ink underline underline-offset-2">which ships are sailing now</Link>.</p>
      </section>

      <section id="book" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">Book a ticket on any of these ships</h2>
        <p className="t-small mb-4 text-prose">{BOOKING_ENABLED ? <Link href="/booking" className="font-bold text-brand-ink underline underline-offset-2">Book online here</Link> : 'Book online through WhatsApp'}, or call our contact number, <a href={phoneHref} className="font-bold text-brand-ink underline underline-offset-2">{PHONE_NUMBER}</a>.</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Choose your ship', 'Compare fares, seats and cabins above.'],
            ...(BOOKING_ENABLED ? [
              ['Add your trip details', 'Choose your dates, seat or cabin, and enter your details.'],
              ['Pay the advance', 'Pay by bKash or bank, then enter your transaction ID.'],
              ['Get your printed ticket', 'Send your payment proof on WhatsApp. Once we confirm, collect your ticket from our office or get it by courier.'],
            ] : [
              ['Send your date', 'Tell us your date, passenger count and category.'],
              ['Confirm and pay', 'We confirm the fare and seats before you pay.'],
              ['Get your printed ticket', 'Collect your ticket from our office or get it by courier.'],
            ]),
          ].map(([heading, text], index) => (
            <li key={heading} className="flex gap-3 rounded-2xl bg-[#f7fbfa] p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-ink text-sm font-black text-white">{index + 1}</span>
              <div>
                <h3 className="font-extrabold leading-snug text-ink">{heading}</h3>
                <p className="t-small mt-0.5 text-prose">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          {BOOKING_ENABLED && <Link href="/booking" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-5 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">Book now</Link>}
          <ContactLink href={askDate} kind="whatsapp" eventLabel="ship_book_section" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition duration-200 ${BOOKING_ENABLED ? 'border border-line text-ink hover:border-brand-ink hover:text-brand-ink' : 'bg-brand-ink text-white hover:bg-brand-ink-hover'}`}><MessageCircle size={16} aria-hidden="true" /> Check on WhatsApp</ContactLink>
          <ContactLink href={phoneHref} kind="phone" eventLabel="ship_book_section" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink"><Phone size={16} aria-hidden="true" /> Call us</ContactLink>
        </div>
        <p className="t-small mt-3 text-prose">Read the step-by-step <Link href="/blog/saint-martin-ship-ticket-booking-guide" className="font-bold text-brand-ink underline underline-offset-2">booking guide</Link> and our <Link href="/booking-policy" className="font-bold text-brand-ink underline underline-offset-2">booking policy</Link>.</p>
      </section>

      <section lang="bn" className="mb-12 rounded-3xl border border-line-soft bg-white p-5 md:p-7">
        <h2 className="t-title">সেন্টমার্টিন জাহাজের তালিকা, ভাড়া ও টিকেট বুকিং</h2>
        <p className="t-body mt-3 text-prose">এই মৌসুমে অনুমোদিত জাহাজ: এমভি কর্ণফুলী এক্সপ্রেস, এমভি বার আউলিয়া ও এমভি টেকনাফ। কেয়ারী ক্রুজ অ্যান্ড ডাইন ও কেয়ারী সিন্দবাদ এখনো ২০২৬–২৭ মৌসুমের অনুমোদন পায়নি। সিটের ভাড়া জনপ্রতি একমুখী {bangla(cheapest.oneWay)} এবং যাওয়া-আসা {bangla(taka(lowestRound))} থেকে শুরু, আর কেবিনের একমুখী ভাড়া {bangla(taka(lowestCabin))} থেকে।</p>
        <p className="t-body mt-3 text-prose">জাহাজ ছাড়ে কক্সবাজারের নুনিয়ারছড়া বিআইডব্লিউটিএ জেটি থেকে, আর পৌঁছাতে সময় লাগে প্রায় ৬ থেকে ৭ ঘণ্টা। এমভি টেকনাফ প্রতিদিন সকাল ৭টায় ছাড়ে। সব জাহাজের হালনাগাদ সময়সূচি এখনো আমাদের হাতে আসেনি, তাই আপনার তারিখের সময় জেনে নিন।</p>
        <p className="t-body mt-3 text-prose">{BOOKING_ENABLED ? <><Link href="/booking" className="font-bold text-brand-ink underline underline-offset-2">বুকিং পাতায়</Link> অনলাইনে টিকেট বুক করুন, অথবা WhatsApp-এ মেসেজ দিন বা কল করুন: </> : 'টিকেট বুকিং করতে WhatsApp-এ মেসেজ দিন বা কল করুন: '}<a href={phoneHref} className="font-bold text-brand-ink underline underline-offset-2">{PHONE_NUMBER}</a>। ধাপে ধাপে দেখুন <Link href="/blog/saint-martin-ship-ticket-booking-guide" className="font-bold text-brand-ink underline underline-offset-2">টিকেট বুকিং গাইডে</Link>, আর পুরো ভাড়া দেখুন <Link href="/saint-martin-ship-ticket-price" className="font-bold text-brand-ink underline underline-offset-2">জাহাজের টিকিটের দাম</Link> পাতায়।</p>
      </section>

      <section className="mb-12">
        <h2 className="t-title mb-1">Which Saint Martin ship should you choose?</h2>
        <p className="t-small mb-4 text-prose">See our full comparison of <Link href="/blog/best-ship-to-saint-martin" className="font-bold text-brand-ink underline underline-offset-2">the best ship to Saint Martin</Link>.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CHOICES.map(({ icon: Icon, title: heading, text }) => (
            <div key={heading} className="flex gap-3 rounded-2xl bg-[#f7fbfa] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e4f2ee] text-brand-ink"><Icon size={19} aria-hidden="true" /></span>
              <div>
                <h3 className="font-extrabold text-ink">{heading}</h3>
                <p className="t-small mt-0.5 text-prose">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="t-title mb-1">Saint Martin ship ticket classes</h2>
        <p className="t-small mb-4 text-prose">Operators use different names for similar seats. These are the types you will find across the five ships.</p>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Open Deck', 'Outdoor seating. On some ships it is the cheapest fare, while on others a named Economy seat costs less.'],
            ['AC Seating and Lounge', 'Indoor air-conditioned seating, listed under different names by each operator.'],
            ['Business or Premium Chair', 'Higher-tier seating, such as Panorama, Riviera, Mozarat and Gladiolus.'],
            ['Cabin', 'Private accommodation. Confirm occupancy and whether the fare is for the person or the cabin.'],
          ].map(([term, text]) => (
            <div key={term} className="rounded-2xl border border-line-soft bg-white p-4">
              <dt className="font-extrabold text-ink">{term}</dt>
              <dd className="t-small mt-1 text-prose">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-12 rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
        <h2 className="t-title">Before you travel to Saint Martin</h2>
        <ul className="t-body mt-3 grid gap-2 text-prose md:grid-cols-2">
          <li>All tourist ships leave from the <a href="https://biwta.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">BIWTA</a> jetty at Nuniarchhara in Cox’s Bazar.</li>
          <li>The season runs from {season.startDate} to {season.endDate}, with up to 3,500 tourists a day.</li>
          <li>Tickets from ShipTickets.bd include the QR-coded pass. The government portal is <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">travelpass.gov.bd</a>.</li>
          <li>The <a href="https://moef.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">Ministry of Environment, Forest and Climate Change</a> sets the season’s <Link href="/saint-martin-travel-rules" className="font-bold text-brand-ink underline underline-offset-2">travel rules</Link>.</li>
        </ul>
      </section>

      <FaqAccordion items={faqs} heading="Saint Martin ship questions" id="faq" />

      <section className="mb-10">
        <h2 className="t-title mb-4">Plan your Saint Martin trip</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['/saint-martin-ship-ticket-price', 'Saint Martin ship ticket prices'],
            ['/saint-martin-cabin-price', 'Cabin and seat class prices'],
            ['/cheapest-saint-martin-ship-ticket', 'Cheapest ship ticket'],
            ['/saint-martin-ship-schedule', 'Ship schedule and departure times'],
            ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin route'],
            ['/routes/coxs-bazar-to-saint-martin-distance', 'Distance and journey time'],
            ['/saint-martin-trip-cost', 'Saint Martin trip cost'],
            ['/saint-martin-travel-pass', 'Travel Pass and QR ticket'],
            ['/saint-martin-travel-rules', 'Travel rules and restrictions'],
            ['/saint-martin-guide', 'Saint Martin travel guide'],
            ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ship ticket'],
            ['/how-we-verify-information', 'How we verify information'],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line-soft bg-white px-4 py-2.5 text-sm font-bold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
                {label}
                <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="t-small mt-3 text-prose">For the island itself, see the <a href="https://www.tripzic.com/destinations/saint-martin-island" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">Saint Martin Island guide</a> and <a href="https://www.tripzic.com/blog/saint-martin-travel-guide" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">travel guide</a> from Tripzic, the travel agency behind ShipTickets.bd. For updates, find us on <a href="https://www.facebook.com/shiptickets" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">Facebook</a>.</p>
      </section>

      <details className="group mb-4 rounded-2xl border border-line-soft bg-white">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
          <h2 className="t-subtitle text-ink">Travelled with us? Share your experience</h2>
          <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="ship-fade px-5 pb-5">
          <p className="t-small text-prose">We publish passenger feedback only when we have received and checked it. Send the ship, your travel date and your rating out of 5 on WhatsApp. It can then appear on that ship’s page, with your name, rating and date.</p>
          <ContactLink href={`${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, I would like to share my experience. Ship: [name]. Travel date: [date]. Rating: [1-5]. Feedback: [your experience].')}`} kind="whatsapp" eventLabel="ship_review_submit" className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl border border-line px-5 text-sm font-extrabold text-ink transition-colors hover:border-brand-ink hover:text-brand-ink">Send your feedback on WhatsApp</ContactLink>
        </div>
      </details>

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
              numberOfItems: ships.length,
              itemListElement: ships.map((ship, index) => ({ '@type': 'ListItem', position: index + 1, name: ship.name, url: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}` })),
            },
            breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Saint Martin ships', url: '/saint-martin-ship' }]),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}
