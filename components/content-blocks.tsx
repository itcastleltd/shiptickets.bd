import Link from 'next/link'
import { CalendarClock, Check, CircleAlert, Info, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import { CONFIDENCE_LABELS, LAST_REVIEWED, STATUS_LABELS, WHATSAPP_NUMBER, getReviewsForShip, season, type Cabin, type CategoryGuidance, type Ship, type ShipSpec, type TicketClass } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=`

type Confidence = keyof typeof CONFIDENCE_LABELS

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  verified: 'bg-[#e1f5ee] text-[#0f6e56]',
  reference: 'bg-[#eaf5f3] text-[#1d6b57]',
  seasonal: 'bg-[#fff5e7] text-[#a5683f]',
  confirm: 'bg-[#f1f0ec] text-[#6b6a63]',
}

export function ConfidenceBadge({ kind, children }: { kind: Confidence; children?: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${CONFIDENCE_STYLES[kind]}`}>
      {children ?? CONFIDENCE_LABELS[kind]}
    </span>
  )
}

/**
 * Ship-page season reminder.
 *
 * `compact` drops the heading and the `season.note` paragraph, because the top
 * SeasonBar on every page already states when the season opens, and the note
 * restates the same sentence. What is left is only what this block uniquely
 * adds: that sailing details are confirmed per date, plus a way to ask.
 */
