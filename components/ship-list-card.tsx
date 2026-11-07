import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { whatsapp } from '@/components/seo-page'
import { isPreBooking, type Ship } from '@/lib/ships'

/** What each ship suits, from its published categories. */
export const BEST_FOR: Record<string, { en: string; bn: string }> = {
  'mv-teknaf': { en: 'The lowest published fare', bn: 'সবচেয়ে কম ভাড়া চাইলে' },
  'karnafuly-express': { en: 'Lounges and private cabins', bn: 'লাউঞ্জ বা আলাদা কেবিন চাইলে' },
  'baro-awlia': { en: 'AC business chairs and family cabins', bn: 'এসি বিজনেস চেয়ার বা ফ্যামিলি কেবিন চাইলে' },
  'keari-sindbad': { en: 'Non-AC deck seating, including open deck', bn: 'খোলা ডেকে নন-এসি সিটে যেতে চাইলে' },
  'keari-cruise-dine': { en: 'AC lounges and an onboard restaurant', bn: 'এসি লাউঞ্জ ও রেস্টুরেন্ট চাইলে' },
}

/** One ship with its fares, for the homepage and the ship list. */
export function ShipListCard({ ship, cheapest, eventLabel }: { ship: Ship; cheapest?: boolean; eventLabel: string }) {
  const best = BEST_FOR[ship.slug]
  const message = `${whatsapp}${encodeURIComponent(`Hello ShipTickets.bd, I want to check ${ship.name} availability for my travel date.`)}`
  const seats = ship.ticketClasses.length
  const seatTotal = ship.capacity?.match(/\d[\d,]*/)?.[0]
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-raised">
      <Link href={`/saint-martin-ship/${ship.slug}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[5/2] overflow-hidden bg-[#dcefeb] sm:aspect-[16/9]">
        <Image src={ship.image || '/no-image.jpg'} alt={ship.image ? (ship.imageAlt ?? `${ship.name} passenger ship`) : ''} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        {isPreBooking(ship) && <span className="absolute left-3 top-3 rounded-full bg-[#fff8ee] px-3 py-1 text-[0.8125rem] font-bold text-[#8a5a2f] shadow-card">Pre-booking open</span>}
        {cheapest && <span lang="bn" className="absolute left-3 top-3 rounded-full bg-brand-ink px-3 py-1 text-[0.8125rem] font-bold text-white shadow-card">সবচেয়ে কম ভাড়া</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-xl font-black leading-snug text-ink"><Link href={`/saint-martin-ship/${ship.slug}`} className="transition-colors hover:text-brand-ink">{ship.name}</Link></h3>
          <p lang="bn" className="text-sm font-semibold text-brand-ink">{ship.nameBn}</p>
        </div>
        <p className="t-small mt-1 hidden text-prose sm:block">Best for: {best?.en}</p>
        <p lang="bn" className="text-[0.9375rem] font-semibold leading-relaxed text-ink">{best?.bn}</p>

        <dl className="mt-3 grid grid-cols-2 divide-x divide-[#dcece9] rounded-2xl bg-[#f7fbfa] py-3">
          <div className="px-3.5"><dt className="text-xs font-bold text-quiet">One way from</dt><dd className="mt-0.5 text-xl font-black tabular-nums text-ink">{ship.oneWay}</dd></div>
          <div className="px-3.5"><dt className="text-xs font-bold text-quiet">Round trip from</dt><dd className="mt-0.5 text-xl font-black tabular-nums text-ink">{ship.roundTrip}</dd></div>
        </dl>

        <ul className="mb-3 mt-3 flex flex-wrap gap-1.5 text-[0.8125rem] font-semibold">
          <li className="rounded-lg bg-[#eef5f3] px-2.5 py-1 text-[#1d5c4b]">{seats} seat {seats === 1 ? 'class' : 'classes'}</li>
          <li className="rounded-lg bg-[#eef5f3] px-2.5 py-1 text-[#1d5c4b]">{ship.cabins.length > 0 ? `${ship.cabins.length} cabin types` : 'No cabins published'}</li>
          {seatTotal && <li className="hidden rounded-lg bg-[#f4f3ee] px-2.5 py-1 text-[#57564f] sm:block">{seatTotal} seats</li>}
        </ul>

        <div className="mt-auto grid grid-cols-[1.25fr_1fr] gap-2">
          <Link href={`/saint-martin-ship/${ship.slug}`} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-brand-ink px-3 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">Fares &amp; seats <ArrowRight size={16} aria-hidden="true" /></Link>
          <ContactLink href={message} kind="whatsapp" eventLabel={eventLabel} ariaLabel={`Ask about ${ship.name} on WhatsApp`} className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-line px-3 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</ContactLink>
        </div>
      </div>
    </article>
  )
}
