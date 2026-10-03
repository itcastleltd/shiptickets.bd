import Link from 'next/link'
import { Check, CircleAlert, Info, MapPin, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { CONFIDENCE_LABELS, LAST_REVIEWED, STATUS_LABELS, WHATSAPP_NUMBER, getReviewsForShip, season, type Cabin, type CategoryGuidance, type Ship, type ShipSpec, type TicketClass } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=`

type Confidence = keyof typeof CONFIDENCE_LABELS

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  verified: 'bg-[#e1f5ee] text-[#0f6e56]',
  reference: 'bg-[#eaf5f3] text-[#1d6b57]',
  seasonal: 'bg-[#fff5e7] text-warm-strong',
  confirm: 'bg-[#f1f0ec] text-[#6b6a63]',
}

export function ConfidenceBadge({ kind, children }: { kind: Confidence; children?: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 t-label ${CONFIDENCE_STYLES[kind]}`}>
      {children ?? CONFIDENCE_LABELS[kind]}
    </span>
  )
}

/**
 * Anchor offset for the in-page navigation on ship pages.
 *
 * The sticky site header is 72px and the sticky "On this page" bar sits directly
 * under it, so a target needs roughly 120px of clearance. Without it, following
 * a jump link parks the section heading underneath both bars.
 */
const ANCHOR_CLEARANCE = 'scroll-mt-32'


export function QuickFacts({ ship, title = 'At a glance', id }: { ship: Ship; title?: string; id?: string }) {
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
  ].filter((fact, index, all) => all.findIndex((other) => other.label === fact.label) === index)

  /**
   * Only a `verified` ship may carry the green "Operator-published" badge.
   * Hardcoding it made vessels that still need confirmation look confirmed,
   * while the Status row directly below said otherwise.
   */
  const statusConfidence: Confidence =
    ship.status === 'verified' ? 'verified' : ship.status === 'seasonal_confirmation' ? 'seasonal' : 'confirm'

  return (
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">{title}</h2>
        <ConfidenceBadge kind={statusConfidence} />
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.label} className="border-b border-line-soft pb-3">
            <dt className="t-label text-faint">{fact.label}</dt>
            <dd className="mt-1 text-sm font-extrabold text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function FareTag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="t-label text-quiet">{label}</p>
      <p className="mt-0.5 text-lg font-black text-ink">{value}</p>
    </div>
  )
}

