import Link from 'next/link'
import { Compass, Handshake, MessageCircle, Ship, Ticket, Users } from 'lucide-react'
import { BanglaBox, CtaBand, GuideHero, IconCards, KitSection, LinkGrid, inlineLink, pageMeta, pageUrl, phoneHref, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { PHONE_NUMBER, ships, site } from '@/lib/ships'

const lowestFare = `৳${Math.min(...ships.map((ship) => Number((ship.oneWay ?? '').replace(/[^0-9]/g, '')) || Infinity)).toLocaleString('en-US')}`

const path = '/about'
const pageTitle = 'About ShipTickets.bd: Saint Martin Ship Ticket Service'
const h1 = 'About ShipTickets.bd'
const description = 'Learn about ShipTickets.bd, a Bangladesh-focused travel information and ticketing platform for Saint Martin ship tickets, operated by Tripzic.'

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['shiptickets.bd', 'ship ticket bd', 'about shiptickets', 'saint martin ship ticket service'],
})

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'About' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">ShipTickets.bd helps travellers compare and book Saint Martin ship tickets.</strong> We bring fares, schedules and travel rules together in one place, with a real support team to confirm the details.</>}
      bangla="সেন্টমার্টিনের জাহাজের টিকেট ও ভ্রমণের তথ্য, এক জায়গায়।"
      stats={[
        { label: 'Tourists served', value: '9,000+', note: 'in 4 years' },
        { label: 'Ship partners', value: '5', note: 'corporate agreements' },
        { label: 'One way from', value: lowestFare, note: 'per person' },
        { label: 'Travel Pass', value: 'Included', note: 'with our tickets' },
      ]}
      actions={<><Link href="/saint-martin-ship" className={primaryButton}>Compare ships</Link><a href={phoneHref} className={secondaryButton}>Call {PHONE_NUMBER}</a></>}
      updated="6 November 2026"
    />
  )
}

export default function AboutPage() {
  return (
    <SeoPage eyebrow="About · আমাদের সম্পর্কে" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="what" title="What we do">
        <IconCards columns={3} items={[
          { icon: Ship, heading: 'Compare ships', text: <>Fares, seats, cabins and facilities on <Link href="/saint-martin-ship" className={inlineLink}>all five ships</Link>.</> },
          { icon: Ticket, heading: 'Help you book', text: <>Our team confirms your fare and availability. See <Link href="/blog/saint-martin-ship-ticket-booking-guide" className={inlineLink}>how booking works</Link>.</> },
          { icon: Compass, heading: 'Explain the trip', text: <><Link href="/saint-martin-ship-schedule" className={inlineLink}>Schedules</Link>, <Link href="/saint-martin-travel-rules" className={inlineLink}>travel rules</Link> and the <Link href="/saint-martin-travel-pass" className={inlineLink}>Travel Pass</Link>, in plain language.</> },
        ]} />
      </KitSection>

      <KitSection id="partners" title="Why travellers trust us">
        <IconCards columns={3} items={[
          { icon: Handshake, heading: 'Ship partners', text: 'ShipTickets.bd is an authorized platform with corporate agreements across the five ships listed on this site.' },
          { icon: Users, heading: 'Real experience', text: 'We have served 9,000+ tourists travelling to Saint Martin over 4 years.' },
          { icon: MessageCircle, heading: 'Real people', text: `Our support team answers on WhatsApp and phone, ${site.supportHours}.` },
        ]} />
        <p className="t-small mt-3 text-prose">Ship operators on this site: Karnafuly Cruise Line (MV Karnafuly Express and MV Baro Awlia), Parapaar Cruise Line PCL (MV Teknaf) and Keari Tours &amp; Services Ltd. (Keari Cruise &amp; Dine and Keari Sindbad). See <Link href="/how-we-verify-information" className={inlineLink}>how we verify ship information</Link>.</p>
      </KitSection>

      <KitSection id="mission" title="Our mission">
        <p className="t-body max-w-3xl text-prose">Instead of searching across different websites, social media pages and travel groups, you can find what you need here. We keep information simple, useful and easy to understand for Bangladeshi travellers, so you spend less time searching and more time planning your trip.</p>
      </KitSection>

      <KitSection id="tripzic" title="Operated by Tripzic">
        <div className="rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
          <p className="t-body text-prose">ShipTickets.bd is operated by <a href="https://www.tripzic.com/" target="_blank" rel="noopener noreferrer" className={inlineLink}>Tripzic</a>, a Bangladesh-based travel technology platform focused on group trips, travel experiences and destination information.</p>
          <p className="t-body mt-3 text-prose">While Tripzic focuses on group travel and broader experiences, ShipTickets.bd focuses on Saint Martin ship tickets and related travel information.</p>
        </div>
      </KitSection>

      <BanglaBox id="bangla" title="ShipTickets.bd সম্পর্কে">
        <p>ShipTickets.bd সেন্টমার্টিনগামী জাহাজের টিকেট ও ভ্রমণের তথ্যের একটি প্ল্যাটফর্ম। এখানে জাহাজের নাম, টিকেটের ভাড়া, সময়সূচি, সিট ও কেবিনের ধরন এবং ট্রাভেল পাস সম্পর্কে জানতে পারবেন।</p>
        <p>ShipTickets.bd পরিচালনা করে Tripzic, আর তালিকার পাঁচটি জাহাজের সঙ্গেই আমাদের করপোরেট চুক্তি আছে। সেন্টমার্টিন ভ্রমণের পরিকল্পনা সহজ করাই আমাদের লক্ষ্য।</p>
      </BanglaBox>

      <KitSection title="Where to go next">
        <LinkGrid links={[
          ['/saint-martin-ship-ticket-price', 'Saint Martin ship ticket prices'],
          ['/saint-martin-ship-schedule', 'Saint Martin ship schedule'],
          ['/saint-martin-guide', 'Saint Martin travel guide'],
          ['/how-we-verify-information', 'How we verify information'],
          ['/booking-policy', 'Booking policy'],
          ['/contact', 'Contact us'],
        ]} />
      </KitSection>

      <CtaBand title="Planning a Saint Martin trip?" text="Send your date and passenger count, and we’ll guide you from there." message="Hello ShipTickets.bd, I need help with Saint Martin ship tickets." eventLabel="about_cta" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'AboutPage', name: h1, url: pageUrl(path), about: { '@id': 'https://www.shiptickets.bd/#organization' } }, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About', url: path }])] }} />
    </SeoPage>
  )
}
