import type { Metadata } from 'next'
import { BanglaSummary } from '@/components/bangla-summary'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, breadcrumbSchema, ProseSection } from '@/components/seo-page'
import { MessageCircle, PhoneCall, MapPin, ShieldCheck, Users, Clock, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about ShipTickets.bd — a Bangladesh-focused travel information and ticketing platform for Saint Martin ship tickets, a sister concern of Tripzic.',
  openGraph: { title: 'About ShipTickets.bd', description: 'Learn who we are, what we do and how we help with Saint Martin ship tickets.', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://www.shiptickets.bd/about' },
}

export default function AboutPage() {
  return <SeoPage eyebrow="About · আমাদের সম্পর্কে" title="About ShipTickets.bd" intro="ShipTickets.bd is a Bangladesh-focused travel information and ticketing platform built to make planning a trip to Saint Martin Island easier.">
    <BanglaSummary path="/about" />
    <Section title="What we do">
      <p>We help travelers find useful information about Saint Martin ship tickets, ticket prices, ship schedules, routes, departure points, travel requirements and other practical information they need before planning their journey.</p>
      <p>Instead of searching across different websites, social media pages and travel groups, ShipTickets.bd brings essential Saint Martin ship and travel information together in one place.</p>
      <ul className="mt-4 grid gap-3 md:grid-cols-2"><Bullet>Saint Martin ship ticket information</Bullet><Bullet>Ship and ferry ticket prices</Bullet><Bullet>Ship schedules and departure information</Bullet><Bullet>Routes to Saint Martin</Bullet><Bullet>Ship operators and available options</Bullet><Bullet>Saint Martin travel guides</Bullet><Bullet>Ticket booking information</Bullet><Bullet>Frequently asked questions</Bullet></ul>
    </Section>

    <ProseSection title="Our mission">
      <p>Our mission is to become a trusted online destination for people searching for Saint Martin ship tickets and travel information. We continuously work to organize useful information in a clear format so travelers can spend less time searching and more time planning their trip.</p>
      <p className="mt-4">Our goal is to keep information simple, useful and easy to understand for Bangladeshi travelers. We focus on practical information rather than complicated travel jargon, helping travelers make informed decisions about their Saint Martin journey.</p>
    </ProseSection>

    <ProseSection title="A sister concern of Tripzic">
      <p>ShipTickets.bd is a sister concern of <a href="https://www.tripzic.com/" target="_blank" rel="noopener noreferrer" className="font-extrabold text-brand-ink hover:underline">Tripzic</a>, a Bangladesh-based travel technology platform focused on group trips, travel experiences and destination information.</p>
      <p className="mt-4">While Tripzic focuses on group travel and broader travel experiences, ShipTickets.bd has a dedicated focus on Saint Martin ship tickets and related travel information. Together, our goal is simple: make travel planning easier, clearer and more accessible for travelers from Bangladesh.</p>
    </ProseSection>

    <ProseSection title="Built for Saint Martin travelers">
      <p>Whether you are planning your first trip to Saint Martin or regularly travel to the island, ShipTickets.bd is designed to help you understand your options before you travel.</p>
      <div className="mt-4 flex items-start gap-3"><Heart className="mt-1 shrink-0 text-brand-ink" size={20} /><div><p className="font-extrabold">Saint Martin Ship Tickets & Travel Information</p><p className="text-sm text-prose">Plan your Saint Martin journey with better information.</p></div></div>
    </ProseSection>

    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'WebPage', name: 'About ShipTickets.bd', isPartOf: { '@id': 'https://www.shiptickets.bd/#website' } }, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About' }])] }} />
  </SeoPage>
}