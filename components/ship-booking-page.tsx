import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Check, ChevronDown, Clock, MapPin, MessageCircle, Phone, Ticket } from 'lucide-react'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { NO_IMAGE, seatPhotoAlt, seatPhotoName, seatPhotoSrc } from '@/lib/seat-photos'
import { isApproved, isPreBooking, site, PHONE_NUMBER, WHATSAPP_NUMBER, getReviewsForShip, season, type Ship } from '@/lib/ships'
import { dhakaToday, getShipSchedule, getUsualTimes } from '@/content/ship-schedules'
import { ContactLink } from '@/components/contact-link'
import { CustomerReviews, FaqAccordion, ProvenanceNote } from '@/components/content-blocks'
import { Eyebrow, RatingChip, Schema, SeoPage, breadcrumbSchema, faqSchema, productSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { BookLink, CategoryTabs, NextSailings, QuickBook, ShipMobileBar, ShipSectionNav } from '@/components/ship-booking-client'
import { ShipViewTracker } from '@/components/ship-view-tracker'

const CHECKLIST = [
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

/** Spec rows already shown on the cards, or in Schedule & boarding, so At a glance leaves them out. */
const COVERED_ELSEWHERE = new Set([
  'Ship', 'Vessel', 'Owner', 'Owner / operator', 'Route', 'Boarding', 'Boarding area', 'Destination',
  'Ticket type', 'Ticket types', 'Seating', 'Economy seating', 'Business seating', 'Premium seating',
  'Cabins', 'Capacity', 'Total published seating', 'Availability', 'Operating period', 'Operation',
  'Schedule', 'Status', 'Journey', 'Journey time', 'Check-in', 'Season', 'Departure',
])

const BENGALI = /[ঀ-৿]/
const whatsappHref = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const amounts = (fares: (string | undefined)[]) => fares.map(amount).filter(Boolean)
const lowest = (fares: (string | undefined)[]) => {
  const values = amounts(fares)
  return values.length ? Math.min(...values) : 0
}
const fareRange = (fares: (string | undefined)[]) => {
  const values = amounts(fares)
  if (values.length === 0) return ''
  const [low, high] = [Math.min(...values), Math.max(...values)]
  return low === high ? taka(low) : `${taka(low)} to ${taka(high)}`
}
const shortJetty = (jetty?: string) => (/nuniarchhara/i.test(jetty ?? 'Nuniarchhara') ? 'Nuniarchhara Jetty' : (jetty ?? '').split(/[,(/]/)[0].trim())
/** "Approx. 6 to 7 hours (seasonal, confirm for your sailing)" becomes "About 6 to 7 hours". */
const shortJourney = (journey?: string) => (journey ?? '').replace(/\s*\(.*$/, '').replace(/^Approx\.\s*/, 'About ').replace(/(\d)–(\d)/, '$1 to $2').trim()
const banglaDigits = (value: number) => String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])
const canBook = (ship: Ship) => BOOKING_ENABLED && isApproved(ship)
const bookHref = (ship: Ship, category?: string) => `/booking?ship=${ship.slug}${category ? `&category=${seatPhotoName(category)}` : ''}`

const inlineLink = 'font-bold text-brand-ink underline underline-offset-2 transition-colors hover:text-[#13734f]'
const BIWTA_URL = 'https://biwta.gov.bd/'
const MOEF_URL = 'https://moef.gov.bd/'
const TRAVEL_PASS_URL = 'https://travelpass.gov.bd/'
const TRIPZIC_GUIDE_URL = 'https://www.tripzic.com/destinations/saint-martin-island'

const BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯'
const bn = (value: number | string) => String(value).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)])
const bnTaka = (value: number) => `৳${bn(value.toLocaleString('en-US'))}`

/** A heading and its content that can be opened and closed, with the text kept in the HTML. */
function Disclosure({ id, title, lang, open, children }: { id?: string; title: string; lang?: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} open={open} lang={lang} className="group scroll-mt-36 rounded-2xl border border-line-soft bg-white transition-shadow duration-200 open:shadow-card">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <h2 className="t-subtitle text-ink">{title}</h2>
        <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="ship-fade px-5 pb-5">{children}</div>
    </details>
  )
}