export function SeasonNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-[#f3d9bf] bg-[#fff8ee] ${compact ? 'p-4' : 'p-5 md:p-6'}`}>
      <div className="flex items-start gap-3">
        <CalendarClock className="mt-0.5 shrink-0 text-[#af6a3c]" size={compact ? 18 : 20} />
        <div>
          {!compact && <p className="t-label text-[#af6a3c]">Saint Martin season {season.label}</p>}
          <p className="t-body mt-2 font-bold leading-6 text-[#0d1b2a]">
            The {season.label} tourist season opens on <strong>{season.startDate}</strong>. Ship sailing dates,
            departure times and fares are confirmed by the operator for each date.
          </p>
          {!compact && <p className="mt-2 text-xs leading-5 text-[#6f5d5a]">{season.note}</p>}
          <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please share the ${season.label} schedule and confirm sailing dates.`} kind="whatsapp" eventLabel="season_schedule" className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#1d9e75] hover:underline">
            Ask about the {season.label} schedule <span aria-hidden="true">→</span>
          </ContactLink>
        </div>
      </div>
    </div>
  )
}

export function QuickFacts({ ship, title = 'At a glance' }: { ship: Ship; title?: string }) {
  // Operator-published specifications come first, then the operational facts we
  // need on every ship. Both are kept: replacing rather than merging would drop
  // the status and last-reviewed rows whenever a vessel publishes specs.
  const specs: ShipSpec[] = ship.specs ?? []
  const facts: ShipSpec[] = [
    ...specs,
    { label: 'Route', value: ship.route },
    { label: 'Operator', value: ship.operator },
    { label: 'Capacity', value: ship.capacity ?? 'Confirm with operator' },
    { label: 'Journey', value: ship.journeyDuration ?? 'Confirm for your sailing' },
    { label: 'Boarding jetty', value: ship.jetty ?? "BIWTA Nuniachhara Jetty, Cox's Bazar" },
    { label: 'Check-in', value: ship.checkIn ?? 'Confirm on your ticket' },
    { label: 'Status', value: STATUS_LABELS[ship.status] },
    { label: 'Last reviewed', value: ship.lastVerified },
  ].filter((fact, index, all) => all.findIndex((other) => other.label === fact.label) === index)

  /**
   * Only a `verified` ship may carry the green "Operator-published" badge.
   * Hardcoding it made vessels that still need confirmation look confirmed,
   * while the Status row directly below said otherwise.
   */
  const statusConfidence: Confidence =
    ship.status === 'verified' ? 'verified' : ship.status === 'seasonal_confirmation' ? 'seasonal' : 'confirm'

  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">{title}</h2>
        <ConfidenceBadge kind={statusConfidence} />
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="border-b border-[#f0efea] pb-3">
            <dt className="text-[11px] font-black uppercase tracking-wider text-[#888780]">{fact.label}</dt>
            <dd className="mt-1 text-sm font-extrabold text-[#0d1b2a]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function FareTag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wider text-[#729298]">{label}</p>
      <p className="mt-0.5 text-lg font-black text-[#0d1b2a]">{value}</p>
    </div>
  )
}

export function TicketCards({ ship }: { ship: Ship }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Choose your ticket</h2>
        <ConfidenceBadge kind="reference" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ship.ticketClasses.map((ticketClass) => (
          <TicketCard key={ticketClass.name} ship={ship} ticketClass={ticketClass} />
        ))}
      </div>
      <p className="mt-4 t-small text-[#67878c]">
        Prices may vary by travel date, season, ticket class and operator policy. These are reference fares rather than live inventory, so confirm before you pay.
      </p>
    </section>
  )
}

function TicketCard({ ship, ticketClass }: { ship: Ship; ticketClass: TicketClass }) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#dedcd3] bg-white p-5 transition hover:border-[#1d9e75] hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#0d1b2a]">{ticketClass.name}</h3>
          {ticketClass.nameBn && <p className="text-sm font-semibold text-[#1d9e75]">{ticketClass.nameBn}</p>}
        </div>
        {ticketClass.deck && <span className="shrink-0 rounded-full bg-[#eaf5f3] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#1d6b57]">{ticketClass.deck}</span>}
      </div>
      <p className="mt-3 t-body text-[#4a5a5c]">{ticketClass.description}</p>
      {ticketClass.seatCount && <p className="mt-2 text-xs font-semibold text-[#729298]">{ticketClass.seatCount}</p>}
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f7fbfa] p-3">
        <FareTag label="One way" value={ticketClass.oneWayFare} />
        <FareTag label="Round trip" value={ticketClass.roundTripFare} />
      </div>
      <ContactLink href={`${whatsapp}Hello ShipTickets.bd, I want to check ${ship.name} ${ticketClass.name} availability for my travel date.`} kind="whatsapp" eventLabel="ticket_class" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0d1b2a] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#1d9e75]">
        Check availability <span aria-hidden="true">→</span>
      </ContactLink>
    </article>
  )
}

export function FareTable({ ship }: { ship: Ship }) {
  const hasReturnLeg = ship.ticketClasses.some((ticketClass) => ticketClass.downFare)
  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Fare table</h2>
        <ConfidenceBadge kind="reference">Reference fare</ConfidenceBadge>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#e7f0ee]">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-[#0d1b2a]/[4%]">
            <tr>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 text-right font-bold">Cox’s Bazar → Saint Martin</th>
              {hasReturnLeg && <th className="px-4 py-3 text-right font-bold">Saint Martin → Cox’s Bazar</th>}
              <th className="px-4 py-3 text-right font-bold">Round trip</th>
            </tr>
          </thead>
          <tbody>
            {ship.ticketClasses.map((ticketClass) => (
              <tr key={ticketClass.name} className="border-t border-[#e7f0ee]">
                <td className="px-4 py-3">
                  <strong>{ticketClass.name}</strong>
                  {ticketClass.deck && <span className="block text-xs text-[#729298]">{ticketClass.deck}</span>}
                </td>
                <td className="px-4 py-3 text-right font-extrabold">{ticketClass.oneWayFare}</td>
                {hasReturnLeg && <td className="px-4 py-3 text-right font-extrabold text-[#628187]">{ticketClass.downFare ?? 'Not published'}</td>}
                <td className="px-4 py-3 text-right font-extrabold">{ticketClass.roundTripFare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 t-small text-[#67878c]"><strong>Last reviewed:</strong> {ship.lastVerified} · {ship.source}</p>
    </section>
  )
}

export function CabinBlock({ ship }: { ship: Ship }) {
  if (ship.cabins.length === 0) {
    return (
      <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
        <h2 className="t-title">Cabins</h2>
        <p className="mt-3 flex gap-2 t-body text-[#4a5a5c]">
          <Info className="mt-1 shrink-0 text-[#1d9e75]" size={17} />
          {ship.cabinNote ?? 'No cabin inventory is published for this vessel. Confirm current availability before booking.'}
        </p>
      </section>
    )
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight">Cabins</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {ship.cabins.map((cabin) => (
          <CabinCard key={cabin.name} ship={ship} cabin={cabin} />
        ))}
      </div>
      <p className="mt-4 t-small text-[#67878c]">Cabin inventory is limited. Confirm availability, occupancy and included facilities before payment.</p>
    </section>
  )
}

function CabinCard({ ship, cabin }: { ship: Ship; cabin: Cabin }) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#dedcd3] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[#0d1b2a]">{cabin.name}</h3>
          {cabin.nameBn && <p className="text-sm font-semibold text-[#1d9e75]">{cabin.nameBn}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-[#f1f0ec] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#6b6a63]">{cabin.capacity}</span>
      </div>
      <p className="mt-3 t-body text-[#4a5a5c]">{cabin.description}</p>
      {cabin.oneWayFare && (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#fdf8f3] p-3">
          <FareTag label="One way" value={cabin.oneWayFare} />
          <FareTag label="Round trip" value={cabin.roundTripFare ?? 'Not published'} />
        </div>
      )}
      <ContactLink href={`${whatsapp}Hello ShipTickets.bd, I want to check ${ship.name} ${cabin.name} availability and price for my travel date.`} kind="whatsapp" eventLabel="cabin_block" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#cfe1df] px-4 py-2.5 text-xs font-extrabold text-[#0d1b2a] transition hover:border-[#1d9e75] hover:text-[#1d9e75]">
        Check cabin availability
      </ContactLink>
    </article>
  )
}

export function CategoryCompare({ ship }: { ship: Ship }) {
  const guidance: CategoryGuidance[] = ship.categoryGuidance ?? []
  if (guidance.length === 0) return null

  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <h2 className="t-title">Which category should you choose?</h2>
      <p className="mt-2 t-body text-[#4a5a5c]">Choose by seating preference, privacy and budget rather than assuming one category is better.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[#e7f0ee]">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[#0d1b2a]/[4%]">
            <tr>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Best for</th>
              <th className="px-4 py-3 font-bold">Privacy</th>
              <th className="px-4 py-3 font-bold">Outdoor access</th>
              <th className="px-4 py-3 font-bold">Price level</th>
            </tr>
          </thead>
          <tbody>
            {guidance.map((row) => (
              <tr key={row.category} className="border-t border-[#e7f0ee]">
                <td className="px-4 py-3 font-extrabold">{row.category}</td>
                <td className="px-4 py-3 text-[#5f5e5a]">{row.bestFor}</td>
                <td className="px-4 py-3 text-[#5f5e5a]">{row.privacy}</td>
                <td className="px-4 py-3 text-[#5f5e5a]">{row.outdoor}</td>
                <td className="px-4 py-3 font-extrabold text-[#1d9e75]">{row.priceLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function FacilitiesGrid({ ship }: { ship: Ship }) {
  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Onboard facilities</h2>
        <ConfidenceBadge kind="confirm">Confirm before booking</ConfidenceBadge>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ship.facilities.map((facility) => (
          <li key={facility.name} className="flex items-start gap-2 rounded-xl border border-[#f0efea] p-3 text-sm">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${facility.available ? 'bg-[#1d9e75]' : 'bg-[#cbd5d2]'}`} />
            <span className="text-[#0d1b2a]">{facility.name}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 t-small text-[#67878c]">Facilities can vary by class and sailing. If a particular facility matters to your trip, confirm it before payment.</p>
    </section>
  )
}

