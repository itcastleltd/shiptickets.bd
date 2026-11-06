import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, FactBox, GuideHero, KitSection, LinkGrid, StepRows, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { RelatedGuides } from '@/components/related-guides'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { BEST_FOR } from '@/components/ship-list-card'
import { season, ships } from '@/lib/ships'

const path = '/saint-martin-guide'
const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const byFare = [...ships].sort((a, b) => amount(a.oneWay) - amount(b.oneWay))
const cheapest = byFare[0]

const pageTitle = 'Saint Martin Travel Guide 2026-27'
const h1 = 'Saint Martin Travel Guide for Ship Passengers'
const description = 'A practical Saint Martin Island travel guide for 2026-27: choosing a ship, tickets, schedule, Travel Pass, the Cox’s Bazar jetty and trip preparation.'

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['saint martin travel guide', 'saint martin island guide', 'how to plan saint martin trip', 'সেন্টমার্টিন ভ্রমণ গাইড'],
})

const planSteps = [
  { name: 'Check the season', text: `Tourists can visit from ${season.startDate} to ${season.endDate}, including overnight stays.` },
  { name: 'Choose your ship', text: 'Compare the five ships, their seats, cabins and fares.' },
  { name: 'Compare ticket class and fare', text: 'Review one-way and round-trip fares for seats, lounges and cabins.' },
  { name: 'Sort your Travel Pass', text: 'The QR-coded pass comes with tickets booked through ShipTickets.bd.' },
  { name: 'Confirm jetty and time', text: 'Ships leave from the BIWTA Nuniarchhara Jetty. Arrive at least 1 hour before departure.' },
  { name: 'Keep your ticket ready', text: 'Save your ticket and QR code on your phone, and carry your ID.' },
]

const faqs: [string, string][] = [
  ['How do I plan a Saint Martin ship trip?', 'Check the season dates, choose a ship, compare ticket class and fare, sort your Travel Pass, confirm the jetty and departure time, then keep your ticket details ready for check-in.'],
  ['Which jetty departs to Saint Martin from Cox’s Bazar?', 'Tourist ships depart from the BIWTA Nuniarchhara Jetty in Cox’s Bazar. Follow the boarding point printed on your ticket.'],
  ['Do I need a Travel Pass for Saint Martin?', 'Yes, a Travel Pass and QR-coded ticket are required under current government rules. Every ship ticket booked through ShipTickets.bd includes the QR-coded Travel Pass, so you do not need to apply for it separately.'],
  ['How long is the ship journey to Saint Martin?', 'The Cox’s Bazar to Saint Martin crossing covers about 120 km and takes about 6 to 7 hours. Sailing time varies with weather and sea conditions.'],
  ['Can I visit Saint Martin in one day?', 'It depends on the sailing. Many dates leave only a short time on the island before the return ship, so check the ship schedule. Overnight stays are allowed this season.'],
  ['সেন্টমার্টিন ভ্রমণের পরিকল্পনা কীভাবে করব?', 'আগে মৌসুমের তারিখ দেখে নিন, তারপর জাহাজ ও টিকেটের ধরন বাছাই করুন। ছাড়ার সময় ও জেটি জেনে নিন, আর টিকেট ও পরিচয়পত্র সঙ্গে রাখুন। আমাদের টিকেটের সঙ্গে ট্রাভেল পাস থাকে।'],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Travel guide' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">Plan your Saint Martin trip in six steps, from the season dates to boarding your ship.</strong> Ships leave from Cox’s Bazar, cross in about 6 to 7 hours and start from {cheapest.oneWay} one way.</>}
      bangla="সেন্টমার্টিন ভ্রমণের পরিকল্পনা, ছয়টি সহজ ধাপে।"
      stats={[
        { label: 'Season', value: 'Nov–Mar', note: '1 Nov 2026 to 15 Mar 2027' },
        { label: 'Ships', value: String(ships.length), note: 'from Cox’s Bazar' },
        { label: 'Journey', value: '6–7 hrs', note: 'about 120 km' },
        { label: 'One way from', value: cheapest.oneWay, note: cheapest.name },
      ]}
      actions={<><a href="#plan" className={primaryButton}>Start planning</a><Link href="/saint-martin-ship" className={secondaryButton}>Compare ships</Link></>}
      updated="6 November 2026"
    />
  )
}

