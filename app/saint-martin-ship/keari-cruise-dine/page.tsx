import type { Metadata } from 'next'
import Image from 'next/image'
import { SeoPage, Section, Bullet, Schema, siteSchema, breadcrumbSchema, productSchema, faqSchema, whatsapp } from '@/components/seo-page'
import { getShipBySlug } from '@/lib/ships'
import { Clock, MapPin, Users, Waves, CalendarDays } from 'lucide-react'

const ship = getShipBySlug('keari-cruise-dine')!

export const metadata: Metadata = {
  title: `${ship.name} Saint Martin Ship Tickets | ShipTickets.bd`,
  description: `Compare ${ship.name} ticket prices, dining options, classes and schedule for Cox's Bazar to Saint Martin. Last verified: ${ship.lastVerified}.`,
  openGraph: {
    title: `${ship.name} Saint Martin Ship Tickets | ShipTickets.bd`,
    description: `Compare ${ship.name} ticket prices, dining options, classes and schedule for Cox's Bazar to Saint Martin. Last verified: ${ship.lastVerified}.`,
    images: ship.image ? [`https://www.shiptickets.bd${ship.image}`] : undefined,
  },
}

const availabilityLabel = { verified: 'Verified', needs_confirmation: 'Check latest', seasonal_confirmation: 'Seasonal confirmation' }[ship.status]

export default function KeariCruiseDinePage() {
  return (
    <SeoPage
      eyebrow={`Ship guide · ${ship.name}`}
      title={`${ship.name} Saint Martin ship tickets`}
      intro="Plan your Saint Martin trip with clear information about Keari Cruise & Dine seating, dining and seasonal ticket confirmation."
    >
      {ship.image && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl">
          <Image src={ship.image} alt={`${ship.name} passenger ship`} fill className="object-cover" />
        </div>
      )}

      <Section title="Quick facts">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} /><div><p className="text-xs font-extrabold uppercase text-[#888780]">Route</p><p className="font-extrabold">{ship.route}</p></div></div>
          <div className="flex items-start gap-3"><Users className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} /><div><p className="text-xs font-extrabold uppercase text-[#888780]">Capacity</p><p className="font-extrabold">{ship.capacity || 'Confirm with operator'}</p></div></div>
          <div className="flex items-start gap-3"><Clock className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} /><div><p className="text-xs font-extrabold uppercase text-[#888780]">Journey</p><p className="font-extrabold">{ship.journeyDuration || 'Confirm latest'}</p></div></div>
          <div className="flex items-start gap-3"><Waves className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} /><div><p className="text-xs font-extrabold uppercase text-[#888780]">Operator</p><p className="font-extrabold">{ship.operator}</p></div></div>
          <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} /><div><p className="text-xs font-extrabold uppercase text-[#888780]">Status</p><p className="font-extrabold">{availabilityLabel}</p></div></div>
          <div className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-[#1d9e75]" size={18} /><div><p className="text-xs font-extrabold uppercase text-[#888780]">Departure jetty</p><p className="font-extrabold">{ship.jetty || 'BIWTA Nuniachhara Jetty, Cox\'s Bazar'}</p></div></div>
        </div>
      </Section>

      <Section title="Ticket classes & prices">
        <div className="overflow-x-auto rounded-xl border border-[#d4e6e2]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1b2a]/[4%]">
              <tr><th className="px-4 py-3 font-bold">Class</th><th className="px-4 py-3 font-bold text-right">One-way</th><th className="px-4 py-3 font-bold text-right">Round-trip</th></tr>
            </thead>
            <tbody>
              {ship.ticketClasses.map((cls) => (
                <tr key={cls.name} className="border-t border-[#e7f0ee]">
                  <td className="px-4 py-3"><strong>{cls.name}</strong>{cls.nameBn && <span className="text-[#628187]"> ({cls.nameBn})</span>}<p className="text-xs text-[#729298]">{cls.description}</p></td>
                  <td className="px-4 py-3 text-right font-extrabold">{cls.oneWayFare}</td>
                  <td className="px-4 py-3 text-right font-extrabold">{cls.roundTripFare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#67878c]"><strong>Last verified:</strong> {ship.lastVerified} · {ship.source}</p>
        <p className="mt-1 text-xs text-[#67878c]">Dining and inclusions depend on the selected package. Confirm before payment.</p>
      </Section>

      <Section title="Cabins">
        <div className="overflow-x-auto rounded-xl border border-[#d4e6e2]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1b2a]/[4%]">
              <tr><th className="px-4 py-3 font-bold">Cabin</th><th className="px-4 py-3 font-bold">Capacity</th><th className="px-4 py-3 font-bold">Details</th></tr>
            </thead>
            <tbody>
              {ship.cabins.map((cabin) => (
                <tr key={cabin.name} className="border-t border-[#e7f0ee]">
                  <td className="px-4 py-3 font-extrabold">{cabin.name}{cabin.nameBn && <span className="block text-sm font-semibold text-[#628187]">{cabin.nameBn}</span>}</td>
                  <td className="px-4 py-3">{cabin.capacity}</td>
                  <td className="px-4 py-3 text-[#628187]">{cabin.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Facilities">
        <ul className="grid gap-2 sm:grid-cols-2">
          {ship.facilities.map((facility) => (
            <li key={facility.name} className="flex items-center gap-2">
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${facility.available ? 'bg-[#1d9e75]' : 'bg-[#cbd5d2]'}`} />
              {facility.name}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Schedule & check-in">
        <div className="grid gap-3 sm:grid-cols-2">
          <div><p className="text-xs font-extrabold uppercase text-[#888780]">Departure</p><p className="font-extrabold">{ship.departure || 'Confirm latest schedule'}</p></div>
          <div><p className="text-xs font-extrabold uppercase text-[#888780]">Check-in</p><p className="font-extrabold">{ship.checkIn || '30 minutes before departure'}</p></div>
          <div><p className="text-xs font-extrabold uppercase text-[#888780]">Journey duration</p><p className="font-extrabold">{ship.journeyDuration || 'Approx. 2 hours'}</p></div>
          <div><p className="text-xs font-extrabold uppercase text-[#888780]">Cancellation</p><p className="font-extrabold">{ship.cancellation || 'Confirm before payment'}</p></div>
        </div>
      </Section>

      <Section title="Need current availability?">
        <p className="mb-4">Share your date and passenger count on WhatsApp. Our team will confirm the latest dining packages, fares and boarding time for {ship.name}.</p>
        <a href={`${whatsapp}Hello ShipTickets.bd, I want to check ${ship.name} ticket availability for my travel date.`} className="inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white">Check on WhatsApp</a>
      </Section>

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, productSchema(ship), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Saint Martin ships', url: '/saint-martin-ship' }, { name: ship.name }]), faqSchema(ship.faq)] }} />
    </SeoPage>
  )
}