export function TicketCards({ ship, id }: { ship: Ship; id?: string }) {
  return (
    <section id={id} className={`mb-10 ${ANCHOR_CLEARANCE}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Choose your ticket</h2>
        <ConfidenceBadge kind="reference" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ship.ticketClasses.map((ticketClass) => (
          <TicketCard key={ticketClass.name} ship={ship} ticketClass={ticketClass} />
        ))}
      </div>
      <p className="mt-4 t-small t-measure text-quiet">
        Prices may vary by travel date, season, ticket class and operator policy. These are reference fares rather than live inventory, so confirm before you pay.
      </p>
    </section>
  )
}

function TicketCard({ ship, ticketClass }: { ship: Ship; ticketClass: TicketClass }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line-soft bg-white p-5 transition hover:border-brand-ink hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-ink">{ticketClass.name}</h3>
          {ticketClass.nameBn && <p className="text-sm font-semibold text-brand-ink">{ticketClass.nameBn}</p>}
        </div>
        {ticketClass.deck && <span className="shrink-0 rounded-full bg-[#eaf5f3] px-2.5 py-1 t-label text-[#1d6b57]">{ticketClass.deck}</span>}
      </div>
      <p className="mt-3 t-body text-prose">{ticketClass.description}</p>
      {ticketClass.seatCount && <p className="mt-2 text-xs font-semibold text-quiet">{ticketClass.seatCount}</p>}
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f7fbfa] p-3">
        <FareTag label="One way" value={ticketClass.oneWayFare} />
        <FareTag label="Round trip" value={ticketClass.roundTripFare} />
      </div>
      <ContactLink href={`${whatsapp}Hello ShipTickets.bd, I want to check ${ship.name} ${ticketClass.name} availability for my travel date.`} kind="whatsapp" eventLabel="ticket_class" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0d1b2a] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-ink">
        Check availability <span aria-hidden="true">→</span>
      </ContactLink>
    </article>
  )
}

export function FareTable({ ship, id }: { ship: Ship; id?: string }) {
  const hasReturnLeg = ship.ticketClasses.some((ticketClass) => ticketClass.downFare)
  return (
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Fare table</h2>
        <ConfidenceBadge kind="reference">Reference fare</ConfidenceBadge>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line-soft">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-[#e3ecea] text-ink">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Category</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Cox’s Bazar → Saint Martin</th>
              {hasReturnLeg && <th scope="col" className="px-4 py-3 text-right font-bold">Saint Martin → Cox’s Bazar</th>}
              <th scope="col" className="px-4 py-3 text-right font-bold">Round trip</th>
            </tr>
          </thead>
          <tbody>
            {ship.ticketClasses.map((ticketClass) => (
              <tr key={ticketClass.name} className="border-t border-line-soft">
                <td className="px-4 py-3">
                  <strong>{ticketClass.name}</strong>
                  {ticketClass.deck && <span className="block text-xs text-quiet">{ticketClass.deck}</span>}
                </td>
                <td className="px-4 py-3 text-right font-extrabold">{ticketClass.oneWayFare}</td>
                {hasReturnLeg && <td className="px-4 py-3 text-right font-extrabold text-quiet">{ticketClass.downFare ?? 'Not published'}</td>}
                <td className="px-4 py-3 text-right font-extrabold">{ticketClass.roundTripFare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 t-small t-measure text-quiet">Fare source: {ship.source}</p>
    </section>
  )
}

export function CabinBlock({ ship, id }: { ship: Ship; id?: string }) {
  if (ship.cabins.length === 0) {
    return (
      <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
        <h2 className="t-title">Cabins</h2>
        <p className="mt-3 flex gap-2 t-body text-prose">
          <Info className="mt-1 shrink-0 text-brand-ink" size={17} />
          {ship.cabinNote ?? 'No cabin inventory is published for this vessel. Confirm current availability before booking.'}
        </p>
      </section>
    )
  }

  return (
    <section id={id} className={`mb-10 ${ANCHOR_CLEARANCE}`}>
      <h2 className="t-title mb-4">Cabins</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {ship.cabins.map((cabin) => (
          <CabinCard key={cabin.name} ship={ship} cabin={cabin} />
        ))}
      </div>
      <p className="mt-4 t-small t-measure text-quiet">Cabin inventory is limited. Confirm availability, occupancy and included facilities before payment.</p>
    </section>
  )
}

function CabinCard({ ship, cabin }: { ship: Ship; cabin: Cabin }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line-soft bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-ink">{cabin.name}</h3>
          {cabin.nameBn && <p className="text-sm font-semibold text-brand-ink">{cabin.nameBn}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-[#f1f0ec] px-2.5 py-1 t-label text-[#6b6a63]">{cabin.capacity}</span>
      </div>
      <p className="mt-3 t-body text-prose">{cabin.description}</p>
      {cabin.oneWayFare && (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#fdf8f3] p-3">
          <FareTag label="One way" value={cabin.oneWayFare} />
          <FareTag label="Round trip" value={cabin.roundTripFare ?? 'Not published'} />
        </div>
      )}
      <ContactLink href={`${whatsapp}Hello ShipTickets.bd, I want to check ${ship.name} ${cabin.name} availability and price for my travel date.`} kind="whatsapp" eventLabel="cabin_block" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-xs font-extrabold text-ink transition hover:border-brand-ink hover:text-brand-ink">
        Check cabin availability
      </ContactLink>
    </article>
  )
}

export function CategoryCompare({ ship, id }: { ship: Ship; id?: string }) {
  const guidance: CategoryGuidance[] = ship.categoryGuidance ?? []
  if (guidance.length === 0) return null

  return (
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <h2 className="t-title">Which category should you choose?</h2>
      <p className="mt-2 t-body t-measure text-prose">Choose by seating preference, privacy and budget rather than assuming one category is better.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[#e3ecea] text-ink">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Category</th>
              <th scope="col" className="px-4 py-3 font-bold">Best for</th>
              <th scope="col" className="px-4 py-3 font-bold">Privacy</th>
              <th scope="col" className="px-4 py-3 font-bold">Outdoor access</th>
              <th scope="col" className="px-4 py-3 font-bold">Price level</th>
            </tr>
          </thead>
          <tbody>
            {guidance.map((row) => (
              <tr key={row.category} className="border-t border-line-soft">
                <td className="px-4 py-3 font-extrabold">{row.category}</td>
                <td className="px-4 py-3 text-prose">{row.bestFor}</td>
                <td className="px-4 py-3 text-prose">{row.privacy}</td>
                <td className="px-4 py-3 text-prose">{row.outdoor}</td>
                <td className="px-4 py-3 font-extrabold text-brand-ink">{row.priceLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function FacilitiesGrid({ ship, id }: { ship: Ship; id?: string }) {
  return (
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Onboard facilities</h2>
        <ConfidenceBadge kind="confirm">Confirm before booking</ConfidenceBadge>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ship.facilities.map((facility) => (
          <li key={facility.name} className="flex items-start gap-2 rounded-xl border border-line-soft p-3 text-sm">
            <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${facility.available ? 'bg-[#1d9e75]' : 'bg-[#cbd5d2]'}`} />
            <span className="text-ink">{facility.name}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 t-small t-measure text-quiet">Facilities can vary by class and sailing. If a particular facility matters to your trip, confirm it before payment.</p>
    </section>
  )
}

