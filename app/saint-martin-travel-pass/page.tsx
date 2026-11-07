import Link from 'next/link'
import { BadgeCheck, CalendarDays, Globe, IdCard, ScanLine, Ship } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, FactBox, GuideHero, IconCards, KitSection, LinkGrid, StepRows, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { season } from '@/lib/ships'

const path = '/saint-martin-travel-pass'
const pageTitle = 'Saint Martin Travel Pass 2026-27 Guide'
const h1 = 'Saint Martin Travel Pass 2026–27: Included With Your Ticket'
const description = 'Saint Martin Travel Pass 2026-27: what it is, how to get it and how travelpass.gov.bd works. The QR-coded pass is included with ShipTickets.bd tickets.'
const portal = 'https://travelpass.gov.bd/'

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['saint martin travel pass', 'saintmartin travel pass', 'saint martin pass', 'travelpass gov bd', 'সেন্টমার্টিন ট্রাভেল পাস', 'saint martin qr ticket'],
})

const faqs: [string, string][] = [
  ['What is the Saint Martin Travel Pass?', 'It is the travel authorization used under government rules for visitors to Saint Martin’s Island, and it helps manage tourist numbers and protect the island’s environment.'],
  ['Is the Travel Pass included with a ShipTickets.bd ticket?', 'Yes. The QR-coded Travel Pass is included with every ship ticket booked through ShipTickets.bd. Passenger details must be accurate, because the pass is linked to the traveller.'],
  ['How do I get a Travel Pass?', 'If you book your ship ticket through ShipTickets.bd, the Travel Pass is included and you do not need to apply separately. If you book elsewhere, start with the official portal at travelpass.gov.bd and follow its current instructions.'],
  ['What is travelpass.gov.bd?', 'It is the government’s official Saint Martin Travel Pass portal. You do not need to apply there separately if you book your ship ticket through ShipTickets.bd.'],
  ['Do I need a QR-coded ticket?', 'Yes. Tickets booked through ShipTickets.bd come with the QR-coded Travel Pass. If you book elsewhere, use only a valid ticket issued through an authorized process, and verify the details before departure.'],
  ['Is the travel pass the same as a ship ticket?', 'No. The pass and the ship ticket serve different purposes under the applicable rules, but tickets booked through ShipTickets.bd include both.'],
  ['What is the environmental conservation fee for 2026–27?', 'An environmental conservation fee of ৳100 per tourist applies, and it is included with tickets booked through ShipTickets.bd.'],
  ['সেন্টমার্টিন ট্রাভেল পাস কীভাবে পাব?', 'ShipTickets.bd থেকে জাহাজের টিকেট কাটলে QR কোডযুক্ত ট্রাভেল পাস টিকেটের সঙ্গেই পাবেন, আলাদা করে আবেদন করতে হবে না। অন্য কোথাও টিকেট কাটলে সরকারি পোর্টাল travelpass.gov.bd-এর নির্দেশনা দেখুন।'],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Travel Pass' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">You don’t need to apply separately when you book with ShipTickets.bd.</strong> Every ship ticket includes the QR-coded Travel Pass and the ৳100 environmental conservation fee.</>}
      bangla="আমাদের কাছ থেকে টিকেট কাটলে ট্রাভেল পাস টিকেটের সঙ্গেই পাবেন, আলাদা আবেদন লাগবে না।"
      stats={[
        { label: 'Extra to pay', value: '৳0', note: 'with our tickets' },
        { label: 'Environmental fee', value: '৳100', note: 'already included' },
        { label: 'Format', value: 'QR code', note: 'with your ticket' },
        { label: 'Daily limit', value: '3,500', note: 'tourists a day' },
      ]}
      actions={<><a href="#get" className={primaryButton}>How to get it</a><a href={portal} target="_blank" rel="noopener noreferrer" className={secondaryButton}>travelpass.gov.bd</a></>}
      updated="6 November 2026"
    />
  )
}

