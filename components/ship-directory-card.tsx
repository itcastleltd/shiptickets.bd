import Image from 'next/image'
import { Anchor, BedDouble, MessageCircle, Ticket, Users } from 'lucide-react'

import { STATUS_LABELS, type Ship } from '@/lib/ships'
import { whatsapp } from '@/components/seo-page'
import { ContactLink } from '@/components/contact-link'
import { ButtonLink } from '@/components/button'

/**
 * Operating status, coloured by how much the visitor still has to confirm.
 *
 * The directory page previously showed no status at all on its cards while the
 * table above it did, so a seasonal vessel looked as settled as a confirmed
 * one. The three states now map to the same three wordings used everywhere else
 * in the app.
 */
const STATUS_STYLES: Record<Ship['status'], string> = {
  verified: 'bg-[#e1f5ee] text-[#0f6e56]',
  seasonal_confirmation: 'bg-[#fff5e7] text-warm-strong',
  needs_confirmation: 'bg-[#f1f0ec] text-[#6b6a63]',
}

/**
 * One ship, as a card, on the Saint Martin ships directory.
 *
 * The card is ordered by what a visitor actually decides on: which vessel it is
 * and whether it is sailing, what it costs, what is on board, and only then the
 * two actions. The actions are buttons rather than bare text links because both
 * are commitments (open the full guide, or start a booking conversation) and
 * the previous plain underlined text read as a footnote.
 */
export function ShipDirectoryCard({ ship }: { ship: Ship }) {
  const hasCabins = ship.cabins.length > 0

  const facts = [
    {
      icon: <Ticket size={16} aria-hidden="true" />,
      label: 'Seating classes',
      value: String(ship.ticketClasses.length),
      note: ship.ticketClasses.map((ticketClass) => ticketClass.name).slice(0, 3).join(', ') +
        (ship.ticketClasses.length > 3 ? ` +${ship.ticketClasses.length - 3} more` : ''),
    },
    {
      icon: <BedDouble size={16} aria-hidden="true" />,
      label: 'Private cabins',
      value: hasCabins ? String(ship.cabins.length) : 'None',
      note: hasCabins ? ship.cabins.map((cabin) => cabin.name).join(', ') : 'No cabin inventory published',
    },
    {
      icon: <Users size={16} aria-hidden="true" />,
      label: 'Capacity',
      value: ship.capacity ? ship.capacity.replace(/\s*\(.*\)\s*$/, '') : '—',
      note: ship.capacity?.includes('(') ? ship.capacity.slice(ship.capacity.indexOf('(') + 1, ship.capacity.indexOf(')') + 1) : 'Published figure',
    },
  ]

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card transition hover:-translate-y-0.5 hover:border-brand-ink hover:shadow-raised">
      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#dcefeb] sm:h-44">
        {ship.image ? (
          <Image
            src={ship.image}
            alt={ship.imageAlt ?? `${ship.name} passenger ship`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-brand-ink">
            <Anchor size={32} aria-hidden="true" />
            <span className="sr-only">{ship.name}</span>
          </div>
        )}
        <span className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 t-label shadow-card ${STATUS_STYLES[ship.status]}`}>
          {STATUS_LABELS[ship.status]}
        </span>
        {ship.photoPending && (
          <span className="absolute inset-x-0 bottom-0 bg-[#0d1b2a]/80 px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white">
            Operator photo coming soon
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="t-subtitle text-ink">{ship.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-ink" lang="bn">
          {ship.nameBn}
        </p>
        <p className="t-body mt-3 text-prose">{ship.detail}</p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-line-soft bg-[#f7fbfa] p-3">
              <dt className="flex items-center gap-1.5 t-label text-faint">
                <span className="text-brand-ink">{fact.icon}</span>
                {fact.label}
              </dt>
              <dd className="mt-1.5">
                <span className="block text-base font-black text-ink">{fact.value}</span>
                <span className="mt-0.5 block text-xs leading-5 text-quiet">{fact.note}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-[#f5faf9] p-4">
          <div>
            <p className="t-label text-quiet">One way from</p>
            <p className="mt-0.5 text-2xl font-black tracking-tight text-ink">{ship.oneWay}</p>
          </div>
          <div>
            <p className="t-label text-quiet">Round trip from</p>
            <p className="mt-0.5 text-2xl font-black tracking-tight text-ink">{ship.roundTrip}</p>
          </div>
          <p className="col-span-2 text-xs text-faint">Reference fares per person, not live inventory. Confirm your date before you pay.</p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center md:mt-6">
          <ButtonLink href={`/saint-martin-ship/${ship.slug}`} variant="secondary" className="w-full sm:w-auto">
            See full details
          </ButtonLink>
          <ContactLink
            href={`${whatsapp}Hello ShipTickets.bd, please check ${ship.name} availability for my travel date.`}
            kind="whatsapp"
            eventLabel="ship_card"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#13734f] sm:w-auto"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Check availability
          </ContactLink>
        </div>
      </div>
    </article>
  )
}
