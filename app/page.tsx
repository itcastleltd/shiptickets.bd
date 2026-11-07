import type { CSSProperties, ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BedDouble, Check, CircleHelp, Handshake, Megaphone, MessageCircle, Phone, ShieldCheck, Ticket, Users, Utensils, Wallet, Waves } from 'lucide-react'
import { BlogCard } from '@/components/blog/blog-cards'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'
import { HomeTripPanel } from '@/components/home-trip-panel'
import { RatingChip, Schema, SeoPage, faqSchema, productSchema, siteSchema, websiteSchema, whatsapp } from '@/components/seo-page'
import { ShipListCard } from '@/components/ship-list-card'
import { ShipScheduleBoard } from '@/components/ship-schedule-board'
import { blogPosts } from '@/content/blog'
import { TEKNAF_TIME_NOTE, dhakaToday, getShipSchedule, getUsualTimes } from '@/content/ship-schedules'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { newestFirst, photosFirst } from '@/lib/blog-helpers'
import { COURIER_NOTE } from '@/lib/contact'
import { PHONE_NUMBER, WHATSAPP_NUMBER, isPreBooking, season, ships, site, type Ship } from '@/lib/ships'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const url = 'https://www.shiptickets.bd/'
const pageTitle = 'Saint Martin Ship Ticket Booking | সেন্টমার্টিন জাহাজের টিকেট'
const link = 'font-bold text-brand-ink underline underline-offset-2'
const card = 'rounded-2xl border border-line-soft bg-white p-5 shadow-card'

const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const bangla = (value: string) => value.replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])
const byFare = [...ships].sort((a, b) => amount(a.oneWay) - amount(b.oneWay))
const cheapest = byFare[0]
const lowestRound = Math.min(...ships.map((ship) => amount(ship.roundTrip)))
const highestSeat = Math.max(...ships.flatMap((ship) => ship.ticketClasses.map((item) => amount(item.oneWayFare))))
const withCabins = ships.filter((ship) => ship.cabins.length > 0)
const lowestCabin = Math.min(...withCabins.flatMap((ship) => ship.cabins.map((cabin) => amount(cabin.oneWayFare)).filter(Boolean)))
const cabinFrom = (ship: Ship) => Math.min(...ship.cabins.map((cabin) => amount(cabin.oneWayFare)).filter(Boolean))
const cabinShips = withCabins.map((ship) => ship.name).join(', ').replace(/, ([^,]*)$/, ' and $1')
const shipFare = (slug: string) => ships.find((ship) => ship.slug === slug)?.oneWay ?? ''
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
const teknaf = getUsualTimes('mv-teknaf')

const h1 = 'Saint Martin Ship Ticket Online Booking'
const description = `Book Saint Martin ship tickets from Cox’s Bazar: compare ships, fares from ${cheapest.oneWay} one way, schedules and cabins. Travel Pass included.`

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description,
  alternates: { canonical: url },
  keywords: ['Saint Martin ship ticket', 'saint martin ship ticket online booking', 'saintmartin ship ticket online', 'ship ticket bd', 'ship ticket booking', 'mv teknaf ship ticket', 'Cox’s Bazar to Saint Martin ship ticket', 'সেন্টমার্টিন জাহাজের টিকিট', 'সেন্টমার্টিন জাহাজ টিকেট বুকিং'],
  openGraph: { type: 'website', url, siteName: 'ShipTickets.bd', locale: 'en_BD', alternateLocale: ['bn_BD'], title: pageTitle, description, images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'ShipTickets.bd - Saint Martin ship tickets' }] },
  twitter: { card: 'summary_large_image', title: pageTitle, description, images: ['/opengraph.jpg'] },
}