export default function GuidePage() {
  return (
    <SeoPage eyebrow="Travel guide · ভ্রমণ গাইড" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="plan" title="How to plan a Saint Martin trip">
        <StepRows columns={3} steps={planSteps.map((step) => ({ heading: step.name, text: step.text }))} />
      </KitSection>

      <KitSection id="ships" title="Ships for the 2026–27 season" intro="Compare fares, seats and cabins on each ship.">
        <ul className="grid gap-2 md:grid-cols-2">
          {ships.map((ship) => (
            <li key={ship.slug}>
              <Link href={`/saint-martin-ship/${ship.slug}`} className="group flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card transition duration-200 hover:border-brand-ink">
                <span className="min-w-0">
                  <span className="block font-extrabold text-ink">{ship.name}</span>
                  <span className="t-small block text-prose">{BEST_FOR[ship.slug]?.en}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 font-extrabold tabular-nums text-brand-ink">{ship.oneWay} <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </KitSection>

      <KitSection id="facts" title="Saint Martin trip facts for 2026–27">
        <FactBox facts={[
          ['Season', `${season.startDate} to ${season.endDate}`],
          ['Departure point', 'BIWTA Nuniarchhara Jetty, Cox’s Bazar'],
          ['Daily limit', 'Up to 3,500 tourists a day'],
          ['Overnight stays', 'Allowed this season'],
          ['Travel Pass', 'Included with our tickets'],
          ['Sailing from Teknaf', 'Not permitted for tourists'],
        ]}>
          <p className="t-small mt-4 text-prose">Read the full <Link href="/saint-martin-travel-rules" className={inlineLink}>travel rules</Link>, and budget for your <Link href="/saint-martin-trip-cost" className={inlineLink}>trip cost</Link>.</p>
        </FactBox>
      </KitSection>

      <KitSection id="next" title="Guides for each step">
        <LinkGrid links={[
          ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin route'],
          ['/saint-martin-ship-schedule', 'Ship schedule and return times'],
          ['/saint-martin-ship-ticket-price', 'Ticket prices'],
          ['/saint-martin-travel-pass', 'Travel Pass and QR ticket'],
          ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ticket'],
          ['/blog/dhaka-to-saint-martin-travel-guide', 'Dhaka to Saint Martin'],
          ['/blog/best-ship-to-saint-martin', 'Which ship is best for you'],
          ['/blog/coxs-bazar-saint-martin-distance', 'Distance and time, in Bangla'],
        ]} />
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিন ভ্রমণ গাইড ২০২৬-২৭">
        <p>যাওয়ার আগে কয়েকটি বিষয় গুছিয়ে নিন: মৌসুমের তারিখ দেখুন, জাহাজ ও টিকেটের ধরন বাছাই করুন, ছাড়ার সময় ও জেটি জেনে নিন। জাহাজ ছাড়ে কক্সবাজারের নুনিয়ারছড়া জেটি থেকে, আর যাত্রায় প্রায় ৬ থেকে ৭ ঘণ্টা লাগে।</p>
        <p>আমাদের টিকেটের সঙ্গে ট্রাভেল পাস থাকে। বোর্ডিংয়ের সময় দেখানোর জন্য টিকেট ফোনে রেখে দিন, আর পরিচয়পত্র সঙ্গে রাখুন। আরও পড়ুন <Link href="/blog" className={inlineLink}>আমাদের ব্লগে</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Saint Martin trip planning questions" id="faq" />

      <RelatedGuides title="Destination guides from Tripzic" intro="Editorial guides on Saint Martin and Bangladesh from Tripzic, which operates ShipTickets.bd. They cover where to go and what to plan, not ticket availability." />

      <CtaBand title="Ready to book your ship?" text="Send your date and passenger count, and we’ll suggest what is available." message="Hello ShipTickets.bd, I am planning a Saint Martin trip and need a ship ticket." eventLabel="guide_cta" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'HowTo', name: 'Plan a Saint Martin ship trip', description, step: planSteps.map((step) => ({ '@type': 'HowToStep', name: step.name, text: step.text })) }, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Travel guide', url: path }])] }} />
    </SeoPage>
  )
}