export function ScheduleBlock({ ship }: { ship: Ship }) {
  const rows: ShipSpec[] = [
    { label: 'Operating period', value: `Seasonal. ${season.label} opens ${season.startDate}` },
    { label: 'Departure', value: ship.departure ?? 'Confirm for your sailing date' },
    { label: 'Check-in / reporting', value: ship.checkIn ?? 'Confirm on your ticket' },
    { label: 'Journey duration', value: ship.journeyDuration ?? 'Confirm for your sailing date' },
    { label: 'Boarding point', value: ship.jetty ?? "BIWTA Nuniachhara Jetty, Cox's Bazar" },
    { label: 'Return sailing', value: 'Confirm the return date and time with your ticket' },
    { label: 'Cancellation', value: ship.cancellation ?? 'Subject to operator and season rules; confirm before payment' },
  ]

  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Schedule &amp; boarding</h2>
        <ConfidenceBadge kind="seasonal">Seasonal confirmation</ConfidenceBadge>
      </div>
      <div className="rounded-xl border border-[#f3d9bf] bg-[#fff8ee] p-4 text-sm text-[#6f5d5a]">
        <p className="flex items-start gap-2">
          <CircleAlert className="mt-0.5 shrink-0 text-[#af6a3c]" size={17} />
          <span>Do not rely on a departure time copied from a previous season. Schedules change with tide, weather, sea conditions, operator decisions and government instructions.</span>
        </p>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-[#f0efea] pb-3">
            <dt className="text-[11px] font-black uppercase tracking-wider text-[#888780]">{row.label}</dt>
            <dd className="mt-1 text-sm font-bold text-[#0d1b2a]">{row.value}</dd>
          </div>
        ))}
      </dl>
      <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please confirm the ${ship.name} schedule for my travel date.`} kind="whatsapp" eventLabel="ship_schedule" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#167d5d]">
        Check the schedule for my date
      </ContactLink>
    </section>
  )
}

export function BookingSteps({ ship }: { ship: Ship }) {
  const steps = [
    { title: 'Send your travel date', text: 'Tell us the date you plan to travel.' },
    { title: 'Share passenger count', text: 'How many passengers, and any children or infants?' },
    { title: 'Choose a category', text: `Pick a seating or cabin category on ${ship.name}.` },
    { title: 'We confirm', text: 'Current fare, availability, boarding information and Travel Pass requirements.' },
  ]

  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <h2 className="t-title">How booking works</h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-[#f0efea] p-4">
            <span className="grid size-8 place-items-center rounded-full bg-[#1d9e75] text-xs font-black text-white">{index + 1}</span>
            <h3 className="mt-3 font-extrabold text-[#0d1b2a]">{step.title}</h3>
            <p className="mt-1 t-body text-[#4a5a5c]">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 t-small text-[#67878c]">ShipTickets.bd does not process payment on this website. A support agent confirms the booking before you pay.</p>
    </section>
  )
}

export function BeforeYouPay({ items }: { items: string[] }) {
  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <h2 className="t-title">Check before you pay</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 t-body text-[#4a5a5c]">
            <Check className="mt-1 shrink-0 text-[#1d9e75]" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FaqList({ items, heading = 'FAQ', headingBn }: { items: [string, string][]; heading?: string; headingBn?: string }) {
  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <h2 className="t-title">{heading}</h2>
      {headingBn && <p className="mt-1 text-sm font-semibold text-[#1d9e75]">{headingBn}</p>}
      <div className="mt-5 flex flex-col divide-y divide-[#f0efea]">
        {items.map(([question, answer]) => (
          <div key={question} className="py-4 first:pt-0 last:pb-0">
            <h3 className="font-extrabold text-[#0d1b2a]">{question}</h3>
            <p className="mt-1.5 t-body text-[#4a5a5c]">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function BookingCta({ ship, heading = 'Ready to check availability?' }: { ship: Ship; heading?: string }) {
  return (
    <section className="mb-10 overflow-hidden rounded-3xl bg-[#0d1b2a] p-7 text-white md:p-10">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-1 shrink-0 text-[#f8bf74]" size={20} />
        <div>
          <h2 className="text-2xl font-black tracking-tight">{heading}</h2>
      <p className="t-body mt-2 text-[#4a5a5c]">
        Send your <strong className="text-white">travel date, passenger count and preferred category</strong>. We will confirm the current fare, availability, boarding information and Travel Pass requirements before you book.
      </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please share my travel date, passenger count and preferred category on ${ship.name}.`} kind="whatsapp" eventLabel="booking_cta" className="inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#167d5d]">
              Check availability on WhatsApp
            </ContactLink>
            <Link href="/saint-martin-ship-ticket-price" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/10">
              Compare all fares
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProvenanceNote({ ship }: { ship: Ship }) {
  return (
    <div className="mb-10 rounded-2xl border border-[#d4e6e2] bg-[#f7fbfa] p-5">
      <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#0f6e56]">
        <ShieldCheck size={16} /> Information source
      </h2>
      <ul className="mt-3 flex flex-col gap-1.5 t-body text-[#4a5a5c]">
        <li>Fare and class information: {ship.source}</li>
        <li>Schedule last checked: {ship.lastVerified}.</li>
        <li>Government travel rules checked against official notices. The {season.label} season opens {season.startDate}.</li>
        <li>Information last reviewed: {LAST_REVIEWED}.</li>
      </ul>
      <Link href="/how-we-verify-information" className="mt-3 inline-block text-sm font-extrabold text-[#1d9e75] hover:underline">How we verify ship information →</Link>
    </div>
  )
}

