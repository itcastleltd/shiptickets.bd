import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CloudRain, MapPin, MessageCircle, Phone, ShieldCheck, Ticket, Waves } from 'lucide-react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'
import { RatingChip, Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema, whatsapp } from '@/components/seo-page'
import { ScheduleDateTable, ShipScheduleBoard } from '@/components/ship-schedule-board'
import { DATED_SCHEDULE_PERIOD, SCHEDULE_TIME_NOTE, dhakaToday, getShipSchedule, getUsualTimes } from '@/content/ship-schedules'
import { PHONE_NUMBER, season, ships } from '@/lib/ships'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const url = 'https://www.shiptickets.bd/saint-martin-ship-schedule'
const pageTitle = 'Saint Martin Ship Schedule 2026-27: Departure Times'
const h1 = 'Saint Martin Ship Schedule 2026–27: Departure & Return Times'
const description = 'Saint Martin ship schedule for 2026-27: date-by-date departure and return times for MV Teknaf, Karnafuly and Baro Awlia, plus jetty details.'
const link = 'font-bold text-brand-ink underline underline-offset-2'

const datedRows = getShipSchedule('baro-awlia')?.rows ?? []
const teknafRows = getShipSchedule('mv-teknaf')?.rows ?? []

/** Minutes after midnight, so the earliest and latest times come from the table itself. */
const minutes = (time: string) => {
  const [, hour, minute, period] = time.match(/^(\d+):(\d+) (AM|PM)$/) ?? []
  return ((Number(hour) % 12) + (period === 'PM' ? 12 : 0)) * 60 + Number(minute)
}
const earliestOf = (times: string[]) => [...times].sort((a, b) => minutes(a) - minutes(b))[0]
const latestOf = (times: string[]) => [...times].sort((a, b) => minutes(b) - minutes(a))[0]
const firstDeparture = earliestOf(datedRows.map((row) => row.departs))
const lastDeparture = latestOf(datedRows.map((row) => row.departs))
const firstReturn = earliestOf(datedRows.map((row) => row.returns))
const lastReturn = latestOf(datedRows.map((row) => row.returns))

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description,
  alternates: { canonical: url },
  keywords: ['saint martin ship schedule', 'saint martin ship schedule 2026', 'saint martin ship time schedule', 'saint martin to cox’s bazar ship time', 'cox’s bazar to saint martin ship time', 'keari sindbad ship schedule', 'saint martin cruise ship schedule', 'সেন্টমার্টিন জাহাজের সময়সূচি', 'সেন্টমার্টিন জাহাজ কয়টায় ছাড়ে'],
  openGraph: { title: pageTitle, description, url, type: 'website', siteName: 'ShipTickets.bd', locale: 'en_BD', alternateLocale: ['bn_BD'], images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Saint Martin ship schedule from ShipTickets.bd' }] },
  twitter: { card: 'summary_large_image', title: pageTitle, description, images: ['/opengraph.jpg'] },
}