function ShipHero({ ship, title, intro, seatFrom, roundFrom, hasCabins }: { ship: Ship; title: string; intro: React.ReactNode; seatFrom: number; roundFrom: number; hasCabins: boolean }) {
  const facts = [
    { icon: Clock, text: shortJourney(ship.journeyDuration) || 'Confirm for your sailing' },
    { icon: MapPin, text: shortJetty(ship.jetty) },
    { icon: Ticket, text: 'Travel Pass included' },
  ]

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-x-12">
      <div className="lg:row-span-2">
        <p className="t-label mb-3 text-brand-ink"><Eyebrow text={`Ship guide · ${ship.nameBn}`} /></p>
        <h1 className="t-display text-[clamp(1.85rem,1.25rem+2.5vw,3.1rem)] text-ink">{SHIP_H1[ship.slug] ?? title}</h1>
        {isPreBooking(ship) && (
          <div className="mt-4 max-w-2xl rounded-2xl border border-[#f3d9bf] bg-[#fff8ee] p-4">
            <p className="font-extrabold text-ink">Schedule not published yet: pre-booking is open</p>
            <p className="t-small mt-1 text-prose">{ship.name} has not published its 2026–27 schedule. We are taking pre-bookings with a {site.advancePercentage}% advance, and we will confirm your date and time on WhatsApp once it is published. If your date is not available, you can choose another date or ship, or get your payment back in full.</p>
            <p lang="bn" className="t-small mt-1 font-semibold text-prose">এই জাহাজের সময়সূচি এখনো প্রকাশ হয়নি। {banglaDigits(site.advancePercentage)}% অগ্রিম দিয়ে প্রি-বুকিং চলছে। সময়সূচি প্রকাশ হলে আমরা WhatsApp-এ আপনার তারিখ ও সময় জানিয়ে দেব।</p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 divide-x divide-[#d9e8e4] rounded-2xl bg-[#f1f8f6] py-4">
          <div className="px-4">
            <p className="text-xs font-bold text-quiet">One way from</p>
            <p className="mt-0.5 text-[1.75rem] font-black leading-tight tabular-nums text-ink">{taka(seatFrom)}</p>
          </div>
          <div className="px-4">
            <p className="text-xs font-bold text-quiet">Round trip from</p>
            <p className="mt-0.5 text-[1.75rem] font-black leading-tight tabular-nums text-ink">{taka(roundFrom)}</p>
          </div>
        </div>

        <QuickBook
          shipSlug={ship.slug}
          shipName={ship.name}
          minDate={season.startISO}
          maxDate={season.endISO}
          bookingEnabled={canBook(ship)}
          hasCabins={hasCabins}
          whatsappNumber={WHATSAPP_NUMBER}
        />

        <a href="#tickets" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-brand-ink underline-offset-4 hover:underline">
          {hasCabins ? 'See all seats & cabins' : 'See all seats'}
          <ArrowDown size={16} aria-hidden="true" />
        </a>

        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
              <Icon size={16} aria-hidden="true" className="shrink-0 text-brand" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {ship.image && (
        <figure className="mt-6 lg:col-start-2 lg:row-start-1 lg:mt-0">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#dcefeb] sm:aspect-[21/9] lg:aspect-[16/11]">
            <Image
              src={ship.image}
              alt={ship.imageAlt ?? `${ship.name} passenger ship`}
              fill
              sizes="(min-width: 1280px) 590px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover"
              priority
              fetchPriority="high"
            />
          </div>
          <figcaption className="t-small mt-2 text-quiet">{ship.name} on the {ship.route} route.</figcaption>
        </figure>
      )}

      <div className="mt-5 lg:col-start-2 lg:row-start-2">
        <p className="t-body text-prose">{intro}</p>
        <RatingChip updated={ship.lastVerified} />
      </div>
    </div>
  )
}

function CategoryCard({ ship, name, nameBn, description, chipBn, chip, noteBn, bestForBn, tagsBn, oneWay, roundTrip, isLowest, kind }: {
  ship: Ship
  name: string
  nameBn?: string
  description: string
  chipBn?: string
  chip?: string
  noteBn?: string
  bestForBn?: string
  tagsBn?: string[]
  oneWay?: string
  roundTrip?: string
  isLowest?: boolean
  kind: 'seat' | 'cabin'
}) {
  const src = seatPhotoSrc(ship.slug, name)
  const message = `Hello ShipTickets.bd, I want to check ${ship.name} ${name} availability for my travel date.`
  const saving = amount(oneWay) * 2 - amount(roundTrip)

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-[#b9d8d0] hover:shadow-raised">
      <div className={`relative aspect-[16/9] overflow-hidden ${src ? 'bg-[#e7f2ef]' : 'bg-[#e7e7e7]'}`}>
        {src ? (
          <Image src={src} alt={seatPhotoAlt(ship.slug, name, ship.name)} fill sizes="(min-width: 1280px) 430px, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <Image src={NO_IMAGE} alt="" fill sizes="(min-width: 640px) 240px, 50vw" className="object-contain" />
        )}
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
          {isLowest ? <span lang="bn" className="rounded-full bg-brand-ink px-3 py-1 text-[0.8125rem] font-bold text-white shadow-card">সবচেয়ে কম ভাড়া</span> : <span />}
          {chipBn ? <span lang="bn" className="rounded-full bg-white/95 px-3 py-1 text-[0.8125rem] font-bold text-ink shadow-card">{chipBn}</span> : chip && <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-ink shadow-card">{chip}</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-lg font-black leading-snug text-ink">{name}</h3>
          {nameBn && <p lang="bn" className="text-sm font-semibold text-brand-ink">{nameBn}</p>}
        </div>

        {bestForBn && (
          <p lang="bn" className="mt-1.5 text-[0.9375rem] font-semibold leading-relaxed text-ink">{bestForBn}</p>
        )}
        <p className="t-small mt-1 text-prose">{description}</p>

        {((tagsBn?.length ?? 0) > 0 || noteBn) && (
          <ul lang="bn" className="mt-3 flex flex-wrap gap-1.5">
            {tagsBn?.map((tag) => <li key={tag} className="rounded-lg bg-[#eef5f3] px-2.5 py-1 text-[0.8125rem] font-semibold text-[#1d5c4b]">{tag}</li>)}
            {noteBn && <li className="rounded-lg bg-[#f4f3ee] px-2.5 py-1 text-[0.8125rem] font-semibold text-[#57564f]">{noteBn}</li>}
          </ul>
        )}

        <div className="mb-3 mt-auto pt-3">
          <dl className="grid grid-cols-2 divide-x divide-[#dcece9] rounded-2xl bg-[#f7fbfa] py-3">
            <div className="px-3.5">
              <dt className="text-xs font-bold text-quiet">One way</dt>
              <dd className="mt-0.5 text-xl font-black tabular-nums text-ink">{oneWay ?? 'Ask us'}</dd>
            </div>
            <div className="px-3.5">
              <dt className="text-xs font-bold text-quiet">Round trip</dt>
              <dd className="mt-0.5 text-xl font-black tabular-nums text-ink">{roundTrip ?? 'Ask us'}</dd>
            </div>
          </dl>
          {saving > 0 && <p lang="bn" className="mt-2 text-right text-[0.8125rem] font-bold text-brand-ink">যাওয়া-আসা নিলে {bnTaka(saving)} বাঁচবে</p>}
        </div>

        {canBook(ship) ? (
          <div className="grid grid-cols-[1.25fr_1fr] gap-2">
            <BookLink href={bookHref(ship, name)} location={`${kind}_card`} className="flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-3 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">
              Book now
            </BookLink>
            <ContactLink href={whatsappHref(message)} kind="whatsapp" eventLabel={kind === 'seat' ? 'ticket_class' : 'cabin_block'} ariaLabel={`Ask about ${name} on WhatsApp`} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-line px-3 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
              <MessageCircle size={15} aria-hidden="true" /> WhatsApp
            </ContactLink>
          </div>
        ) : (
          <ContactLink href={whatsappHref(message)} kind="whatsapp" eventLabel={kind === 'seat' ? 'ticket_class' : 'cabin_block'} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">
            <MessageCircle size={15} aria-hidden="true" /> Check availability
          </ContactLink>
        )}
      </div>
    </article>
  )
}

/** Fits a 360px phone: one column of names and two of prices, with no sideways scrolling. */
function FullFareTable({ ship }: { ship: Ship }) {
  const rows = [...ship.ticketClasses, ...ship.cabins]
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-line-soft">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{ship.name} ticket prices per category for the {season.label} season, in Bangladeshi taka</caption>
          <thead className="bg-[#e3ecea] text-ink">
            <tr>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Category</th>
              <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">One way</th>
              <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Round trip</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const down = 'downFare' in row ? row.downFare : undefined
              return (
                <tr key={row.name} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-2.5 font-bold text-ink [overflow-wrap:anywhere] sm:px-4">{row.name}</th>
                  <td className="px-3 py-2.5 text-right font-extrabold tabular-nums sm:px-4">
                    {row.oneWayFare ?? 'Ask us'}
                    {down && <span className="block text-xs font-semibold text-quiet">Return {down}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-right font-extrabold tabular-nums sm:px-4">{row.roundTripFare ?? 'Ask us'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="t-small mt-3 text-quiet">One-way fares are from Cox’s Bazar to Saint Martin. Fare source: {ship.source}</p>
    </>
  )
}

/** Facts about the ship itself. Dates, times and boarding live in Schedule & boarding. */
function AtAGlance({ ship }: { ship: Ship }) {
  const seats = ship.ticketClasses
  const cabins = ship.cabins
  const categories = new Set(seats.map((item) => item.name))
  const specs = (ship.specs ?? []).filter((spec) => !COVERED_ELSEWHERE.has(spec.label) && !categories.has(spec.label))

  const facts = [
    { label: 'Operator', value: ship.operator },
    { label: 'Route', value: `${ship.route}, about 120 km by sea` },
    ...(ship.capacity ? [{ label: 'Capacity', value: ship.capacity.replace(/\s*\(.*$/, '') }] : []),
    { label: 'Seat categories', value: String(seats.length) },
    ...(cabins.length > 0 ? [{ label: 'Cabins', value: cabins.map((item) => item.name.replace(/ Cabin$/, '')).join(', ') }] : []),
    ...specs,
    {
      label: 'Travel Pass',
      value: (
        <>
          <Link href="/saint-martin-travel-pass" className={inlineLink}>QR-coded pass</Link> included with tickets booked through ShipTickets.bd. The government’s official portal is <a href={TRAVEL_PASS_URL} target="_blank" rel="noopener noreferrer" className={inlineLink}>travelpass.gov.bd</a>.
        </>
      ),
    },
    ...(ship.alternateNames?.length ? [{ label: 'Also written as', value: ship.alternateNames.join(', ') }] : []),
  ]

  return (
    <section id="at-a-glance" className="mb-12 scroll-mt-36">
      <h2 className="t-title mb-4">{ship.name} at a glance</h2>
      <p className="t-body mb-4 t-measure text-prose">{ship.detail}</p>
      <dl className="grid gap-x-8 rounded-3xl border border-line-soft bg-white px-5 py-2 sm:grid-cols-2 md:px-7 md:py-3">
        {facts.map((fact) => (
          <div key={fact.label} className="border-b border-line-soft py-3">
            <dt className="text-xs font-bold text-quiet">{fact.label}</dt>
            <dd className="mt-0.5 text-sm font-bold leading-relaxed text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SailingDetails({ ship, hasTimetable }: { ship: Ship; hasTimetable: boolean }) {
  const rows = [
    { label: 'Season', value: `${season.startDate} to ${season.endDate}` },
    { label: 'Departure', value: hasTimetable ? 'Changes by date; see the schedule above' : (ship.departure ?? 'Confirm for your sailing date') },
    { label: 'Check-in', value: ship.checkIn ?? 'Confirm on your ticket' },
    { label: 'Journey', value: ship.journeyDuration ?? 'Confirm for your sailing date' },
    { label: 'Boarding point', value: ship.jetty ?? "BIWTA Nuniarchhara Jetty, Cox's Bazar" },
    { label: 'Return sailing', value: 'Confirm the return date and time with your ticket' },
    { label: 'Cancellation', value: ship.cancellation ?? 'Subject to operator and season rules; confirm before payment' },
  ]
  return (
    <dl className="grid gap-x-8 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="border-b border-line-soft py-3">
          <dt className="text-xs font-bold text-quiet">{row.label}</dt>
          <dd className="mt-0.5 text-sm font-bold leading-relaxed text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function HowToBook({ ship, checklist }: { ship: Ship; checklist: string[] }) {
  const steps = canBook(ship)
    ? [
        { title: ship.cabins.length > 0 ? 'Choose your seat or cabin' : 'Choose your seat', text: `Pick a category on ${ship.name}, then your date and passenger count.` },
        { title: 'Enter passenger details', text: 'Add the names and mobile number for the ticket.' },
        { title: 'Pay the advance', text: 'Pay the advance shown at checkout, then submit your transaction ID.' },
        { title: 'Get your ticket', text: 'We confirm on WhatsApp after checking your payment. Collect your printed ticket from our Kawran Bazar office, or we can send it by courier.' },
      ]
    : [
        { title: 'Send your travel date', text: `Tell us the date you plan to travel on ${ship.name}.` },
        { title: 'Share passenger count', text: `How many passengers are sailing on ${ship.name}, and any children or infants?` },
        { title: 'Choose a category', text: `Pick a ${ship.cabins.length > 0 ? 'seating or cabin' : 'seating'} category on ${ship.name}.` },
        { title: 'We confirm', text: `We confirm the ${ship.name} fare, availability and boarding information, and your Travel Pass comes with the ticket.` },
      ]

  return (
    <section id="how-to-book" className="mb-12 scroll-mt-36">
      <h2 className="t-title mb-5">How to book {ship.name}</h2>
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3 rounded-2xl bg-[#f7fbfa] p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-ink text-sm font-black text-white">{index + 1}</span>
            <div>
              <h3 className="font-extrabold leading-snug text-ink">{step.title}</h3>
              <p className="t-small mt-1 text-prose">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      {!BOOKING_ENABLED && <p className="t-small mt-3 text-quiet">ShipTickets.bd does not process payment on this website. A support agent confirms the booking before you pay.</p>}
      <div className="mt-4">
        <Disclosure title={`Check before you pay for ${ship.name}`}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item} className="t-small flex items-start gap-2 text-prose">
                <Check size={16} aria-hidden="true" className="mt-1 shrink-0 text-brand-ink" />
                {item}
              </li>
            ))}
          </ul>
        </Disclosure>
      </div>
    </section>
  )
}

function ShipDetails({ ship }: { ship: Ship }) {
  return (
    <section id="details" className="mb-12 scroll-mt-36">
      <h2 className="t-title mb-5">{ship.name} details</h2>
      <div className="grid gap-3">
        <Disclosure id="facilities" title={`${ship.name} onboard facilities`}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {ship.facilities.map((facility) => (
              <li key={facility.name} className="t-small flex items-start gap-2 text-ink">
                <Check size={16} aria-hidden="true" className="mt-1 shrink-0 text-brand-ink" />
                {facility.name}
              </li>
            ))}
          </ul>
          <p className="t-small mt-3 text-quiet">Facilities can vary by class and sailing. If a particular facility matters to your trip, confirm it before payment.</p>
        </Disclosure>

        {(ship.categoryGuidance?.length ?? 0) > 0 && (
          <Disclosure id="categories" title={`Which ${ship.name} category should you choose?`}>
            <p className="t-small mb-3 text-prose">Choose by seating preference, privacy and budget rather than assuming one category is better.</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {ship.categoryGuidance!.map((row) => (
                <li key={row.category} className="rounded-xl bg-[#f7fbfa] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold leading-snug text-ink">{row.category}</h3>
                    <span className="shrink-0 font-extrabold text-brand-ink" aria-label={`Price level ${row.priceLevel.length} of 4`}>{row.priceLevel}</span>
                  </div>
                  <p className="t-small mt-1 text-prose">Best for: {row.bestFor}</p>
                  <p className="t-small text-prose">Privacy: {row.privacy} · Outdoor access: {row.outdoor}</p>
                </li>
              ))}
            </ul>
          </Disclosure>
        )}
      </div>
    </section>
  )
}

function PlanYourTrip({ ship }: { ship: Ship }) {
  return (
    <section className="mb-12">
      <h2 className="t-title mb-2">Plan your {ship.name} trip</h2>
      <p className="t-small mb-4 t-measure text-prose">Planning more than the ship? See the <a href={TRIPZIC_GUIDE_URL} target="_blank" rel="noopener noreferrer" className={inlineLink}>Saint Martin Island travel guide</a> from Tripzic, the travel agency behind ShipTickets.bd.</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {[
          ['/saint-martin-ship-ticket-price', `Compare ${ship.name} fares with other ships`],
          ['/cheapest-saint-martin-ship-ticket', 'Cheapest Saint Martin ship ticket'],
          ['/saint-martin-trip-cost', 'Saint Martin trip cost'],
          ['/routes/coxs-bazar-to-saint-martin-distance', 'Cox’s Bazar to Saint Martin distance'],
          ['/saint-martin-travel-pass', 'Saint Martin Travel Pass'],
          ['/saint-martin-travel-rules', 'Saint Martin travel rules'],
          ['/blog/saint-martin-ship-status-2026-27', 'Which ships are sailing now'],
          ['/blog/best-ship-to-saint-martin', 'Which ship is best for you'],
          ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ticket'],
        ].map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line-soft px-4 py-2.5 text-sm font-bold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
              {label}
              <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function FinalCta({ ship }: { ship: Ship }) {
  const message = `Hello ShipTickets.bd, please check my travel date, passenger count and preferred category on ${ship.name}.`
  return (
    <section className="mb-12 rounded-3xl bg-[#0d1b2a] p-7 text-white md:p-10">
      <h2 className="t-title">{canBook(ship) ? `Ready to book ${ship.name}?` : `Check ${ship.name} availability`}</h2>
      <p className="t-body mt-2 t-measure text-on-dark">
        {canBook(ship) ? 'Book online, or send us your travel date, passenger count and preferred category on WhatsApp.' : 'Send your travel date, passenger count and preferred category. We will confirm the current fare, availability, boarding information and Travel Pass requirements before you book.'}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {canBook(ship) && (
          <BookLink href={bookHref(ship)} location="final_cta" className="inline-flex min-h-12 items-center rounded-xl bg-brand-ink px-6 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">
            Book now
          </BookLink>
        )}
        <ContactLink href={whatsappHref(message)} kind="whatsapp" eventLabel="booking_cta" className={`inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white transition duration-200 ${canBook(ship) ? 'border border-white/30 hover:bg-white/10' : 'bg-brand-ink hover:bg-brand-ink-hover'}`}>
          <MessageCircle size={16} aria-hidden="true" /> {canBook(ship) ? 'WhatsApp' : 'Check availability on WhatsApp'}
        </ContactLink>
        <Link href="/saint-martin-ship-ticket-price" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-5 text-sm font-extrabold text-white transition duration-200 hover:bg-white/10">
          Compare all fares
        </Link>
      </div>
    </section>
  )
}

function OtherShips({ ships, currentName }: { ships: Ship[]; currentName: string }) {
  if (ships.length === 0) return null
  return (
    <section className="mb-4">
      <h2 className="t-title mb-5">Compare {currentName} with other ships</h2>
      <div className="grid gap-3">
        {ships.map((other) => (
          <Link key={other.slug} href={`/saint-martin-ship/${other.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line-soft bg-white p-3 pr-4 transition duration-200 hover:border-brand-ink hover:shadow-card">
            {other.image && (
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#dcefeb] sm:h-16 sm:w-24">
                <Image src={other.image} alt={other.imageAlt ?? `${other.name} passenger ship`} fill sizes="96px" className="object-cover" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold leading-snug text-ink">{other.name}</span>
              <span className="block text-sm font-bold text-brand-ink">From {other.oneWay} one way, {other.roundTrip} round trip</span>
              <span className="t-small hidden truncate text-quiet sm:block">{other.detail}</span>
            </span>
            <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function BookingPanel({ ship, seatFrom, roundFrom }: { ship: Ship; seatFrom: number; roundFrom: number }) {
  const message = `Hello ShipTickets.bd, I want to check ${ship.name} availability for my travel date.`
  return (
    <aside aria-label={`Book ${ship.name}`} className="hidden lg:block">
      <div className="sticky top-[calc(var(--header-h)+1rem)] rounded-3xl border border-line-soft bg-white p-6 shadow-raised">
        <p className="font-extrabold text-ink">{ship.name}</p>
        <p className="mt-3 text-xs font-bold text-quiet">One way from</p>
        <p className="text-4xl font-black tabular-nums text-ink">{taka(seatFrom)}</p>
        <p className="mt-1 text-sm font-bold text-prose">Round trip from {taka(roundFrom)}</p>

        <div className="mt-5 grid gap-2">
          {canBook(ship) ? (
            <BookLink href={bookHref(ship)} location="side_panel" className="flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-4 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">
              Book now
            </BookLink>
          ) : null}
          <ContactLink href={whatsappHref(message)} kind="whatsapp" eventLabel="side_panel" className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition duration-200 ${canBook(ship) ? 'border border-line text-ink hover:border-brand-ink hover:text-brand-ink' : 'bg-brand-ink text-white hover:bg-brand-ink-hover'}`}>
            <MessageCircle size={16} aria-hidden="true" /> {canBook(ship) ? 'Ask on WhatsApp' : 'Check on WhatsApp'}
          </ContactLink>
          <ContactLink href={phoneHref} kind="phone" eventLabel="side_panel" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
            <Phone size={16} aria-hidden="true" /> {PHONE_NUMBER}
          </ContactLink>
        </div>

        <ul className="mt-5 grid gap-2 border-t border-line-soft pt-4">
          {['QR Travel Pass included', shortJourney(ship.journeyDuration), shortJetty(ship.jetty)].filter(Boolean).map((item) => (
            <li key={item} className="t-small flex items-start gap-2 text-prose">
              <Check size={16} aria-hidden="true" className="mt-1 shrink-0 text-brand-ink" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-semibold leading-relaxed text-quiet">Fares may change. Confirm the fare and availability for your date before you pay.</p>
      </div>
    </aside>
  )
}

/**
 * Ship page built around booking: price and a quick date form, then seats and
 * cabins, fares and sailing times, with the longer guide content underneath.
 */
/** Each ship's own search angle, so the five pages do not share one headline. */
const SHIP_H1: Record<string, string> = {
  'mv-teknaf': 'MV Teknaf Ship Ticket: Lowest Fare to Saint Martin',
  'karnafuly-express': 'MV Karnafuly Express Ship Ticket: Lounges, Cabins & Fares',
  'baro-awlia': 'MV Baro Awlia Ship Ticket: Business Chairs, Cabins & Fares',
  'keari-sindbad': 'Keari Sindbad Ship Ticket & Schedule: Open Deck Seats',
  'keari-cruise-dine': 'Keari Cruise & Dine Ticket: AC Lounges & Onboard Restaurant',
}

export function ShipBookingPage({
  ship,
  title,
  quickAnswer,
  checklist = CHECKLIST,
  relatedShips = [],
}: {
  ship: Ship
  title: string
  quickAnswer: [string, string][]
  checklist?: string[]
  relatedShips?: Ship[]
}) {
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Saint Martin ships', href: '/saint-martin-ship' },
    { name: ship.name },
  ]
  const seatFrom = lowest(ship.ticketClasses.map((item) => item.oneWayFare))
  const roundFrom = lowest(ship.ticketClasses.map((item) => item.roundTripFare))
  const cabinFrom = lowest(ship.cabins.map((item) => item.oneWayFare))
  const cabinRange = fareRange(ship.cabins.map((item) => item.oneWayFare))
  const journey = shortJourney(ship.journeyDuration).replace(/^About/, 'about')
  const intro = [
    `${ship.name} (${ship.nameBn}) ticket prices for the ${season.label} season start at ${taka(seatFrom)} one way and ${taka(roundFrom)} round trip per person from Cox’s Bazar to Saint Martin.`,
    `Seats cost ${fareRange(ship.ticketClasses.map((item) => item.oneWayFare))} one way${cabinRange ? ` and cabins cost ${cabinRange}` : ''}.`,
    journey ? `The ship leaves from ${shortJetty(ship.jetty)} in Cox’s Bazar, and the journey takes ${journey}.` : '',
  ].filter(Boolean).join(' ')
  const linkedIntro = (
    <>
      {ship.name} ({ship.nameBn}) <Link href="/saint-martin-ship-ticket-price" className={inlineLink}>ticket prices</Link> for the {season.label} season start at {taka(seatFrom)} one way and {taka(roundFrom)} round trip per person from Cox’s Bazar to Saint Martin.{' '}
      Seats cost {fareRange(ship.ticketClasses.map((item) => item.oneWayFare))} one way{cabinRange ? ` and cabins cost ${cabinRange}` : ''}.
      {journey && (
        <>
          {' '}The ship leaves from <Link href="/routes/coxs-bazar-to-saint-martin" className={inlineLink}>{shortJetty(ship.jetty)}</Link> in Cox’s Bazar, and the journey takes <Link href="/routes/coxs-bazar-to-saint-martin-distance" className={inlineLink}>{journey}</Link>.
        </>
      )}
    </>
  )
  const schedule = getShipSchedule(ship.slug)
  const usualTimes = getUsualTimes(ship.slug)
  const scheduleMessage = `Hello ShipTickets.bd, please confirm the ${ship.name} schedule for my travel date.`

  const seatCards = (
    <div className="grid gap-4 sm:grid-cols-2">
      {ship.ticketClasses.map((item) => (
        <CategoryCard
          key={item.name}
          ship={ship}
          kind="seat"
          name={item.name}
          nameBn={item.nameBn}
          description={item.description.replace(/,?\s*approx\.\s*\d+\s*published seats?/i, '')}
          chipBn={/^\d+$/.test(item.seatCount ?? '') ? `${bn(item.seatCount!)}টি সিট` : undefined}
          chip={item.deck}
          bestForBn={item.bestForBn}
          tagsBn={item.tagsBn}
          oneWay={item.oneWayFare}
          roundTrip={item.roundTripFare}
          isLowest={amount(item.oneWayFare) === seatFrom}
        />
      ))}
    </div>
  )

  const cabinCards = (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {ship.cabins.map((item) => (
          <CategoryCard
            key={item.name}
            ship={ship}
            kind="cabin"
            name={item.name}
            nameBn={item.nameBn}
            description={item.description}
            chipBn={item.capacityBn}
            chip={item.capacity}
            noteBn={/^\d+$/.test(item.seatCount ?? '') ? `এই জাহাজে ${bn(item.seatCount!)}টি` : undefined}
            bestForBn={item.bestForBn}
            tagsBn={item.tagsBn}
            oneWay={item.oneWayFare}
            roundTrip={item.roundTripFare}
          />
        ))}
      </div>
      <p className="t-small mt-4 t-measure text-quiet">{ship.name} has a limited number of cabins. Confirm availability, occupancy and included facilities before payment. Compare other ships in our <Link href="/saint-martin-cabin-price" className="font-bold text-brand-ink underline underline-offset-2">Saint Martin ship cabin price guide</Link>.</p>
    </>
  )

  const tabs = [
    { id: 'seats', label: 'Seats', detail: `from ${taka(seatFrom)}`, content: seatCards },
    ...(ship.cabins.length > 0 ? [{ id: 'cabins', label: 'Cabins', detail: cabinFrom ? `from ${taka(cabinFrom)}` : undefined, content: cabinCards }] : []),
  ]

  const navItems = [
    { id: 'tickets', label: ship.cabins.length > 0 ? 'Seats & cabins' : 'Seats' },
    { id: 'fares', label: 'Fares' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'how-to-book', label: 'How to book' },
    { id: 'details', label: 'Ship details' },
    ...(getReviewsForShip(ship.slug).length > 0 ? [{ id: 'reviews', label: 'Reviews' }] : []),
    { id: 'faq', label: 'FAQ' },
  ]

  const tripSchema = {
    '@context': 'https://schema.org',
    '@type': 'BoatTrip',
    '@id': `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}#trip`,
    name: `${ship.name}: Cox’s Bazar to Saint Martin`,
    provider: { '@type': 'Organization', name: ship.operator },
    departureBoatTerminal: { '@type': 'BoatTerminal', name: `${shortJetty(ship.jetty)}, Cox’s Bazar` },
    arrivalBoatTerminal: { '@type': 'BoatTerminal', name: 'Saint Martin jetty, Saint Martin’s Island' },
  }

  return (
    <SeoPage
      canonical={`https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`}
      eyebrow={`Ship guide · ${ship.nameBn}`}
      title={title}
      intro={intro}
      updated={ship.lastVerified}
      modifiedISO={ship.pageUpdated}
      crumbs={crumbs}
      hero={<ShipHero ship={ship} title={title} intro={linkedIntro} seatFrom={seatFrom} roundFrom={roundFrom} hasCabins={ship.cabins.length > 0} />}
      mobileBar={<ShipMobileBar bookHref={canBook(ship) ? bookHref(ship) : undefined} whatsappHref={whatsappHref(`Hello ShipTickets.bd, I want to check ${ship.name} availability for my travel date.`)} phoneHref={phoneHref} />}
      backToTopDesktopOnly
    >
      <ShipViewTracker slug={ship.slug} name={ship.name} />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:gap-12">
        <div className="min-w-0">
          <ShipSectionNav items={navItems} />

          <section id="tickets" className="mb-10 scroll-mt-36">
            <h2 className="t-title mb-1">Choose your {ship.name} ticket</h2>
            <p lang="bn" className="mb-5 text-[0.9375rem] font-semibold text-prose">{ship.cabins.length > 0 ? 'আপনার পছন্দের সিট বা কেবিন বেছে নিন' : 'আপনার পছন্দের সিট বেছে নিন'}</p>
            <CategoryTabs tabs={tabs} label={`${ship.name} ticket types`} />
            {ship.cabins.length === 0 && ship.cabinNote && <p className="t-small mt-4 t-measure text-prose">{ship.cabinNote}</p>}
            <p className="t-small mt-4 t-measure text-quiet">{ship.name} fares may vary by travel date, season, ticket class and operator policy. Confirm the fare and availability for your date before you pay.</p>
          </section>

          <div className="mb-12">
            <Disclosure id="fares" title={`${ship.name} fare table ${season.label}`} open>
              <FullFareTable ship={ship} />
            </Disclosure>
          </div>

          <div className="mb-12">
            <Disclosure id="bn-summary" title={`${ship.nameBn} জাহাজের ভাড়া, সময়সূচি ও টিকেট`} lang="bn" open>
              <p className="t-body whitespace-pre-line text-prose">{ship.summaryBn}</p>
            </Disclosure>
          </div>

          <AtAGlance ship={ship} />

          <section id="quick-answer" className="mb-12 scroll-mt-36 rounded-3xl bg-[#f7fbfa] p-5 md:p-7">
            <h2 className="t-title mb-2">{ship.name} quick answers</h2>
            <div className="divide-y divide-[#dcece9]">
              {quickAnswer.filter(([question, answer]) => !ship.faq.some(([q, a]) => q === question || a === answer)).map(([question, answer], index) => (
                <details key={question} open={index === 0} lang={BENGALI.test(question) ? 'bn' : undefined} className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-extrabold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                    <span>{question}</span>
                    <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="ship-fade t-body pb-4 text-prose">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="schedule" className="mb-12 scroll-mt-36">
            <h2 className="t-title mb-5">{ship.name} schedule &amp; boarding</h2>
            {schedule && (
              <div className="mb-6">
                <h3 className="t-subtitle mb-1 text-ink">{ship.name} {schedule.title}</h3>
                <p className="t-small mb-3 text-prose">{schedule.note}</p>
                <NextSailings rows={schedule.rows} whatsappHref={whatsappHref(scheduleMessage)} initialToday={dhakaToday()} />
              </div>
            )}
            {!schedule && <p className="t-small mb-3 rounded-xl bg-[#fff8ee] p-3 text-ink">{usualTimes ? <><strong>Leaves Cox’s Bazar at {usualTimes.departs} every day.</strong> The updated dated schedule has not been received yet.</> : <><strong>The schedule has not been published yet.</strong> Ask us for the departure and reporting time on your date.</>}</p>}
            <SailingDetails ship={ship} hasTimetable={Boolean(schedule)} />
            <p className="t-small mt-4 flex items-start gap-2 text-prose">
              <MapPin size={16} aria-hidden="true" className="mt-1 shrink-0 text-brand" />
              <span>
                {ship.name} leaves from the <a href={BIWTA_URL} target="_blank" rel="noopener noreferrer" className={inlineLink}>BIWTA</a> jetty at Nuniarchhara. Boarding arrangements can change between seasons, so confirm the jetty printed on your ticket. Compare sailing times on our <Link href="/saint-martin-ship-schedule" className={inlineLink}>Saint Martin ship schedule</Link>, and read the <Link href="/saint-martin-travel-rules" className={inlineLink}>travel rules</Link> before you go.
              </span>
            </p>
            <ContactLink href={whatsappHref(scheduleMessage)} kind="whatsapp" eventLabel="ship_schedule" className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl border border-line px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
              <MessageCircle size={16} aria-hidden="true" /> Check the schedule for my date
            </ContactLink>
          </section>

          <HowToBook ship={ship} checklist={checklist} />
          <ShipDetails ship={ship} />
          <CustomerReviews ship={ship} id="reviews" />
          <FaqAccordion items={ship.faq} heading={`${ship.name} FAQ`} id="faq" />
          <ProvenanceNote ship={ship} />
          <PlanYourTrip ship={ship} />
          <FinalCta ship={ship} />
          <OtherShips ships={relatedShips} currentName={ship.name} />
        </div>

        <BookingPanel ship={ship} seatFrom={seatFrom} roundFrom={roundFrom} />
      </div>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            productSchema(ship),
            tripSchema,
            breadcrumbSchema(crumbs.map((crumb) => ({ name: crumb.name, url: crumb.href }))),
            faqSchema(ship.faq),
          ],
        }}
      />
    </SeoPage>
  )
}
