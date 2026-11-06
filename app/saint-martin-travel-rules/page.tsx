import Link from 'next/link'
import { Fish, Leaf, ScanLine, Ship, Trash2, Users } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, FactBox, GuideHero, IconCards, KitSection, LinkGrid, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { season } from '@/lib/ships'

const path = '/saint-martin-travel-rules'
const pageTitle = 'Saint Martin Travel Rules 2026-27'
const h1 = 'Saint Martin Travel Rules and Restrictions 2026–27'
const description = 'Saint Martin travel rules for 2026-27: season dates, 3,500 tourists a day, overnight stays, Travel Pass, the ৳100 fee and the Cox’s Bazar jetty.'

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['saint martin travel rules', 'saint martin rules 2026', 'saint martin open time 2026', 'saint martin overnight stay', 'সেন্টমার্টিন ভ্রমণ নিয়ম'],
})

const faqs: [string, string][] = [
  ['What are the Saint Martin travel rules?', `For 2026–27, tourists can visit from ${season.startDate} to ${season.endDate}, with up to 3,500 tourists a day. A Travel Pass and QR-coded ticket are required, a ৳100 environmental fee applies, and ships leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar.`],
  ['When is Saint Martin open for tourists?', `The 2026–27 tourist season runs from ${season.startDate} to ${season.endDate}. Tourist ships began sailing on 5 November 2026.`],
  ['What is the daily visitor limit for Saint Martin?', 'Up to 3,500 tourists a day can visit Saint Martin in the 2026–27 season.'],
  ['Can I stay overnight on Saint Martin Island?', 'Yes. Under the revised government guidelines, tourists can stay overnight during the 2026–27 season, subject to applicable travel restrictions.'],
  ['Can tourists go to Saint Martin from Teknaf?', 'No. Tourists are not permitted to travel by water from Teknaf in the 2026–27 season. Ships leave from Cox’s Bazar.'],
  ['Are there environmental restrictions on Saint Martin?', 'Yes. Plastic restrictions, coral protection rules and designated activity zones are enforced. Follow local authority instructions.'],
  ['সেন্টমার্টিনে এখন কি যাওয়া যাবে?', 'এই মৌসুমে ১ নভেম্বর ২০২৬ থেকে ১৫ মার্চ ২০২৭ পর্যন্ত পর্যটকেরা যেতে পারবেন, রাতেও থাকা যাবে। দিনে সর্বোচ্চ ৩,৫০০ পর্যটক যেতে পারেন, আর জাহাজ ছাড়ে কক্সবাজার থেকে।'],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Travel rules' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">Tourists can visit Saint Martin from {season.startDate} to {season.endDate}, including overnight stays.</strong> Up to 3,500 tourists can go each day, and you need a Travel Pass and QR-coded ticket.</>}
      bangla="১ নভেম্বর ২০২৬ থেকে ১৫ মার্চ ২০২৭ পর্যন্ত সেন্টমার্টিনে যাওয়া যাবে, রাতেও থাকা যাবে।"
      stats={[
        { label: 'Daily limit', value: '3,500', note: 'tourists a day' },
        { label: 'Season ends', value: '15 Mar', note: '2027' },
        { label: 'Overnight stays', value: 'Allowed', note: 'this season' },
        { label: 'Environmental fee', value: '৳100', note: 'per tourist' },
      ]}
      actions={<><a href="#glance" className={primaryButton}>See all rules</a><Link href="/saint-martin-travel-pass" className={secondaryButton}>Travel Pass</Link></>}
      updated="6 November 2026"
    />
  )
}