const faqs: [string, string][] = [
  ['What time do ships leave Cox’s Bazar for Saint Martin?', `Saint Martin ships leave Cox’s Bazar in the morning. MV Teknaf, MV Karnafuly Express and MV Baro Awlia change with the tide, between ${firstDeparture} and ${lastDeparture} in ${DATED_SCHEDULE_PERIOD}. Follow the time printed on your ticket.`],
  ['Where can I see today’s Saint Martin ship schedule?', 'The date buttons at the top of this page show every ship’s times for today and the next few days. Today is worked out in Bangladesh time, so it moves forward by itself.'],
  ['What time does the ship leave Saint Martin for Cox’s Bazar?', `Return sailings leave Saint Martin in the afternoon. On MV Teknaf, MV Karnafuly Express and MV Baro Awlia, they leave between ${firstReturn} and ${lastReturn} in ${DATED_SCHEDULE_PERIOD}, depending on the date.`],
  ['What is the MV Teknaf schedule?', `In ${DATED_SCHEDULE_PERIOD}, MV Teknaf leaves Cox’s Bazar between ${firstDeparture} and ${lastDeparture} and Saint Martin between ${firstReturn} and ${lastReturn}, depending on the date. See its table on this page, and follow the time printed on your ticket.`],
  ['What is the Keari Sindbad ship schedule?', 'Keari Sindbad and Keari Cruise & Dine have not published their 2026–27 schedules yet. Pre-booking is open with an advance, and we confirm your date and time on WhatsApp once the schedule is published.'],
  ['How early should I arrive at the jetty?', 'Arrive at least 1 hour before departure for check-in and boarding. Some operators list their own reporting time, which may be earlier, so follow the time printed on your ticket.'],
  ['Can Saint Martin ship schedules change?', 'Yes. Weather, tide, sea conditions and government permission can affect both departure and return times. Confirm any change on the day of travel.'],
  ['Where do Saint Martin ships depart from?', 'In the 2026–27 season, tourist ships leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar. Tourists are not permitted to travel by water from Teknaf. MV Teknaf is only the name of a ship, and it also sails from Cox’s Bazar.'],
  ['Can I go to Saint Martin and come back the same day?', `It depends on the date. A 7:00 AM sailing that takes 6 to 7 hours reaches the island around 1:00 to 2:00 PM, and that date’s return leaves at 3:00 PM, so you get about 1 to 2 hours. Overnight stays are allowed this season, which gives you far more time on the island.`],
  ['When is Saint Martin open for tourists in 2026?', `The 2026–27 tourist season runs from ${season.startDate} to ${season.endDate}, with overnight stays allowed and up to 3,500 tourists a day. Tourist ships began sailing on 5 November 2026.`],
  ['সেন্টমার্টিনের জাহাজ কয়টায় ছাড়ে?', 'জাহাজ সকালে কক্সবাজারের নুনিয়ারছড়া জেটি থেকে ছাড়ে। এমভি টেকনাফ, এমভি কর্ণফুলী এক্সপ্রেস ও এমভি বার আউলিয়ার সময় তারিখভেদে বদলায়, নভেম্বর ২০২৬-এ ভোর ৪টা থেকে সকাল ১০টার মধ্যে। টিকেটে লেখা সময় দেখে নিন।'],
  ['সেন্টমার্টিন থেকে কক্সবাজারের জাহাজ কয়টায় ছাড়ে?', 'ফেরার জাহাজ বিকেলে ছাড়ে। নভেম্বর ২০২৬-এ এমভি টেকনাফ, এমভি কর্ণফুলী এক্সপ্রেস ও এমভি বার আউলিয়া তারিখভেদে বিকেল ৩টা থেকে ৫টার মধ্যে ছাড়ে।'],
  ['জেটিতে কখন পৌঁছাতে হবে?', 'জাহাজ ছাড়ার অন্তত ১ ঘণ্টা আগে জেটিতে পৌঁছে যান। টিকেটে আলাদা রিপোর্টিং সময় লেখা থাকলে সেই সময় মেনে চলুন।'],
]

function Hero() {
  const stats = [
    { label: 'Leaves Cox’s Bazar', value: `${firstDeparture.replace(':00 AM', '')}–${lastDeparture.replace(':00 AM', '')} AM`, note: `changes by date, ${DATED_SCHEDULE_PERIOD}` },
    { label: 'Leaves Saint Martin', value: `${firstReturn.replace(':00 PM', '')}–${lastReturn.replace(':00 PM', '')} PM`, note: `changes by date, ${DATED_SCHEDULE_PERIOD}` },
    { label: 'Reach the jetty', value: '1 hour', note: 'before departure' },
    { label: 'Journey time', value: '6–7 hrs', note: 'about 120 km' },
  ]
  return (
    <div>
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Saint Martin ships', href: '/saint-martin-ship' }, { name: 'Schedule' }]} />
      <h1 className="t-display mt-4 max-w-4xl text-[clamp(1.85rem,1.25rem+2.5vw,3.1rem)] text-ink">Saint Martin Ship Schedule <span className="whitespace-nowrap">2026–27:</span> Departure &amp; Return Times</h1>
      <p className="t-lede mt-3 max-w-3xl text-prose">
        <strong className="font-extrabold text-ink">Saint Martin ships leave Cox’s Bazar in the morning.</strong> MV Teknaf, MV Karnafuly Express and MV Baro Awlia change with the tide, from {firstDeparture} to {lastDeparture} in {DATED_SCHEDULE_PERIOD}.
      </p>
      <p lang="bn" className="mt-2 max-w-3xl font-semibold text-prose">কোন জাহাজ কোন তারিখে কখন ছাড়ে ও ফেরে, এখানে দেখে নিন।</p>

      <dl className="mt-5 grid grid-cols-2 gap-y-4 rounded-2xl bg-[#f1f8f6] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[#d9e8e4]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-col px-4">
            <dt className="text-xs font-bold text-quiet">{stat.label}</dt>
            <dd className="mt-0.5 text-[1.5rem] font-black leading-tight tabular-nums text-ink sm:text-[1.75rem]">{stat.value}</dd>
            <dd className="mt-0.5 text-xs font-semibold text-quiet">{stat.note}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-ink">
        <li className="inline-flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" className="text-brand" /> Nuniarchhara Jetty, Cox’s Bazar</li>
        <li className="inline-flex items-center gap-1.5"><Ticket size={16} aria-hidden="true" className="text-brand" /> Travel Pass included</li>
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <a href="#by-date" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-5 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">Check today’s times</a>
        <a href="#november" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">All {DATED_SCHEDULE_PERIOD.split(' ')[0]} dates</a>
        <a href="#return" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line bg-white px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">Return times</a>
      </div>
      <RatingChip updated="7 November 2026" />
    </div>
  )
}

