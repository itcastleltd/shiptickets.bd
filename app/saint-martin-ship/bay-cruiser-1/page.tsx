import type { Metadata } from 'next'
import Image from 'next/image'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, breadcrumbSchema, productSchema, faqSchema, whatsapp } from '@/components/seo-page'
import { getShipBySlug } from '@/lib/ships'
import { Clock, MapPin, Users, Waves, CalendarDays } from 'lucide-react'

const ship = getShipBySlug('bay-cruiser-1')!

export const metadata: Metadata = {
  title: `${ship.name} Saint Martin Ship Tickets`,
  description: `Compare ${ship.name} ticket prices, classes and schedule for Cox's Bazar to Saint Martin. Last verified: ${ship.lastVerified}.`,
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-ship/bay-cruiser-1' },
  openGraph: {
    title: `${ship.name} Saint Martin Ship Tickets`,
    description: `Compare ${ship.name} ticket prices, classes and schedule for Cox's Bazar to Saint Martin. Last verified: ${ship.lastVerified}.`,
    images: ship.image ? [`https://www.shiptickets.bd${ship.image}`] : undefined,
  },
}

const availabilityLabel = { verified: 'Verified', needs_confirmation: 'Check latest', seasonal_confirmation: 'Seasonal confirmation' }[ship.status]

export default function BayCruiserPage() {
  return (
    <SeoPage
      eyebrow={`Ship guide · ${ship.name}`}
      title={`${ship.name} ship tickets and travel guide`}
      intro="Find practical information for checking MV Bay Cruiser 1 availability, ticket classes and Saint Martin travel requirements."
    >
      {ship.image && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl">
          <Image src={ship.image} alt={`${ship.name} passenger ship at jetty`} fill className="object-cover" />
        </div>
      )}

      <Section title="Quick Answer">
        <p><strong>How much is an MV Bay Cruiser 1 ticket?</strong> Indicative one-way fares start at <strong>{ship.oneWay}</strong> and round-trip from <strong>{ship.roundTrip}</strong>. Ticket prices vary by ship, seat category, travel date and whether the ticket is one-way or return. Confirm the latest fare for your date on WhatsApp.</p>
        <p className="mt-3"><strong>Where does MV Bay Cruiser 1 depart from?</strong> Passenger vessels serving Saint Martin Island operate from the BIWTA Nuniachhara jetty in Cox's Bazar. Verify the latest departure jetty and check-in time before your travel date.</p>
        <p className="mt-3"><strong>How long is the journey?</strong> The Cox's Bazar to Saint Martin sea crossing typically takes approximately {ship.journeyDuration || '2 hours'}. Sailing time depends on weather and sea conditions.</p>
        <p className="mt-3"><strong>Do I need a Travel Pass?</strong> Saint Martin tourist tickets require a Travel Pass and QR code during the applicable season. Check the latest government rules before travel.</p>
      </Section>

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
        <p className="mt-1 text-xs text-[#67878c]">Prices are reference values. Confirm current fares and availability on WhatsApp.</p>
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

      <Section title="Travel Pass & booking notes">
        <ul className="flex flex-col gap-3">
          <Bullet>MV Bay Cruiser 1 offers open deck, AC seats and cabin options — confirm availability for your date.</Bullet>
          <Bullet>Check the latest departure and reporting time before reaching the jetty.</Bullet>
          <Bullet>Review Travel Pass and identification requirements before boarding.</Bullet>
          <Bullet>A Travel Pass and QR-coded ticket are required for Saint Martin entry during the tourist season.</Bullet>
          <Bullet>Share your travel date on WhatsApp to confirm current service and ticket guidance.</Bullet>
        </ul>
      </Section>

      <Section title="Get the current answer">
        <p className="mb-4">Share your travel date and passenger count on WhatsApp. We will confirm current service, deck and air-conditioned seating availability for {ship.name}.</p>
        <ul className="flex flex-col gap-3">
          <Bullet>Check the latest departure and reporting time for your date.</Bullet>
          <Bullet>Confirm whether open deck, lounge or cabin seating is available.</Bullet>
          <Bullet>Review Travel Pass and identification requirements before reaching the jetty.</Bullet>
        </ul>
        <a href={`${whatsapp}Hello ShipTickets.bd, I want to check ${ship.name} ticket availability for my travel date.`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white">Check on WhatsApp</a>
      </Section>

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, productSchema(ship), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Saint Martin ships', url: '/saint-martin-ship' }, { name: ship.name }]), faqSchema(ship.faq)] }} />
    </SeoPage>
  )
}