export function JettyNote({ ship }: { ship: Ship }) {
  return (
    <div className="mb-10 flex items-start gap-3 rounded-2xl border border-[#dedcd3] bg-white p-5">
      <MapPin className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} />
      <p className="t-body text-[#4a5a5c]">
        <strong className="text-[#0d1b2a]">Boarding point:</strong> {ship.jetty ?? "BIWTA Nuniachhara Jetty, Cox's Bazar"}. Boarding arrangements can change between seasons, so confirm the jetty printed on your ticket.
      </p>
    </div>
  )
}

/**
 * The former "Customers who booked with us" block was removed.
 *
 * It showed a customer count next to a claim of human-assisted booking, which
 * read as marketing rather than information and repeated claims made
 * elsewhere. The one number worth publishing, the business rating, now sits
 * beside "Information last reviewed" in components/seo-page.tsx, where it is
 * paired with the review count it comes from.
 */

const REVIEW_SOURCE_LABEL: Record<string, string> = {
  google: 'Google review',
  facebook: 'Facebook review',
  'post-trip': 'Post-trip feedback',
  'whatsapp-survey': 'WhatsApp survey',
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-[#f8bf74]' : 'text-[#dedcd3]'} aria-hidden="true">★</span>
      ))}
    </span>
  )
}