const faqs: [string, string][] = [
  ['How do I book a Saint Martin ship ticket online?', BOOKING_ENABLED
    ? 'On our booking page, choose your ship, dates and seat or cabin, then add your name and mobile number. Pay the advance shown at checkout by bKash or bank transfer and enter your transaction ID. You get a booking reference, then send your payment screenshot, NID number and date of birth on WhatsApp. We confirm on WhatsApp after your payment is checked. Collect your printed ticket from our Kawran Bazar office, or we can send it by courier.'
    : `Send your travel date, passenger count and preferred seat or cabin to ShipTickets.bd on WhatsApp, or call ${PHONE_NUMBER}. We confirm the fare and availability, you pay by bKash or bank transfer, and we confirm on WhatsApp after your payment is checked. Collect your printed ticket from our Kawran Bazar office, or we can send it by courier.`],
  ['Do I need a printed ticket?', `Yes. Bring your printed ticket to the jetty. After we confirm your booking on WhatsApp, collect it from our Kawran Bazar office in Dhaka, or we can send it to your address by courier. ${COURIER_NOTE}`],
  ['Do children need to pay?', 'Children under 5 travel free. Count only passengers aged 5 and over when you book.'],
  ...(BOOKING_ENABLED ? [['How much do I pay when I book online?', `You pay a ${site.advancePercentage}% advance to book, and the rest when your ticket is issued, collected or delivered. You can also pay the full fare at once. If your seat or cabin is not available, you can choose another date or ship, or get your advance back in full.`] as [string, string]] : []),
  ['How much is a Saint Martin ship ticket?', `Published seat fares start at ${cheapest.oneWay} one way and ${taka(lowestRound)} round trip per person, and reach ${taka(highestSeat)} one way for the highest lounge. Private cabins start at ${taka(lowestCabin)} one way. Fares vary by ship, seat class and date, so confirm yours before you pay.`],
  ['Can I book a ticket by WhatsApp?', 'Yes. Send your travel date, passenger count and preferred ship or class. Our support team will confirm current availability and the fare before you pay.'],
  ['Do I need a Travel Pass?', 'Yes. Every ship ticket booked through ShipTickets.bd includes the QR-coded Travel Pass, so you do not need to apply for it separately. Government rules can change, so read the latest guidance before your journey.'],
  ['Is food included in the ship ticket?', 'Not necessarily. Whether food comes with your ticket depends on the ticket and the operator’s terms, so confirm before paying.'],
  ['What is the MV Teknaf ship ticket price?', `MV Teknaf has the lowest published fare this season: ${cheapest.oneWay} one way and ${cheapest.roundTrip} round trip per person on Main Deck. It leaves Cox’s Bazar at ${teknaf?.departs} every day.`],
  ['Can I buy a Teknaf to Saint Martin ship ticket?', 'No. For the 2026–27 season, tourist ships leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar, and tourists are not permitted to travel by water from Teknaf. MV Teknaf is only the name of a ship, and it also sails from Cox’s Bazar.'],
  ['What time do Saint Martin ships leave?', `Ships leave Cox’s Bazar in the morning. MV Teknaf leaves at ${teknaf?.departs} every day, and the dated times for MV Karnafuly Express and MV Baro Awlia change with the tide. See the Saint Martin ship schedule, then follow the time on your ticket.`],
  ['How do I go to Saint Martin from Dhaka?', 'First travel from Dhaka to Cox’s Bazar, then board your ship at the BIWTA Nuniarchhara Jetty. The crossing takes about 6 to 7 hours, so plan to reach Cox’s Bazar before your sailing day, especially for an early departure.'],
  ['Is ShipTickets.bd an authorized seller?', 'Yes. ShipTickets.bd is an authorized platform for Saint Martin ship tickets and a corporate partner of all five ships listed on this site.'],
  ['কক্সবাজার থেকে সেন্টমার্টিন কোন জাহাজ যায়?', 'এই মৌসুমের জাহাজ: এমভি কর্ণফুলী এক্সপ্রেস, এমভি বার আউলিয়া, এমভি টেকনাফ, কেয়ারী ক্রুজ অ্যান্ড ডাইন ও কেয়ারী সিন্দবাদ। কেয়ারী জাহাজ দুটির সময়সূচি এখনো প্রকাশ হয়নি, তবে অগ্রিম দিয়ে প্রি-বুকিং চলছে। জাহাজ কক্সবাজারের নুনিয়ারছড়া জেটি থেকে ছাড়ে।'],
  ['সেন্টমার্টিন জাহাজের টিকেটের দাম কত?', `সিটের ভাড়া জনপ্রতি একমুখী ${bangla(cheapest.oneWay)} এবং যাওয়া-আসা ${bangla(taka(lowestRound))} থেকে শুরু। ভাড়া জাহাজ, সিটের ধরন ও তারিখভেদে আলাদা হয়, তাই টাকা দেওয়ার আগে আপনার তারিখের ভাড়া জেনে নিন।`],
]