export default function TravelPassPage() {
  return (
    <SeoPage eyebrow="Travel Pass · ট্রাভেল পাস" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="what" title="What is the Saint Martin Travel Pass?">
        <p className="t-body max-w-3xl text-prose">The Saint Martin Travel Pass is part of the system used to manage tourist visits to the island and protect its environment. Visitors follow the government’s pass and QR-coded ticket process, and the official portal is <a href={portal} target="_blank" rel="noopener noreferrer" className={inlineLink}>travelpass.gov.bd</a>. Requirements can change between seasons.</p>
      </KitSection>

      <KitSection id="get" title="How to get your Saint Martin Travel Pass">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-6">
            <h3 className="t-subtitle">Booking with ShipTickets.bd</h3>
            <p className="t-small mt-2 text-prose">The pass is included, with nothing separate to apply for. Send accurate passenger details when you book, and we confirm on WhatsApp. Collect your printed ticket from our Kawran Bazar office, or we can send it by courier.</p>
          </div>
          <div className="rounded-2xl border border-line-soft bg-white p-5 shadow-card md:p-6">
            <h3 className="t-subtitle">Booking elsewhere</h3>
            <ol className="t-small mt-2 grid list-decimal gap-1.5 pl-5 text-prose">
              <li>Visit the official portal, <a href={portal} target="_blank" rel="noopener noreferrer" className={inlineLink}>travelpass.gov.bd</a>.</li>
              <li>Check the travel dates, ship information and requirements.</li>
              <li>Follow its instructions to get your pass and QR-coded ticket.</li>
              <li>Review your details and any fee before you finish.</li>
              <li>Keep your ticket and QR code ready for the journey.</li>
            </ol>
            <p className="t-small mt-2 text-quiet">These are general steps. Follow what the official website shows.</p>
          </div>
        </div>
      </KitSection>

      <KitSection id="compare" title="Travel Pass vs ship ticket">
        <IconCards columns={2} items={[
          { icon: ScanLine, heading: 'Travel Pass', text: 'Records or authorizes your visit under the government’s travel rules.' },
          { icon: Ship, heading: 'Ship ticket', text: 'Confirms your seat or cabin on the ship. Our tickets include the QR-coded pass and the environmental fee.' },
        ]} />
        <p className="t-small mt-3 text-prose">If you book elsewhere, don’t assume a regular ticket meets every pass requirement. Check that your documents follow the current rules.</p>
      </KitSection>

      <KitSection id="season" title="Travel rules for the 2026–27 season">
        <FactBox facts={[
          ['Season', `${season.startDate} to ${season.endDate}`],
          ['Environmental fee', '৳100 per tourist, included with our tickets'],
          ['Overnight stays', 'Allowed, subject to travel rules'],
          ['Ships', 'Only ships authorized for the route'],
          ['Daily limit', 'Up to 3,500 tourists a day'],
          ['Departure point', 'BIWTA Nuniarchhara Jetty, Cox’s Bazar'],
        ]}>
          <p className="t-small mt-4 text-prose">See all <Link href="/saint-martin-travel-rules" className={inlineLink}>travel rules</Link> and the <Link href="/blog/saint-martin-overnight-stay-rules" className={inlineLink}>overnight stay rules</Link>.</p>
        </FactBox>
      </KitSection>

      <KitSection id="check" title="Check your pass before you travel">
        <IconCards columns={3} items={[
          { icon: IdCard, heading: 'Passenger details', text: 'The names on your ticket should match each traveller’s ID.' },
          { icon: BadgeCheck, heading: 'QR code', text: 'Make sure your printed ticket shows the QR code, and bring it to the jetty.' },
          { icon: CalendarDays, heading: 'Date and ship', text: 'Check your date, ship, boarding point and departure time.' },
          { icon: Globe, heading: 'Latest rules', text: 'Rules can change, so check the government portal before you leave.' },
        ]} />
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিন ট্রাভেল পাস কী ও কীভাবে পাবেন">
        <p>সেন্টমার্টিন ট্রাভেল পাস হলো দ্বীপে পর্যটকদের যাতায়াত নিয়ন্ত্রণ এবং পরিবেশ সংরক্ষণের জন্য ব্যবহৃত একটি ব্যবস্থা। সরকারি পোর্টালের ঠিকানা <a href={portal} target="_blank" rel="noopener noreferrer" className={inlineLink}>travelpass.gov.bd</a>।</p>
        <p>ShipTickets.bd থেকে কাটা প্রতিটি জাহাজের টিকেটের সঙ্গে QR কোডযুক্ত ট্রাভেল পাস ও ৳১০০ পরিবেশ ফি অন্তর্ভুক্ত, তাই আলাদা করে আবেদন করতে হবে না। টিকেট কাটার সময় যাত্রীর সঠিক তথ্য দিন, আর টিকেটের নাম পরিচয়পত্রের সঙ্গে মিলিয়ে নিন। বিস্তারিত দেখুন <Link href="/blog/saint-martin-travel-pass-guide" className={inlineLink}>ট্রাভেল পাস গাইডে</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Saint Martin Travel Pass questions" id="faq" />

      <KitSection title="More on the pass and your trip">
        <LinkGrid links={[
          ['/saint-martin-ship', 'Ships that include the pass'],
          ['/saint-martin-ship-ticket-price', 'Saint Martin ship ticket prices'],
          ['/saint-martin-travel-rules', 'Travel rules and restrictions'],
          ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin route'],
          ['/saint-martin-guide', 'Saint Martin travel guide'],
          ['/contact', 'Contact our support team'],
        ]} />
      </KitSection>

      <CtaBand title="Get your ticket with the Travel Pass included" text="Send your date and passenger count. We confirm your fare and availability before you pay." message="Hello ShipTickets.bd, I want a Saint Martin ship ticket with the Travel Pass included." eventLabel="travel_pass_cta" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Travel Pass', url: path }])] }} />
    </SeoPage>
  )
}