export default function SchedulePage() {
  const boardShips = ships.map((ship) => ({ slug: ship.slug, name: ship.name, rows: getShipSchedule(ship.slug)?.rows, usual: getUsualTimes(ship.slug) }))
  const askSchedule = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, please confirm the Saint Martin ship schedule for my travel date.')}`
  const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

  return (
    <SeoPage eyebrow="Schedule · সময়সূচি" title={h1} intro={description} canonical={url} modifiedISO="2026-11-07" updated="7 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <section id="by-date" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">Saint Martin ship time schedule by date</h2>
        <p className="t-small mb-4 text-prose">Pick a date to compare every ship. Tide and weather can change times, so follow the time on your ticket.</p>
        <ShipScheduleBoard ships={boardShips} whatsappHref={askSchedule} initialToday={dhakaToday()} />
        <p className="t-small mt-3 text-quiet">{SCHEDULE_TIME_NOTE}</p>
      </section>

      <section id="november" className="mb-12 scroll-mt-24 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
        <div>
          <h2 className="t-title mb-1">MV Karnafuly Express and MV Baro Awlia schedule: {DATED_SCHEDULE_PERIOD}</h2>
          <p className="t-small mb-4 text-prose">Both ships use Karnafuly Cruise Line’s published times from Cox’s Bazar to Saint Martin and back. Departure times are subject to tide.</p>
          <ScheduleDateTable rows={datedRows} caption={`MV Karnafuly Express and MV Baro Awlia departure and return times for ${DATED_SCHEDULE_PERIOD}`} whatsappHref={askSchedule} initialToday={dhakaToday()} />
          <h3 id="mv-teknaf-november" className="t-title mb-1 mt-8 scroll-mt-24">MV Teknaf schedule: {DATED_SCHEDULE_PERIOD}</h3>
          <p className="t-small mb-4 text-prose">MV Teknaf’s published times from Cox’s Bazar to Saint Martin and back. Departure times are subject to tide.</p>
          <ScheduleDateTable rows={teknafRows} caption={`MV Teknaf departure and return times for ${DATED_SCHEDULE_PERIOD}`} whatsappHref={askSchedule} initialToday={dhakaToday()} />
        </div>
        <aside className="mt-5 grid gap-3 lg:sticky lg:top-24 lg:mt-0">
          <div className="rounded-2xl bg-[#fff8ee] p-4">
            <h3 className="font-extrabold text-ink">Very early sailings</h3>
            <p className="t-small mt-1 text-prose">Dates marked “Very early” leave at 5:00 AM or before. For a 4:00 AM sailing on 16 to 18 November, be at the jetty by 3:00 AM, so plan to stay nearby the night before.</p>
          </div>
          <div className="rounded-2xl bg-[#0d1b2a] p-5 text-white">
            <p className="t-subtitle">Confirm your date</p>
            <p className="t-small mt-1 text-on-dark">Send your travel date and ship. We’ll confirm the sailing, reporting time and jetty before you pay.</p>
            <ContactLink href={askSchedule} kind="whatsapp" eventLabel="schedule_whatsapp" className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover"><MessageCircle size={16} aria-hidden="true" /> Confirm on WhatsApp</ContactLink>
            <ContactLink href={phoneHref} kind="phone" eventLabel="schedule_phone" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-extrabold transition-colors hover:bg-white/10"><Phone size={16} aria-hidden="true" /> {PHONE_NUMBER}</ContactLink>
          </div>
        </aside>
      </section>

      <section id="by-ship" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">Schedule for each Saint Martin ship</h2>
        <p className="t-small mb-4 text-prose">What we have for each ship in the {season.label} season. Ships leave from Cox’s Bazar.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boardShips.map((board) => {
            const ship = ships.find((item) => item.slug === board.slug)
            const status = board.rows ? `Dated times for ${DATED_SCHEDULE_PERIOD}` : board.usual ? 'Same time every day' : 'Schedule not published yet'
            return (
              <article key={board.slug} className="flex flex-col rounded-2xl border border-line-soft bg-white p-4">
                <h3 className="font-extrabold text-ink"><Link href={`/saint-martin-ship/${board.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{board.name} schedule</Link></h3>
                <p className="t-small text-quiet">{ship?.operator}</p>
                <p className={`mt-2 w-fit rounded-lg px-2.5 py-1 text-[0.8125rem] font-semibold ${board.rows || board.usual ? 'bg-[#eef5f3] text-[#1d5c4b]' : 'bg-[#fff8ee] text-[#7a4f00]'}`}>{status}</p>
                <p className="t-small mt-2 flex-1 text-prose">
                  {board.rows && <>{board.name} leaves Cox’s Bazar between {firstDeparture} and {lastDeparture}, and Saint Martin between {firstReturn} and {lastReturn}. <a href={board.slug === 'mv-teknaf' ? '#mv-teknaf-november' : '#november'} className={link}>See every date</a>.</>}
                  {board.usual && <>Leaves Cox’s Bazar at {board.usual.departs} and Saint Martin at {board.usual.returns} every day.</>}
                  {!board.rows && !board.usual && <>{board.name} has not published its schedule yet, and pre-booking is open. <a href={askSchedule} className={link}>Ask for your date</a>.</>}
                </p>
                <Link href={`/saint-martin-ship/${board.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand-ink underline-offset-4 hover:underline">{board.name} fares and seats <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            )
          })}
          <Link href="/saint-martin-ship" className="group flex flex-col justify-center rounded-2xl bg-[#f1f8f6] p-4 transition duration-200 hover:bg-[#e4f2ee]">
            <span className="font-extrabold text-ink">Not sure which ship to take?</span>
            <span className="t-small mt-1 text-prose">Compare fares, seats and cabins on all five ships.</span>
            <span className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-extrabold text-brand-ink">Compare all ships <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" /></span>
          </Link>
        </div>
      </section>

      <section id="return" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-1">Saint Martin to Cox’s Bazar ship time</h2>
        <p className="t-body mb-4 max-w-3xl text-prose">Return ships leave Saint Martin in the afternoon: between {firstReturn} and {lastReturn} on MV Teknaf, MV Karnafuly Express and MV Baro Awlia in {DATED_SCHEDULE_PERIOD}. With a 6 to 7 hour crossing, a 3:00 PM return reaches Cox’s Bazar at about 9:00 to 10:00 PM.</p>
        <h3 className="t-subtitle mb-2">How long you get on the island on a same-day return</h3>
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Estimated time on Saint Martin for same-day returns on MV Teknaf, MV Karnafuly Express and MV Baro Awlia in November 2026</caption>
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Sailing</th>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Reach the island</th>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Time on the island</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[
                ['5–7 Nov', '7:00 AM, back at 3:00 PM', '1:00–2:00 PM', 'About 1–2 hours'],
                ['13–15 Nov', '10:00 AM, back at 5:00 PM', '4:00–5:00 PM', 'Up to 1 hour'],
                ['16–18 Nov', '4:00 AM, back at 5:00 PM', '10:00–11:00 AM', 'About 6–7 hours'],
              ].map(([dates, times, arrive, stay]) => (
                <tr key={dates} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3 font-extrabold text-ink sm:px-4">{dates}<span className="block font-semibold text-prose">{times}</span></th>
                  <td className="px-3 py-3 text-prose sm:px-4">{arrive}</td>
                  <td className="px-3 py-3 font-extrabold text-ink sm:px-4">{stay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-prose">These are our estimates from the published times and a 6 to 7 hour crossing, and a late arrival shortens them. Overnight stays are allowed this season, so check the <Link href="/blog/saint-martin-overnight-stay-rules" className={link}>overnight stay rules</Link> if you want more time.</p>
      </section>

      <section id="sailing-day" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-4">Your sailing day at Nuniarchhara Jetty</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Go to the right jetty', <>Tourist ships leave from the <a key="biwta" href="https://biwta.gov.bd/" target="_blank" rel="noopener noreferrer" className={link}>BIWTA</a> jetty at Nuniarchhara in Cox’s Bazar, not from Teknaf.</>],
            ['Arrive 1 hour early', 'Be there at least 1 hour before departure. If your ticket lists an earlier reporting time, follow that.'],
            ['Keep your documents ready', <>Carry your ticket and the ID matching your booking. Your <Link key="pass" href="/saint-martin-travel-pass" className={link}>Travel Pass</Link> comes with your ticket.</>],
            ['Settle in for 6 to 7 hours', <>The crossing covers about 120 km. Read the <Link key="route" href="/routes/coxs-bazar-to-saint-martin" className={link}>route guide</Link> for what to expect.</>],
          ].map(([heading, text], index) => (
            <li key={String(heading)} className="flex gap-3 rounded-2xl bg-[#f7fbfa] p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-ink text-sm font-black text-white">{index + 1}</span>
              <div>
                <h3 className="font-extrabold leading-snug text-ink">{heading}</h3>
                <p className="t-small mt-0.5 text-prose">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="why-times-change" className="mb-12 scroll-mt-24">
        <h2 className="t-title mb-4">Why Saint Martin ship times change</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Waves, heading: 'Tide', text: 'Dated schedules move with the tide. In November 2026, the same ship’s departure ranges from 4:00 AM to 10:00 AM.' },
            { icon: CloudRain, heading: 'Weather and sea', text: 'Rough sea or bad weather can delay or stop a sailing, in either direction.' },
            { icon: ShieldCheck, heading: 'Government permission', text: 'The season opened on 1 November 2026, but tourist ships only began sailing on 5 November.' },
          ].map(({ icon: Icon, heading, text }) => (
            <div key={heading} className="flex gap-3 rounded-2xl bg-[#f7fbfa] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e4f2ee] text-brand-ink"><Icon size={19} aria-hidden="true" /></span>
              <div>
                <h3 className="font-extrabold text-ink">{heading}</h3>
                <p className="t-small mt-0.5 text-prose">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="t-body mt-4 max-w-3xl text-prose">Actual sailings can differ from the table. On 5 November 2026, news reports said MV Baro Awlia left at about 7:40 AM and reached the island at about 1:45 PM, while the table lists 7:00 AM. Read <Link href="/blog/saint-martin-ship-status-2026-27" className={link}>which ships are sailing now</Link>, and see our <Link href="/booking-policy" className={link}>booking policy</Link> for what happens if a sailing changes.</p>
      </section>

      <section id="season" className="mb-12 scroll-mt-24 rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
        <h2 className="t-title">When is Saint Martin open? Season 2026–27</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Season', `${season.startDate} to ${season.endDate}`],
            ['First tourist ship', '5 November 2026'],
            ['Daily limit', 'Up to 3,500 tourists a day'],
            ['Overnight stays', 'Allowed this season'],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="text-xs font-bold text-quiet">{term}</dt>
              <dd className="mt-0.5 font-extrabold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="t-small mt-4 text-prose">The <a href="https://moef.gov.bd/" target="_blank" rel="noopener noreferrer" className={link}>Ministry of Environment, Forest and Climate Change</a> sets the season’s <Link href="/saint-martin-travel-rules" className={link}>travel rules</Link>, and the government portal is <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className={link}>travelpass.gov.bd</a>.</p>
      </section>

      <section lang="bn" id="somoysuchi" className="mb-12 scroll-mt-24 rounded-3xl border border-line-soft bg-white p-5 md:p-7">
        <h2 className="t-title">সেন্টমার্টিন জাহাজের সময়সূচি ২০২৬-২৭</h2>
        <p className="t-body mt-3 text-prose">সেন্টমার্টিনের জাহাজ সকালে কক্সবাজারের নুনিয়ারছড়া বিআইডব্লিউটিএ জেটি থেকে ছাড়ে। এমভি টেকনাফ, এমভি কর্ণফুলী এক্সপ্রেস ও এমভি বার আউলিয়ার সময় জোয়ার-ভাটার কারণে তারিখভেদে বদলায়, নভেম্বর ২০২৬-এ ভোর ৪টা থেকে সকাল ১০টার মধ্যে।</p>
        <p className="t-body mt-3 text-prose">সেন্টমার্টিন থেকে ফেরার জাহাজ ছাড়ে বিকেলে, নভেম্বরের তালিকায় বিকেল ৩টা থেকে ৫টার মধ্যে। যাত্রায় প্রায় ৬ থেকে ৭ ঘণ্টা লাগে, আর ছাড়ার অন্তত ১ ঘণ্টা আগে জেটিতে পৌঁছে যাওয়া ভালো।</p>
        <p className="t-body mt-3 text-prose">কেয়ারী ক্রুজ অ্যান্ড ডাইন ও কেয়ারী সিন্দবাদের সময়সূচি এখনো প্রকাশ হয়নি, তবে অগ্রিম দিয়ে প্রি-বুকিং চলছে। আপনার তারিখের সময় জানতে WhatsApp-এ মেসেজ দিন বা কল করুন: <a href={phoneHref} className={link}>{PHONE_NUMBER}</a>। ভাড়া দেখুন <Link href="/saint-martin-ship-ticket-price" className={link}>জাহাজের টিকিটের দাম</Link> পাতায়।</p>
      </section>

      <FaqAccordion items={faqs} heading="Saint Martin ship schedule questions" id="faq" />

      <section className="mb-10">
        <h2 className="t-title mb-4">Plan the rest of your trip</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['/saint-martin-ship', 'Compare all Saint Martin ships'],
            ['/saint-martin-ship-ticket-price', 'Saint Martin ship ticket prices'],
            ['/saint-martin-cabin-price', 'Cabin and seat class prices'],
            ['/cheapest-saint-martin-ship-ticket', 'Cheapest ship ticket'],
            ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin route'],
            ['/routes/coxs-bazar-to-saint-martin-distance', 'Distance and journey time'],
            ['/saint-martin-travel-pass', 'Travel Pass and QR ticket'],
            ['/saint-martin-travel-rules', 'Travel rules and restrictions'],
            ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ship ticket'],
            ['/saint-martin-trip-cost', 'Saint Martin trip cost'],
            ['/saint-martin-guide', 'Saint Martin travel guide'],
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
        <p className="t-small mt-3 text-prose">For the island itself, see the <a href="https://www.tripzic.com/destinations/saint-martin-island" target="_blank" rel="noopener noreferrer" className={link}>Saint Martin Island guide</a>, <a href="https://www.tripzic.com/blog/saint-martin-travel-guide" target="_blank" rel="noopener noreferrer" className={link}>travel guide</a> and <a href="https://www.tripzic.com/visit-bangladesh/saint-martins-island" target="_blank" rel="noopener noreferrer" className={link}>visitor information</a> from Tripzic, the travel agency behind ShipTickets.bd. For schedule updates, find us on <a href="https://www.facebook.com/shiptickets" target="_blank" rel="noopener noreferrer" className={link}>Facebook</a>.</p>
        <p className="t-small mt-2 text-quiet">ShipTickets.bd provides ship information and ticket help. Times here are for guidance and do not guarantee a sailing or ticket availability.</p>
      </section>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            {
              '@type': 'ItemList',
              name: 'Saint Martin ship sailings from Cox’s Bazar',
              numberOfItems: ships.length,
              itemListElement: boardShips.map((board, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'BoatTrip',
                  name: `${board.name}: Cox’s Bazar to Saint Martin`,
                  url: `https://www.shiptickets.bd/saint-martin-ship/${board.slug}`,
                  provider: { '@type': 'Organization', name: ships.find((ship) => ship.slug === board.slug)?.operator },
                  departureBoatTerminal: { '@type': 'BoatTerminal', name: 'BIWTA Nuniarchhara Jetty, Cox’s Bazar' },
                  arrivalBoatTerminal: { '@type': 'BoatTerminal', name: 'Saint Martin’s Island' },
                },
              })),
            },
            breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Saint Martin ships', url: '/saint-martin-ship' }, { name: 'Schedule', url: '/saint-martin-ship-schedule' }]),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}
