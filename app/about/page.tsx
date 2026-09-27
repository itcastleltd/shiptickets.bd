import type { Metadata } from 'next'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, breadcrumbSchema } from '@/components/seo-page'
import { MessageCircle, PhoneCall, MapPin, ShieldCheck, Users, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About ShipTickets.bd',
  description: 'Learn about ShipTickets.bd — an authorized ship ticket information and human-assisted booking platform for Saint Martin Island, Bangladesh.',
  openGraph: { title: 'About ShipTickets.bd', description: 'Learn who we are, what we do and how we help with Saint Martin ship tickets.', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://www.shiptickets.bd/about' },
}

export default function AboutPage() {
  return <SeoPage eyebrow="About · আমাদের সম্পর্কে" title="About ShipTickets.bd" intro="ShipTickets.bd is an authorized ship ticket information and human-assisted booking platform for Saint Martin Island, Bangladesh. We compare ships, verify reference fares and connect travelers with real support before payment.">
    <Section title="What we do">
      <p>Saint Martin Island is a seasonal destination reached by passenger ship from Cox&#39;s Bazar. Operating status, fares, schedules and government rules change between seasons. ShipTickets.bd exists to make that information easier to find, compare and verify before you book.</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2"><Bullet>We compare ships, ticket classes, cabins and reference fares in one place.</Bullet><Bullet>We show clear operating status and last-verified dates on every page.</Bullet><Bullet>We do not invent schedules, prices or fake availability.</Bullet><Bullet>We connect you with a human support team on WhatsApp or phone before payment.</Bullet></ul>
    </Section>

    <Section title="How we work">
      <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-[#f7f6f2] p-5"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#1d9e75]"><ShieldCheck size={22} /></div><h3 className="mt-3 font-extrabold">Reference information only</h3><p className="mt-2 text-sm text-[#5f5e5a]">Fares and schedules are operator-published references, not live inventory or guaranteed prices.</p></div><div className="rounded-2xl bg-[#f7f6f2] p-5"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#1d9e75]"><Users size={22} /></div><h3 className="mt-3 font-extrabold">Human-assisted booking</h3><p className="mt-2 text-sm text-[#5f5e5a]">Final availability, fare and Travel Pass confirmation happens with a real support agent, not an automated engine.</p></div><div className="rounded-2xl bg-[#f7f6f2] p-5"><div className="flex size-11 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#1d9e75]"><Clock size={22} /></div><h3 className="mt-3 font-extrabold">Seasonal accuracy</h3><p className="mt-2 text-sm text-[#5f5e5a]">Every page shows a last-verified date and a clear status so you know what is current.</p></div></div>
    </Section>

    <Section title="Our principles">
      <ul className="grid gap-3"><Bullet>We do not publish fake live availability, reviews, ratings or booking counts.</Bullet><Bullet>We do not invent schedules or prices that have not been published by operators.</Bullet><Bullet>We make seasonal rules and Travel Pass requirements easy to find.</Bullet><Bullet>We encourage confirming current details with the operator before payment.</Bullet></ul>
    </Section>

    <Section title="Contact">
      <p>Have a question about a ship, fare, schedule or Travel Pass? Our team is available on WhatsApp and phone.</p>
      <div className="mt-4 flex flex-wrap gap-3"><a href="https://wa.me/8801718116799" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white"><MessageCircle size={17} /> WhatsApp</a><a href="tel:+8801718116799" className="inline-flex items-center gap-2 rounded-full border border-[#cfe1df] bg-white px-5 py-3 text-sm font-extrabold text-[#0d1b2a]"><PhoneCall size={17} /> Call</a></div>
    </Section>

    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'WebPage', name: 'About ShipTickets.bd', isPartOf: { '@id': 'https://www.shiptickets.bd/#website' } }, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About' }])] }} />
  </SeoPage>
}