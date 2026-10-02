import type { Metadata } from 'next'
import { BanglaSummary } from '@/components/bangla-summary'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, breadcrumbSchema, ProseSection } from '@/components/seo-page'
import { MessageCircle, PhoneCall, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { PHONE_NUMBER, WHATSAPP_NUMBER, site } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact ShipTickets.bd on WhatsApp or phone for Saint Martin ship ticket information, fare confirmation and booking support.',
  openGraph: { title: 'Contact ShipTickets.bd', description: 'Reach our support team on WhatsApp or phone for Saint Martin ship tickets.', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://www.shiptickets.bd/contact' },
}

export default function ContactPage() {
  const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
  return <SeoPage eyebrow="Contact · যোগাযোগ" title="Contact us" intro="Reach the ShipTickets.bd team on WhatsApp or phone. We help confirm ship availability, fares, schedules, cabins and Travel Pass requirements before you travel.">
    <BanglaSummary path="/contact" />
    <Section title="Ways to reach us">
      <div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-line-soft bg-white p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-brand-ink"><MessageCircle size={22} /></div><h3 className="mt-3 font-extrabold">WhatsApp</h3><p className="mt-2 text-sm text-prose">Fastest way to get fare and availability confirmation. Share your travel date, passenger count and preferred ship or class.</p><ContactLink href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I need help with Saint Martin ship tickets.')}`} target="_blank" rel="noopener noreferrer" kind="whatsapp" eventLabel="contact_page_whatsapp" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white"><MessageCircle size={17} /> Chat on WhatsApp</ContactLink></div><div className="rounded-2xl border border-line-soft bg-white p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-brand-ink"><PhoneCall size={22} /></div><h3 className="mt-3 font-extrabold">Phone</h3><p className="mt-2 text-sm text-prose">Call us during support hours for ticket guidance and booking questions.</p><ContactLink href={phoneHref} kind="phone" eventLabel="contact_page_call" className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-extrabold text-ink"><PhoneCall size={17} /> Call {PHONE_NUMBER}</ContactLink></div><div className="rounded-2xl border border-line-soft bg-white p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-brand-ink"><Mail size={22} /></div><h3 className="mt-3 font-extrabold">Email</h3><p className="mt-2 text-sm text-prose">Send your travel date and passenger count if you prefer a written reply or need a fare breakdown.</p><a href={`mailto:${site.email}`} className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-extrabold text-ink"><Mail size={17} /> {site.email}</a></div></div>
    </Section>

    <Section title="What to share when you contact us">
      <ul className="grid gap-3 md:grid-cols-2"><Bullet>Travel date and preferred departure date</Bullet><Bullet>Number of passengers</Bullet><Bullet>Preferred ship, seat class or cabin type</Bullet><Bullet>One-way or round-trip preference</Bullet><Bullet>Any Travel Pass or ID questions</Bullet></ul>
    </Section>

    <Section title="Support hours and booking note">
      <div className="grid gap-4 md:grid-cols-2"><div className="flex items-start gap-3"><Clock className="mt-1 shrink-0 text-brand-ink" size={20} /><div><p className="font-extrabold">Support hours</p><p className="text-sm text-prose">{site.supportHours}. WhatsApp messages are usually answered the same day within these hours.</p></div></div><div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-brand-ink" size={20} /><div><p className="font-extrabold">Before payment</p><p className="text-sm text-prose">Always confirm fare, availability, Travel Pass and cancellation terms with our team before sending payment.</p></div></div></div>
    </Section>

<ProseSection title="Location">
      <div className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-brand-ink" size={20} /><div><p className="font-extrabold">Office</p><p className="text-sm text-prose">{site.office}</p><p className="mt-3 text-sm text-prose">ShipTickets.bd serves passengers travelling from Cox&apos;s Bazar to Saint Martin Island, Bangladesh. Bookings are completed by our support team in line with the operator&apos;s booking channels.</p></div></div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line-soft"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.897587746245!2d90.39001387511516!3d23.75103117866998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9c5182ad5f1%3A0x2192fb66214a585e!2sSaint%20Martin%20Ship%20Tickets!5e0!3m2!1sen!2sbd!4v1790530440820!5m2!1sen!2sbd" width="600" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="ShipTickets.bd on Google Maps" className="w-full min-h-[300px]" /></div>
    </ProseSection>

    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'WebPage', name: 'Contact ShipTickets.bd', isPartOf: { '@id': 'https://www.shiptickets.bd/#website' } }, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact' }])] }} />
  </SeoPage>
}