/**
 * A homepage section with one spacing rhythm. Sections below the first screen
 * are drawn when they come near it; `size` holds their measured heights in px
 * (phone, tablet, desktop), so in-page links still land in the right place.
 */
function Section({ id, title, intro, action, size, lang, children }: { id: string; title: string; intro?: ReactNode; action?: ReactNode; size: [number, number, number]; lang?: string; children: ReactNode }) {
  const style = { '--defer-phone': `${size[0]}px`, '--defer-tablet': `${size[1]}px`, '--defer-desktop': `${size[2]}px` } as CSSProperties
  return (
    <section id={id} lang={lang} style={style} className="defer-section mb-12 scroll-mt-24 md:mb-14">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0 max-w-3xl">
          <h2 className="t-title">{title}</h2>
          {intro && <p className="t-small mt-1.5 text-prose">{intro}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

const textLink = (href: string, label: string) => <Link href={href} className="inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand-ink underline-offset-4 hover:underline">{label} <ArrowRight size={16} aria-hidden="true" /></Link>

function IconBox({ icon: Icon }: { icon: typeof Ticket }) {
  return <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e4f2ee] text-brand-ink"><Icon size={20} aria-hidden="true" /></span>
}

function Hero() {
  const stats = [
    { label: 'One way from', value: cheapest.oneWay, note: cheapest.name },
    { label: 'Round trip from', value: taka(lowestRound), note: cheapest.name },
    { label: 'Ships this season', value: String(ships.length), note: `${ships.filter(isPreBooking).length} open for pre-booking` },
  ]
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-12">
      <div>
        <h1 className="t-display mt-2 max-w-3xl text-[clamp(1.9rem,1.3rem+2.6vw,3.25rem)] text-ink">Saint Martin Ship Ticket Online Booking</h1>
        <p className="t-lede mt-3 max-w-2xl text-prose"><strong className="font-extrabold text-ink">Compare Saint Martin ships from Cox’s Bazar,</strong> {BOOKING_ENABLED ? 'book online or on WhatsApp' : 'send your travel date on WhatsApp'}, and get your ticket from ShipTickets.bd with the Travel Pass included.</p>
        <p lang="bn" className="mt-2 max-w-2xl font-semibold text-prose">সেন্টমার্টিনের জাহাজের টিকেট: ভাড়া দেখুন, {BOOKING_ENABLED ? 'তারিখ বেছে নিন' : 'তারিখ জানান'}, টিকেট নিন।</p>
      </div>
      <div className="lg:row-span-2 lg:mt-2"><HomeTripPanel ships={ships.map(({ slug, name }) => ({ slug, name }))} minDate={season.startISO} maxDate={season.endISO} bookingEnabled={BOOKING_ENABLED} whatsappNumber={WHATSAPP_NUMBER} phoneHref={phoneHref} phoneNumber={PHONE_NUMBER} /></div>
      <div>
        <dl className="grid grid-cols-3 divide-x divide-[#d9e8e4] rounded-2xl bg-[#f1f8f6] py-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 px-3 sm:px-4">
              <dt className="text-xs font-bold text-quiet">{stat.label}</dt>
              <dd className="mt-0.5 text-[1.3rem] font-black leading-tight tabular-nums text-ink sm:text-[1.75rem]">{stat.value}</dd>
              <dd className="mt-0.5 text-xs font-semibold text-quiet">{stat.note}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-4 grid gap-x-4 gap-y-2 text-sm font-bold text-ink sm:grid-cols-2">
          {['Corporate partner of all 5 ships', '9,000+ tourists served in 4 years', 'Travel Pass included', 'bKash and bank payment'].map((item) => (
            <li key={item} className="flex items-center gap-1.5"><Check size={16} aria-hidden="true" className="shrink-0 text-brand" /> {item}</li>
          ))}
        </ul>
        <RatingChip updated="6 November 2026" />
      </div>
    </div>
  )
}

export default function Page() {
  const boardShips = ships.map((ship) => ({ slug: ship.slug, name: ship.name, rows: getShipSchedule(ship.slug)?.rows, usual: getUsualTimes(ship.slug) }))
  const askSchedule = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, please confirm the Saint Martin ship schedule for my travel date.')}`
  const askTicket = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, I want help finding the right Saint Martin ship ticket.')}`

  return (
    <SeoPage eyebrow="Ship tickets · জাহাজের টিকেট" title={h1} intro={description} canonical={url} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <section id="price" className="mb-12 scroll-mt-24 md:mb-14">
        <div className="mb-5">
          <h2 className="t-title">Saint Martin ship ticket price 2026–27</h2>
          <p className="t-small mt-1.5 text-prose">Lowest published fare per person from Cox’s Bazar. Fares vary by seat class and date, so confirm yours before you pay.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lowest one-way, round-trip and cabin fares on all five Saint Martin ships, in Bangladeshi taka</caption>
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Ship</th>
                <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">One way</th>
                <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Round trip</th>
                <th scope="col" className="hidden px-4 py-3 text-right font-bold md:table-cell">Cabins from</th>
                <th scope="col" className="hidden px-4 py-3 font-bold lg:table-cell">Options</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3.5 font-extrabold text-ink sm:px-4"><Link href={`/saint-martin-ship/${ship.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{ship.name}</Link></th>
                  <td className="px-3 py-3.5 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.oneWay}</td>
                  <td className="px-3 py-3.5 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.roundTrip}</td>
                  <td className="hidden px-4 py-3.5 text-right tabular-nums text-prose md:table-cell">{ship.cabins.length > 0 ? taka(cabinFrom(ship)) : 'Seats only'}</td>
                  <td className="hidden px-4 py-3.5 text-prose lg:table-cell">{ship.ticketClasses.length} seat classes{ship.cabins.length > 0 ? `, ${ship.cabins.length} cabin types` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-prose">See every seat and cabin fare in our <Link href="/saint-martin-ship-ticket-price" className={link}>Saint Martin ship ticket price guide</Link>, or find the <Link href="/cheapest-saint-martin-ship-ticket" className={link}>cheapest ship ticket</Link>. The lowest fare is on the <Link href="/saint-martin-ship/mv-teknaf" className={link}>MV Teknaf ship ticket</Link>. The two Keari ships have not published their schedules yet, and pre-booking is open.</p>
      </section>

      <Section id="ships" title="Choose your Saint Martin ship" intro={`MV Teknaf ship tickets have the lowest published fare, from ${cheapest.oneWay} one way.`} action={textLink('/saint-martin-ship', 'Compare all Saint Martin ships')} size={[2276, 1719, 1193]}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ships.map((ship) => <ShipListCard key={ship.slug} ship={ship} cheapest={ship.slug === cheapest.slug} eventLabel="ship_booking" />)}
          <div className="hidden flex-col justify-center rounded-3xl bg-[#0d1b2a] p-6 text-white sm:flex">
            <p className="t-subtitle">Not sure which ship?</p>
            <p className="t-small mt-1 text-on-dark">Send your date and passenger count, and we’ll suggest what is available.</p>
            <ContactLink href={askTicket} kind="whatsapp" eventLabel="ship_list_whatsapp" className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover"><MessageCircle size={16} aria-hidden="true" /> Ask on WhatsApp</ContactLink>
            <ContactLink href={phoneHref} kind="phone" eventLabel="ship_list_phone" className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-extrabold transition-colors hover:bg-white/10"><Phone size={16} aria-hidden="true" /> {PHONE_NUMBER}</ContactLink>
          </div>
        </div>
      </Section>

      <Section id="ticket-types" title="Which Saint Martin ticket should you choose?" intro="Start with what matters most on your trip. Fares are per person, one way." size={[990, 623, 357]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Ticket, heading: 'Lowest fare', price: `From ${cheapest.oneWay}`, text: 'MV Teknaf has the lowest published fare, on Main Deck.', href: '/cheapest-saint-martin-ship-ticket', label: 'Cheapest ship ticket' },
            { icon: Waves, heading: 'Open-air seating', price: `From ${shipFare('keari-sindbad')}`, text: 'Keari Sindbad publishes non-AC deck seating, including open deck.', href: '/saint-martin-ship/keari-sindbad', label: 'Keari Sindbad seats' },
            { icon: Utensils, heading: 'AC lounge and dining', price: `From ${shipFare('keari-cruise-dine')}`, text: 'Keari Cruise & Dine has AC lounges and a floating restaurant.', href: '/saint-martin-ship/keari-cruise-dine', label: 'Keari Cruise & Dine seats' },
            { icon: BedDouble, heading: 'A private cabin', price: `From ${taka(lowestCabin)}`, text: `Published on ${cabinShips}.`, href: '/saint-martin-cabin-price', label: 'Cabin price guide' },
          ].map(({ icon, heading, price, text, href, label }) => (
            <article key={heading} className={`${card} flex gap-3 sm:flex-col sm:gap-0`}>
              <IconBox icon={icon} />
              <div className="flex min-w-0 flex-1 flex-col sm:mt-4">
                <h3 className="font-extrabold text-ink">{heading}</h3>
                <p className="mt-0.5 text-lg font-black tabular-nums text-brand-ink">{price}</p>
                <p className="t-small mt-1.5 flex-1 text-prose">{text}</p>
                <div className="mt-1">{textLink(href, label)}</div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="included" title="What your Saint Martin ship ticket includes" size={[580, 299, 285]}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-6">
            <h3 className="t-subtitle">Included with your ticket</h3>
            <ul className="t-small mt-3 grid gap-2.5 text-prose">
              {['Your seat or cabin on the ship you choose', 'The QR-coded Travel Pass, with no separate application', 'The ৳100 environmental conservation fee'].map((item) => <li key={item} className="flex gap-2"><Check size={18} aria-hidden="true" className="shrink-0 text-brand" /> {item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#f3d9bf] bg-[#fff8ee] p-5 md:p-6">
            <h3 className="t-subtitle">Confirm before you pay</h3>
            <ul className="t-small mt-3 grid gap-2.5 text-prose">
              {['The fare and availability for your exact date', 'Whether meals come with your ticket', 'For cabins, how many people it holds and if the fare is per person or per cabin', 'Your return date and sailing time'].map((item) => <li key={item} className="flex gap-2"><CircleHelp size={18} aria-hidden="true" className="shrink-0 text-[#b7791f]" /> {item}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="schedule" title="Saint Martin ship times this week" intro="Pick a date to compare the ships. Tide and weather can change times, so follow the time on your ticket." size={[721, 514, 498]}>
        <ShipScheduleBoard ships={boardShips} whatsappHref={askSchedule} initialToday={dhakaToday()} />
        <p className="t-small mt-3 text-quiet">* {TEKNAF_TIME_NOTE}</p>
        <p className="t-small mt-2 text-prose">See every date and return time on the <Link href="/saint-martin-ship-schedule" className={link}>Saint Martin ship schedule</Link>.</p>
      </Section>

      <Section id="book" title={`How to book a Saint Martin ship ticket${BOOKING_ENABLED ? ' online' : ''}`} intro={<>{BOOKING_ENABLED ? <Link href="/booking" className={link}>Book online here</Link> : 'Book through WhatsApp'}, or call us on <a href={phoneHref} className={link}>{PHONE_NUMBER}</a>.</>} size={[725, 475, 329]}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(BOOKING_ENABLED ? [
            ['Choose your trip', 'Pick your ship, dates, and the seat or cabin you want.'],
            ['Add your details', 'Enter the name and mobile number for your ticket.'],
            ['Pay the advance', 'Pay by bKash or bank, then enter your transaction ID.'],
            ['Message us on WhatsApp', 'Send your payment screenshot, NID and date of birth. Once we confirm, collect your printed ticket from our office or get it by courier.'],
          ] : [
            ['Tell us your trip', 'Send your date, passenger count and the seat or cabin you want.'],
            ['Get your fare', 'We confirm the fare and availability before you pay anything.'],
            ['Pay by bKash or bank', 'Send your payment, then share the transaction ID with us.'],
            ['Get your printed ticket', 'We confirm on WhatsApp after your payment is checked. Collect your ticket from our office or get it by courier.'],
          ]).map(([heading, text], index) => (
            <li key={heading} className={`${card} flex gap-3 sm:block`}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-ink text-sm font-black text-white">{index + 1}</span>
              <div className="min-w-0 sm:mt-3">
                <h3 className="font-extrabold leading-snug text-ink">{heading}</h3>
                <p className="t-small mt-1 text-prose">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="t-small mt-4 text-prose">Read the step-by-step <Link href="/blog/saint-martin-ship-ticket-booking-guide" className={link}>booking guide</Link> and our <Link href="/booking-policy" className={link}>booking policy</Link>.</p>
      </Section>

      <Section id="contact" title="Talk to our ticket team" intro={<>Talk to a real person in Bangla or English. See all <Link href="/contact" className={link}>contact details</Link>.</>} size={[662, 321, 305]}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={card}>
            <div className="flex items-center gap-3"><IconBox icon={Phone} /><h3 className="font-extrabold text-ink">Call us</h3></div>
            <p className="t-small mt-3 hidden text-prose md:block">Best when you want a quick answer about a date.</p>
            <ContactLink href={phoneHref} kind="phone" eventLabel="home_contact" className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-line px-4 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">{PHONE_NUMBER}</ContactLink>
          </div>
          <div className={card}>
            <div className="flex items-center gap-3"><IconBox icon={MessageCircle} /><h3 className="font-extrabold text-ink">WhatsApp</h3></div>
            <p className="t-small mt-3 text-prose">{BOOKING_ENABLED ? 'Best for booking help, and for sending your payment proof.' : 'Best for booking, as you can send your details and payment proof.'}</p>
            <ContactLink href={askTicket} kind="whatsapp" eventLabel="home_contact" className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-4 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">Message on WhatsApp</ContactLink>
          </div>
          <div className={card}>
            <div className="flex items-center gap-3"><IconBox icon={Megaphone} /><h3 className="font-extrabold text-ink">Facebook</h3></div>
            <p className="t-small mt-3 hidden text-prose md:block">Follow our page for Saint Martin season and ship updates.</p>
            <a href="https://www.facebook.com/shiptickets" target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-line px-4 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">Visit our Facebook page</a>
          </div>
        </div>
      </Section>

      <Section id="journey" title="How to go to Saint Martin from Cox’s Bazar" intro="The whole trip, from Dhaka or anywhere else in Bangladesh, comes down to four steps." size={[732, 435, 288]}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { heading: 'Reach Cox’s Bazar', text: <>Arrive before your sailing day, especially for an early departure. See the <Link href="/blog/dhaka-to-saint-martin-travel-guide" className={link}>Dhaka to Saint Martin guide</Link>.</> },
            { heading: 'Go to Nuniarchhara Jetty', text: <>Tourist ships leave from the <a href="https://biwta.gov.bd/" target="_blank" rel="noopener noreferrer" className={link}>BIWTA</a> jetty, not from Teknaf. Be there at least 1 hour early.</> },
            { heading: 'Sail for 6 to 7 hours', text: <>The crossing covers about 120 km. Read about the <Link href="/routes/coxs-bazar-to-saint-martin" className={link}>Cox’s Bazar to Saint Martin route</Link>.</> },
            { heading: 'Stay or return', text: <>Overnight stays are allowed this season. Check the <Link href="/blog/saint-martin-overnight-stay-rules" className={link}>overnight rules</Link> and your <Link href="/saint-martin-trip-cost" className={link}>trip cost</Link>.</> },
          ].map(({ heading, text }, index) => (
            <li key={heading} className={`${card} flex gap-3 sm:block`}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e4f2ee] text-sm font-black text-brand-ink">{index + 1}</span>
              <div className="min-w-0 sm:mt-3">
                <h3 className="font-extrabold leading-snug text-ink">{heading}</h3>
                <p className="t-small mt-1 text-prose">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="trust" title="Why book your ship ticket with ShipTickets.bd" size={[819, 401, 337]}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Handshake, heading: 'Partner of all 5 ships', text: 'An authorized platform with corporate agreements across every ship listed here.' },
            { icon: Users, heading: '9,000+ tourists served', text: 'We have helped travellers reach Saint Martin for 4 years.' },
            { icon: Ticket, heading: 'Travel Pass included', text: 'Your ticket includes the QR-coded pass, so there is no separate application.' },
            { icon: Wallet, heading: 'No surprises on price', text: BOOKING_ENABLED ? 'You see your total and advance before you pay, and a real support team helps on WhatsApp or by phone.' : 'A real support team confirms your fare on WhatsApp or by phone before you pay.' },
          ].map(({ icon, heading, text }) => (
            <div key={heading} className={`${card} flex gap-3 lg:block`}>
              <IconBox icon={icon} />
              <div className="min-w-0 lg:mt-4">
                <h3 className="font-extrabold text-ink">{heading}</h3>
                <p className="t-small mt-1 text-prose">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="t-small mt-4 flex gap-2 text-prose"><ShieldCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" /><span>ShipTickets.bd is operated by <a href="https://www.tripzic.com" target="_blank" rel="noopener noreferrer" className={link}>Tripzic</a>. See <Link href="/how-we-verify-information" className={link}>how we verify ship information</Link>.</span></p>
      </Section>

      <Section id="guide" title="Saint Martin ship ticket: key facts for 2026–27" size={[913, 521, 389]}>
        <div className="rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Season', `${season.startDate} to ${season.endDate}`],
              ['Departure point', 'BIWTA Nuniarchhara Jetty, Cox’s Bazar'],
              ['Journey', 'About 120 km, about 6 to 7 hours'],
              ['Lowest fare', `${cheapest.oneWay} one way, ${taka(lowestRound)} round trip`],
              ['Daily limit', 'Up to 3,500 tourists a day'],
              ['Overnight stays', 'Allowed this season'],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-xs font-bold text-quiet">{term}</dt>
                <dd className="mt-0.5 font-extrabold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="t-small mt-5 text-prose">The government portal is <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className={link}>travelpass.gov.bd</a>, and the <a href="https://moef.gov.bd/" target="_blank" rel="noopener noreferrer" className={link}>Ministry of Environment, Forest and Climate Change</a> sets the season’s rules.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['/saint-martin-travel-pass', 'Travel Pass and QR ticket'],
              ['/saint-martin-travel-rules', 'Travel rules and restrictions'],
              ['/routes/coxs-bazar-to-saint-martin-distance', 'Distance and journey time'],
              ['/saint-martin-guide', 'Saint Martin travel guide'],
              ['/blog/saint-martin-ship-status-2026-27', 'Which ships are sailing now'],
              ['/saint-martin-trip-cost', 'Saint Martin trip cost'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line-soft bg-white px-4 py-2.5 text-sm font-bold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
                  {label}
                  <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="bangla" lang="bn" title="সেন্টমার্টিন জাহাজের টিকেট: ভাড়া, সময় ও বুকিং" size={[738, 411, 358]}>
        <div className="rounded-3xl border border-line-soft bg-white p-5 shadow-card md:p-7">
          <p className="t-body text-prose">এই মৌসুমের জাহাজ: এমভি কর্ণফুলী এক্সপ্রেস, এমভি বার আউলিয়া, এমভি টেকনাফ, কেয়ারী ক্রুজ অ্যান্ড ডাইন ও কেয়ারী সিন্দবাদ। কেয়ারী জাহাজ দুটির সময়সূচি এখনো প্রকাশ হয়নি, তবে অগ্রিম দিয়ে প্রি-বুকিং চলছে। অনেকে একে লঞ্চের টিকেটও বলেন। জাহাজের টিকিটের দাম জনপ্রতি একমুখী {bangla(cheapest.oneWay)} এবং যাওয়া-আসা {bangla(taka(lowestRound))} থেকে শুরু, আর কেবিনের একমুখী ভাড়া {bangla(taka(lowestCabin))} থেকে।</p>
          <p className="t-body mt-3 text-prose">জাহাজ ছাড়ে কক্সবাজারের নুনিয়ারছড়া বিআইডব্লিউটিএ জেটি থেকে। এমভি টেকনাফ প্রতিদিন সকাল ৭টায় ছাড়ে, আর অন্য জাহাজের সময় তারিখভেদে বদলাতে পারে। দেখে নিন <Link href="/saint-martin-ship-schedule" className={link}>জাহাজের সময়সূচি</Link>।</p>
          <p className="t-body mt-3 text-prose">{BOOKING_ENABLED ? <><Link href="/booking" className={link}>বুকিং পাতায়</Link> অনলাইনে টিকেট বুক করুন, অথবা WhatsApp-এ মেসেজ দিন বা কল করুন: </> : 'টিকেট বুকিং করতে যাত্রার তারিখ ও যাত্রীর সংখ্যা জানিয়ে WhatsApp-এ মেসেজ দিন, অথবা কল করুন: '}<a href={phoneHref} className={link}>{PHONE_NUMBER}</a>। ট্রাভেল পাস টিকেটের সঙ্গেই থাকে। বিস্তারিত দেখুন <Link href="/blog/saint-martin-ship-ticket-booking-guide" className={link}>টিকেট বুকিং গাইডে</Link>।</p>
        </div>
      </Section>

      <Section id="blog" title="Latest Saint Martin travel updates" action={textLink('/blog', 'All posts')} size={[1046, 1011, 567]}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photosFirst(newestFirst(blogPosts)).slice(0, 3).map((post, index) => <div key={post.slug} className={index === 2 ? 'hidden sm:block' : undefined}><BlogCard post={post} headingAs="p" /></div>)}
        </div>
        <p className="t-small mt-4 text-prose">Popular guides: <Link href="/blog/saint-martin-ship-ticket-price" className={link}>ship ticket prices explained</Link>, <Link href="/blog/best-ship-to-saint-martin" className={link}>the best ship to Saint Martin</Link> and <Link href="/blog/saint-martin-cheapest-ship-ticket" className={link}>the cheapest ship</Link>.</p>
      </Section>

      <div id="faq" className="scroll-mt-44"><FaqAccordion items={faqs} heading="Saint Martin ship ticket questions" /></div>

      <section className="mb-4 flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#0d1b2a] p-6 text-white md:flex-row md:items-center md:p-8">
        <div>
          <h2 className="t-title text-white">Let’s find the right ticket</h2>
          <p className="t-small mt-1 text-on-dark">Share your date and passenger count, and we’ll guide you from there.</p>
        </div>
        <ContactLink href={askTicket} kind="whatsapp" eventLabel="start_whatsapp" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover"><MessageCircle size={17} aria-hidden="true" /> Start on WhatsApp</ContactLink>
      </section>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            { '@type': 'TravelAgency', '@id': 'https://www.shiptickets.bd/#business', name: 'ShipTickets.bd', url, image: 'https://www.shiptickets.bd/opengraph.jpg', telephone: '+880-1718-116799', address: { '@type': 'PostalAddress', streetAddress: site.office.split(', Dhaka')[0], addressLocality: 'Dhaka', postalCode: site.office.match(/\d{4}$/)?.[0], addressCountry: 'BD' }, areaServed: { '@type': 'Country', name: 'Bangladesh' }, priceRange: '$$', openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => `https://schema.org/${day}`), opens: '09:00', closes: '21:00' } },
            websiteSchema,
            ...ships.map(productSchema),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}
