import type { Metadata } from 'next'
import { SeoPage, Section, Bullet, Pill, Schema, siteSchema } from '@/components/seo-page'

export const metadata: Metadata = {
  title: 'MV Karnafuly Express Ship Ticket | Fare, Cabin & Route Guide',
  description: 'Read the MV Karnafuly Express Saint Martin ship ticket guide: route, one-way and return fare guidance, seat classes, cabins, facilities and booking support.',
  alternates: { canonical: 'https://www.shiptickets.bd/mv-karnafuly-express/' },
}

export default function MVKarnafulyExpressPage() {
  const faqs: [string, string][] = [
    ['What route does MV Karnafuly Express serve?', 'MV Karnafuly Express is listed for the Cox’s Bazar to Saint Martin passenger route. Confirm the current departure port and sailing date before booking because seasonal operations can change.'],
    ['How much is an MV Karnafuly Express ticket?', 'The current one-way and return fare depends on the season, class and operator release. Share your travel date and passenger count on WhatsApp to verify the latest price.'],
    ['Does MV Karnafuly Express have cabins?', 'Cabin availability can include single, twin and VIP categories, subject to the sailing and operator inventory. Confirm cabin type, occupancy and included facilities before payment.'],
  ]

  return <SeoPage eyebrow="Ship detail · MV Karnafuly Express" title="MV Karnafuly Express ship ticket, fare & cabin guide" intro="Everything to compare before booking MV Karnafuly Express for a Saint Martin trip: route, ticket types, seating, cabins, facilities and seasonal booking checks.">
    <Section title="MV Karnafuly Express at a glance">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><p className="text-xs font-extrabold uppercase text-[#888780]">Route</p><p className="font-extrabold">Cox&apos;s Bazar → Saint Martin</p></div>
        <div><p className="text-xs font-extrabold uppercase text-[#888780]">Booking status</p><Pill>Check current availability</Pill></div>
        <div><p className="text-xs font-extrabold uppercase text-[#888780]">Ticket types</p><p className="font-extrabold">One-way and return tickets</p></div>
        <div><p className="text-xs font-extrabold uppercase text-[#888780]">Accommodation</p><p className="font-extrabold">Seat, lounge and cabin categories</p></div>
      </div>
    </Section>

    <Section title="Ticket price and booking information">
      <p>MV Karnafuly Express fares are seasonal and may vary by seat class, cabin category, passenger type and travel date. We do not publish an outdated fare as a booking promise.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#e1f5ee] p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-[#0f6e56]">One-way ticket</p><p className="mt-2 text-2xl font-extrabold text-[#0d1b2a]">Starting fare to be confirmed</p><p className="mt-2 text-sm text-[#5f5e5a]">Ask with your travel date and class preference.</p></div>
        <div className="rounded-2xl bg-[#fff3d6] p-5"><p className="text-xs font-extrabold uppercase tracking-wide text-[#9b6400]">Return ticket</p><p className="mt-2 text-2xl font-extrabold text-[#0d1b2a]">Round-trip fare to be confirmed</p><p className="mt-2 text-sm text-[#5f5e5a]">Return sailing and validity must be checked together.</p></div>
      </div>
    </Section>

    <Section title="Seats, cabins and facilities">
      <ul className="grid gap-3 md:grid-cols-2"><Bullet>Open deck and indoor seating options</Bullet><Bullet>Premium lounge categories may be available</Bullet><Bullet>Single, twin and VIP cabin options may vary by sailing</Bullet><Bullet>Restaurant or onboard food service access to confirm</Bullet><Bullet>Washrooms and passenger facilities onboard</Bullet><Bullet>Boarding time, check-in point and baggage rules to verify</Bullet></ul>
    </Section>

    <Section title="How to check availability and book">
      <ol className="grid gap-3 text-[#5f5e5a] md:grid-cols-3"><li className="rounded-2xl bg-[#f7f6f2] p-4"><strong className="block text-[#0d1b2a]">1. Share your date</strong>Tell us your travel date, passengers and preferred ticket type.</li><li className="rounded-2xl bg-[#f7f6f2] p-4"><strong className="block text-[#0d1b2a]">2. Compare options</strong>We help you check the latest fare, class, cabin and sailing details.</li><li className="rounded-2xl bg-[#f7f6f2] p-4"><strong className="block text-[#0d1b2a]">3. Book on WhatsApp</strong>Confirm the final details before making payment.</li></ol>
    </Section>

    <Section title="Frequently asked questions">
      <div className="flex flex-col gap-5">{faqs.map(([question, answer]) => <div key={question}><h3 className="font-extrabold text-[#0d1b2a]">{question}</h3><p>{answer}</p></div>)}</div>
    </Section>

    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, { '@type': 'Product', name: 'MV Karnafuly Express Saint Martin ship ticket', description: 'Passenger ship ticket information for MV Karnafuly Express between Cox’s Bazar and Saint Martin.', brand: { '@type': 'Brand', name: 'MV Karnafuly Express' }, offers: { '@type': 'Offer', priceCurrency: 'BDT', availability: 'https://schema.org/LimitedAvailability', url: 'https://www.shiptickets.bd/mv-karnafuly-express/' } }, { '@type': 'FAQPage', mainEntity: faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) }] }} />
  </SeoPage>
}