export default function RulesPage() {
  return (
    <SeoPage eyebrow="Rules · ভ্রমণ নির্দেশনা" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="glance" title="Saint Martin rules at a glance, 2026–27">
        <FactBox facts={[
          ['Tourist season', `${season.startDate} to ${season.endDate}`],
          ['Daily visitor limit', '3,500 tourists'],
          ['Environmental fee', '৳100 per visitor, included with our tickets'],
          ['Travel documents', 'Travel Pass and QR-coded ticket'],
          ['Overnight stays', 'Allowed, subject to applicable restrictions'],
          ['Departure point', 'BIWTA Nuniarchhara Jetty, Cox’s Bazar'],
        ]}>
          <p className="t-small mt-4 text-prose">Government rules can change, so check them before you travel. The <a href="https://moef.gov.bd/" target="_blank" rel="noopener noreferrer" className={inlineLink}>Ministry of Environment, Forest and Climate Change</a> sets the season’s rules, and the Travel Pass portal is <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className={inlineLink}>travelpass.gov.bd</a>.</p>
        </FactBox>
      </KitSection>

      <KitSection id="going" title="Rules for getting to the island">
        <IconCards columns={3} items={[
          { icon: ScanLine, heading: 'Travel Pass and QR ticket', text: <>Both are required. They come with every ticket booked through ShipTickets.bd. See the <Link href="/saint-martin-travel-pass" className={inlineLink}>Travel Pass guide</Link>.</> },
          { icon: Ship, heading: 'Approved ships only', text: <>Travel only on ships authorized for the route. <Link href="/saint-martin-ship" className={inlineLink}>Compare the five ships</Link> listed this season.</> },
          { icon: Users, heading: 'No sailing from Teknaf', text: <>Tourists cannot travel by water from Teknaf this season. <Link href="/blog/teknaf-to-saint-martin-ship" className={inlineLink}>Read why</Link>.</> },
        ]} />
      </KitSection>

      <KitSection id="responsibly" title="Rules on the island: travel responsibly" intro="Saint Martin is a sensitive marine environment. Follow local authority instructions.">
        <IconCards columns={3} items={[
          { icon: Trash2, heading: 'Plastic', text: 'Plastic restrictions are enforced. Avoid single-use plastic, and keep the beach and jetty clean.' },
          { icon: Fish, heading: 'Coral and wildlife', text: 'Coral protection rules are enforced. Do not damage coral or disturb wildlife.' },
          { icon: Leaf, heading: 'Activity zones', text: 'Designated activity zones apply, so check before you take part in an activity.' },
        ]} />
      </KitSection>

      <KitSection id="overnight" title="Can you stay overnight on Saint Martin?">
        <p className="t-body max-w-3xl text-prose">Yes. Under the revised government guidelines, overnight stays are allowed during the 2026–27 season, subject to applicable travel restrictions. Read our <Link href="/blog/saint-martin-overnight-stay-rules" className={inlineLink}>overnight stay guide</Link>, and see how much time you get on a same-day trip on the <Link href="/saint-martin-ship-schedule" className={inlineLink}>ship schedule</Link>.</p>
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিন ভ্রমণের নিয়ম ২০২৬-২৭">
        <p>এই মৌসুমে ১ নভেম্বর ২০২৬ থেকে ১৫ মার্চ ২০২৭ পর্যন্ত সেন্টমার্টিনে যাওয়া যাবে, রাতেও থাকা যাবে। দিনে সর্বোচ্চ ৩,৫০০ পর্যটক যেতে পারেন। ট্রাভেল পাস ও QR কোডযুক্ত টিকেট লাগবে, যা আমাদের টিকেটের সঙ্গেই থাকে।</p>
        <p>জাহাজ ছাড়ে কক্সবাজারের নুনিয়ারছড়া জেটি থেকে, টেকনাফ থেকে পর্যটকেরা জলপথে যেতে পারবেন না। দ্বীপে প্লাস্টিক ও প্রবাল রক্ষার নিয়ম মেনে চলুন। বিস্তারিত পড়ুন <Link href="/blog/saint-martin-travel-rules" className={inlineLink}>ভ্রমণ নিয়মের লেখায়</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Saint Martin travel rules questions" id="faq" />

      <KitSection title="More on planning your visit">
        <LinkGrid links={[
          ['/saint-martin-travel-pass', 'Saint Martin Travel Pass guide'],
          ['/saint-martin-ship-schedule', 'Saint Martin ship schedule'],
          ['/saint-martin-ship-ticket-price', 'Saint Martin ship ticket price'],
          ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin ship guide'],
          ['/saint-martin-guide', 'Saint Martin travel guide'],
          ['/saint-martin-trip-cost', 'Saint Martin trip cost'],
        ]} />
      </KitSection>

      <CtaBand title="Ready to plan your trip?" text="Send your date and passenger count, and we’ll help with the ticket and Travel Pass." message="Hello ShipTickets.bd, I want a Saint Martin ship ticket for my travel date." eventLabel="rules_cta" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Travel rules', url: path }])] }} />
    </SeoPage>
  )
}