export function ScheduleBlock({ ship, id }: { ship: Ship; id?: string }) {
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
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="t-title">Schedule &amp; boarding</h2>
        <ConfidenceBadge kind="seasonal">Seasonal confirmation</ConfidenceBadge>
      </div>
      <div className="rounded-xl border border-[#f3d9bf] bg-[#fff8ee] p-4 text-sm text-[#6f5d5a]">
        <p className="flex items-start gap-2">
          <CircleAlert className="mt-0.5 shrink-0 text-warm" size={17} />
          <span>Do not rely on a departure time copied from a previous season. Schedules change with tide, weather, sea conditions, operator decisions and government instructions.</span>
        </p>
      </div>
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-line-soft pb-3">
            <dt className="t-label text-faint">{row.label}</dt>
            <dd className="mt-1 text-sm font-bold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please confirm the ${ship.name} schedule for my travel date.`} kind="whatsapp" eventLabel="ship_schedule" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#13734f]">
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
    <section className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8">
      <h2 className="t-title">How booking works</h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-line-soft p-4">
            <span className="grid size-8 place-items-center rounded-full bg-brand-ink text-xs font-black text-white">{index + 1}</span>
            <h3 className="mt-3 font-extrabold text-ink">{step.title}</h3>
            <p className="mt-1 t-body text-prose">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 t-small t-measure text-quiet">ShipTickets.bd does not process payment on this website. A support agent confirms the booking before you pay.</p>
    </section>
  )
}

