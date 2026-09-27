import type { Metadata } from 'next'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, breadcrumbSchema } from '@/components/seo-page'
import { MessageCircle, PhoneCall, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '@/lib/ships'

export const metadata: Metadata = {
  title: 'Contact ShipTickets.bd',
  description: 'Contact ShipTickets.bd on WhatsApp or phone for Saint Martin ship ticket information, fare confirmation and booking support.',
  openGraph: { title: 'Contact ShipTickets.bd', description: 'Reach our support team on WhatsApp or phone for Saint Martin ship tickets.', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://www.shiptickets.bd/contact' },
}

export default function ContactPage() {
  const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
  return <SeoPage eyebrow="Contact · যোগাযোগ" title="Contact us" intro="Reach the ShipTickets.bd team on WhatsApp or phone. We help confirm ship availability, fares, schedules, cabins and Travel Pass requirements before you travel.">
    <Section title="Ways to reach us">
      <div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#d4e6e2] bg-white p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#1d9e75]"><MessageCircle size={22} /></div><h3 className="mt-3 font-extrabold">WhatsApp</h3><p className="mt-2 text-sm text-[#5f5e5a]">Fastest way to get fare and availability confirmation. Share your travel date, passenger count and preferred ship or class.</p><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I need help with Saint Martin ship tickets.')}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white"><MessageCircle size={17} /> Chat on WhatsApp</a></div><div className="rounded-2xl border border-[#d4e6e2] bg-white p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#1d9e75]"><PhoneCall size={22} /></div><h3 className="mt-3 font-extrabold">Phone</h3><p className="mt-2 text-sm text-[#5f5e5a]">Call us during support hours for ticket guidance and booking questions.</p><a href={phoneHref} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#cfe1df] bg-white px-5 py-3 text-sm font-extrabold text-[#0d1b2a]"><PhoneCall size={17} /> Call {PHONE_NUMBER}</a></div></div>
    </Section>

    <Section title="What to share when you contact us">
      <ul className="grid gap-3 md:grid-cols-2"><Bullet>Travel date and preferred departure date</Bullet><Bullet>Number of passengers</Bullet><Bullet>Preferred ship, seat class or cabin type</Bullet><Bullet>One-way or round-trip preference</Bullet><Bullet>Any Travel Pass or ID questions</Bullet></ul>
    </Section>

    <Section title="Support hours and booking note">
      <div className="grid gap-4 md:grid-cols-2"><div className="flex items-start gap-3"><Clock className="mt-1 shrink-0 text-[#1d9e75]" size={20} /><div><p className="font-extrabold">Support hours</p><p className="text-sm text-[#5f5e5a]">Available during the tourist season. Confirm current hours before calling.</p></div></div><div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-[#1d9e75]" size={20} /><div><p className="font-extrabold">Before payment</p><p className="text-sm text-[#5f5e5a]">Always confirm fare, availability, Travel Pass and cancellation terms with our team before sending payment.</p></div></div></div>
    </Section>

<Section title="Location">
      <div className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-[#1d9e75]" size={20} /><div><p className="font-extrabold">Service area</p><p className="text-sm text-[#5f5e5a]">ShipTickets.bd serves passengers traveling from Cox&apos;s Bazar to Saint Martin Island, Bangladesh. Our support team operates remotely and connects you with operator booking channels.</p></div></div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#d4e6e2]"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.897587746245!2d90.39001387511516!3d23.75103117866998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9c5182ad5f1%3A0x2192fb66214a585e!2sSaint%20Martin%20Ship%20Tickets!5e0!3m2!1sen!2sbd!4v1790530440820!5m2!1sen!2sbd" width="600" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="ShipTickets.bd on Google Maps" className="w-full min-h-[300px]" /></div>
    </Section>

    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'WebPage', name: 'Contact ShipTickets.bd', isPartOf: { '@id': 'https://www.shiptickets.bd/#website' } }, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact' }])] }} />
  </SeoPage>
}