/**
 * Renders collected customer reviews and nothing else.
 *
 * There is deliberately no fallback: with no genuine reviews in
 * content/reviews.json this block renders null, so the site never implies a
 * rating or review count it cannot substantiate.
 */
export function CustomerReviews({ ship }: { ship: Ship }) {
  const shipReviews = getReviewsForShip(ship.slug)
  if (shipReviews.length === 0) return null

  const average = Math.round((shipReviews.reduce((sum, review) => sum + review.rating, 0) / shipReviews.length) * 10) / 10

  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="t-title">What passengers say</h2>
          <p className="mt-1 t-body text-[#4a5a5c]">Collected from real post-trip feedback and public reviews.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#dedcd3] bg-[#f7f6f2] px-4 py-3">
          <span className="text-3xl font-black text-[#0d1b2a]">{average.toFixed(1)}</span>
          <div>
            <Stars rating={average} />
            <p className="mt-0.5 text-xs font-semibold text-[#729298]">Based on {shipReviews.length} review{shipReviews.length === 1 ? '' : 's'}</p>
          </div>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {shipReviews.map((review, index) => (
          <li key={`${review.author}-${index}`} className="rounded-2xl border border-[#f0efea] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-extrabold text-[#0d1b2a]">{review.author}</p>
              <Stars rating={review.rating} />
            </div>
            <p className="mt-3 t-body text-[#4a5a5c]">{review.text}</p>
            <p className="mt-3 text-xs text-[#888780]">
              <time dateTime={review.date}>{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
              {' · '}{REVIEW_SOURCE_LABEL[review.source] ?? review.source}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