export function BeforeYouPay({ items }: { items: string[] }) {
  return (
    <section className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8">
      <h2 className="t-title">Check before you pay</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 t-body text-prose">
            <Check className="mt-1 shrink-0 text-brand-ink" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FaqList({ items, heading = 'FAQ', headingBn, id }: { items: [string, string][]; heading?: string; headingBn?: string; id?: string }) {
  return (
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <h2 className="t-title">{heading}</h2>
      {headingBn && <p className="mt-1 text-sm font-semibold text-brand-ink">{headingBn}</p>}
      <div className="mt-5 flex flex-col divide-y divide-[#f0efea]">
        {items.map(([question, answer]) => (
          <div key={question} className="py-4 first:pt-0 last:pb-0">
            <h3 className="font-extrabold text-ink">{question}</h3>
            <p className="mt-1.5 t-body t-measure text-prose">{answer}</p>
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
          <h2 className="t-title">{heading}</h2>
      <p className="t-body mt-2 t-measure text-on-dark">
        Send your <strong className="text-white">travel date, passenger count and preferred category</strong>. We will confirm the current fare, availability, boarding information and Travel Pass requirements before you book.
      </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please share my travel date, passenger count and preferred category on ${ship.name}.`} kind="whatsapp" eventLabel="booking_cta" className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#13734f]">
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
    <div className="mb-10 rounded-2xl border border-line-soft bg-[#f7fbfa] p-5">
      <h2 className="flex items-center gap-2 t-label text-[#0f6e56]">
        <ShieldCheck size={16} /> Information source
      </h2>
      <ul className="mt-3 flex flex-col gap-1.5 t-body t-measure text-prose">
        <li>Fare and class information: {ship.source}</li>
        <li>Schedule last checked: {ship.lastVerified}.</li>
        <li>Government travel rules checked against official notices. The {season.label} season opens {season.startDate}.</li>
      </ul>
      <Link href="/how-we-verify-information" className="mt-3 inline-block text-sm font-extrabold text-brand-ink hover:underline">How we verify ship information →</Link>
    </div>
  )
}

export function JettyNote({ ship }: { ship: Ship }) {
  return (
    <div className="mb-10 flex items-start gap-3 rounded-2xl border border-line-soft bg-white p-5">
      <MapPin className="mt-0.5 shrink-0 text-brand-ink" size={18} />
      <p className="t-body t-measure text-prose">
        <strong className="text-ink">Boarding point:</strong> {ship.jetty ?? "BIWTA Nuniachhara Jetty, Cox's Bazar"}. Boarding arrangements can change between seasons, so confirm the jetty printed on your ticket.
      </p>
    </div>
  )
}

/**
 * Frequently asked questions, as a native disclosure list.
 *
 * This existed six times on the site in five different shapes: a tracked
 * client-side accordion on the homepage, native `<details>` on the ticket price
 * page, an always-open divided stack on the four ship pages, and bare
 * `<p>question</p><p>answer</p>` pairs on four more pages. The bare pairs were
 * the worst of them: no affordance, no divider, nothing to scan, and they sat
 * inside the two-column prose flow where a question can land at the foot of one
 * column and its answer at the head of the next. Identical content, four
 * different appearances.
 *
 * `<details>` is used rather than a button so it works with no JavaScript, is
 * keyboard operable for free, and needs no ARIA. The answer stays in the DOM, so
 * the `FAQPage` schema these pages already emit still matches visible content.
 *
 * Full width with the answer held to 78ch: the row is a discrete unit, so the
 * slack to the right of a short answer reads as margin rather than as a box
 * that failed to fill.
 */
export function FaqAccordion({
  items,
  heading = 'FAQ',
  headingBn,
  id,
}: {
  items: [string, string][]
  heading?: string
  headingBn?: string
  id?: string
}) {
  if (items.length === 0) return null

  return (
    <section id={id} className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8">
      <h2 className="t-title">{heading}</h2>
      {headingBn && <p className="mt-1 text-sm font-semibold text-brand-ink">{headingBn}</p>}
      <div className="mt-4 flex flex-col divide-y divide-line-soft">
        {items.map(([question, answer]) => (
          <details key={question} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 font-extrabold text-ink marker:content-none">
              <span className="t-body">{question}</span>
              <span
                className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#eaf5f3] text-brand-ink transition group-open:rotate-45"
                aria-hidden="true"
              >
                <Plus size={15} />
              </span>
            </summary>
            <p className="t-body t-measure pb-5 text-prose">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/**
 * Ship quick answer: the questions a visitor has before choosing a vessel.
 *
 * Rendered as labelled question-and-answer rows separated by rules, because the
 * previous version was two loose paragraphs per question inside a tinted panel,
 * which gave no indication that the text was a Q&A at all.
 *
 * The panel is a left rule with a background rather than a full bordered box, so
 * the 78ch answer column does not sit inside a frame that is visibly wider than
 * its contents. This is the one full-width treatment that does not read as a
 * half-empty box.
 */
export function QuickAnswer({ items, id }: { items: [string, string][]; id?: string }) {
  if (items.length === 0) return null

  return (
    <section id={id} className="mb-10 border-l-4 border-brand bg-[#f7fbfa] p-6 md:p-7">
      <h2 className="t-label text-brand-ink">Quick Answer</h2>
      <div className="mt-4 flex flex-col divide-y divide-[#dcece9]">
        {items.map(([question, answer]) => (
          <div key={question} className="py-4 first:pt-0 last:pb-0">
            <p className="font-extrabold text-ink">{question}</p>
            <p className="t-body mt-1.5 t-measure text-prose">{answer}</p>
          </div>
        ))}
      </div>
    </section>
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
export function CustomerReviews({ ship, id }: { ship: Ship; id?: string }) {
  const shipReviews = getReviewsForShip(ship.slug)
  if (shipReviews.length === 0) return null

  const average = Math.round((shipReviews.reduce((sum, review) => sum + review.rating, 0) / shipReviews.length) * 10) / 10

  return (
    <section id={id} className={`mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8 ${ANCHOR_CLEARANCE}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="t-title">What passengers say</h2>
          <p className="mt-1 t-body t-measure text-prose">Collected from real post-trip feedback and public reviews.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-line-soft bg-[#f7f6f2] px-4 py-3">
          <span className="text-3xl font-black text-ink">{average.toFixed(1)}</span>
          <div>
            <Stars rating={average} />
            <p className="mt-0.5 text-xs font-semibold text-quiet">Based on {shipReviews.length} review{shipReviews.length === 1 ? '' : 's'}</p>
          </div>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {shipReviews.map((review, index) => (
          <li key={`${review.id}-${index}`} className="rounded-2xl border border-line-soft p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-extrabold text-ink">{review.name}</p>
                {review.location && <p className="text-xs text-quiet">{review.location}</p>}
              </div>
              <Stars rating={review.rating} />
            </div>
            <p className="mt-3 t-body text-prose">{review.review_text}</p>
            <p className="mt-3 text-xs text-faint">
              <time dateTime={review.date}>{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
