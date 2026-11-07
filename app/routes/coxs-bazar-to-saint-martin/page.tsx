import Link from 'next/link'
import { Backpack, Droplets, FileCheck, Phone as PhoneIcon } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, FactBox, GuideHero, IconCards, KitSection, LinkGrid, StepRows, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { BEST_FOR } from '@/components/ship-list-card'
import { DATED_SCHEDULE_PERIOD } from '@/content/ship-schedules'
import { season, ships } from '@/lib/ships'

const path = '/routes/coxs-bazar-to-saint-martin'
const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const byFare = [...ships].sort((a, b) => amount(a.oneWay) - amount(b.oneWay))
const cheapest = byFare[0]

const pageTitle = 'Cox’s Bazar to Saint Martin Ship: Fare, Jetty & Time'
const h1 = 'Cox’s Bazar to Saint Martin Ship: Route, Fare & Jetty'
const description = `Cox’s Bazar to Saint Martin ship guide for 2026-27: fares from ${cheapest.oneWay}, Nuniarchhara Jetty, sailing times, Travel Pass and how to book your ticket.`

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['cox’s bazar to saint martin ship', 'cox’s bazar to saint martin ship ticket', 'cox’s bazar to saint martin ship ticket price', 'saint martin ship jetty', 'nuniarchhara jetty', 'কক্সবাজার থেকে সেন্টমার্টিন জাহাজ'],
})

const faqs: [string, string][] = [
  ['How much is a ship ticket from Cox’s Bazar to Saint Martin?', `Published fares start at ${cheapest.oneWay} one way and ${cheapest.roundTrip} round trip per person on ${cheapest.name}. The fare depends on the ship and seat class, so confirm yours before you pay.`],
  ['Where is the Saint Martin ship jetty in Cox’s Bazar?', 'Tourist ships leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar. Follow the boarding point printed on your ticket.'],
  ['What time does the ship leave Cox’s Bazar?', 'Ships leave in the morning. The dated times for MV Teknaf, MV Karnafuly Express and MV Baro Awlia change with the tide. See the Saint Martin ship schedule for your date.'],
  ['How many hours does the ship journey take?', 'Allow about 6 to 7 hours each way. The actual time depends on the ship, weather and sea conditions.'],
  ['Is a round-trip ticket available?', 'Yes. Round-trip fares are published for every ship. Confirm your return date and sailing when you book.'],
  ['Is Saint Martin open to tourists in 2026–27?', `Yes. The season runs from ${season.startDate} to ${season.endDate}, and tourist ships began sailing on 5 November 2026.`],
  ['Is there an additional environmental fee?', 'A ৳100 environmental conservation fee applies per tourist. It is included with tickets booked through ShipTickets.bd.'],
  ['Can I travel from Teknaf instead?', 'No. For the 2026–27 season, tourists are not permitted to travel by water from Teknaf. Ships leave from Cox’s Bazar. MV Teknaf is only the name of a ship.'],
  ['Can I stay overnight on Saint Martin?', 'Yes. Overnight stays are allowed in the 2026–27 season, subject to the applicable travel rules.'],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Cox’s Bazar to Saint Martin' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">Tourist ships to Saint Martin leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar.</strong> The <Link href="/routes/coxs-bazar-to-saint-martin-distance" className={inlineLink}>crossing is about 120 km</Link> and takes about 6 to 7 hours, with fares from {cheapest.oneWay} one way per person.</>}
      bangla="কক্সবাজার থেকে সেন্টমার্টিন: জেটি, ভাড়া, সময় ও টিকেট, এক পাতায়।"
      stats={[
        { label: 'One way from', value: cheapest.oneWay, note: cheapest.name },
        { label: 'Journey time', value: '6–7 hrs', note: 'each way' },
        { label: 'Distance', value: '120 km', note: 'about, by sea' },
        { label: 'Reach the jetty', value: '1 hour', note: 'before departure' },
      ]}
      actions={<><a href="#fares" className={primaryButton}>See fares</a><Link href="/saint-martin-ship-schedule" className={secondaryButton}>Sailing times</Link></>}
      updated="7 November 2026"
    />
  )
}

export default function RoutePage() {
  return (
    <SeoPage eyebrow="Route guide · রুট" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-07" updated="7 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="steps" title="How to reach Saint Martin from Cox’s Bazar">
        <StepRows steps={[
          { heading: 'Reach Cox’s Bazar', text: <>Arrive by bus, train or air, ideally the day before an early sailing. See the <Link href="/blog/dhaka-to-saint-martin-travel-guide" className={inlineLink}>Dhaka to Saint Martin guide</Link>.</> },
          { heading: 'Go to Nuniarchhara Jetty', text: <>Be at the <a href="https://biwta.gov.bd/" target="_blank" rel="noopener noreferrer" className={inlineLink}>BIWTA</a> jetty at least 1 hour before departure.</> },
          { heading: 'Board your ship', text: 'Keep your ticket and ID ready. Your QR-coded Travel Pass comes with your ticket.' },
          { heading: 'Sail for 6 to 7 hours', text: <>You arrive at Saint Martin’s Island the same day. Read more about the <Link href="/routes/coxs-bazar-to-saint-martin-distance" className={inlineLink}>distance and journey time</Link>.</> },
        ]} />
      </KitSection>

      <KitSection id="fares" title="Cox’s Bazar to Saint Martin ship ticket price" intro="Lowest published fare per person. Confirm the fare for your date before you pay.">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lowest one-way and round-trip fares from Cox’s Bazar to Saint Martin on all five ships, in Bangladeshi taka</caption>
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Ship</th>
                <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">One way</th>
                <th scope="col" className="px-3 py-3 text-right font-bold sm:px-4">Round trip</th>
                <th scope="col" className="hidden px-4 py-3 font-bold md:table-cell">Best for</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3.5 font-extrabold text-ink sm:px-4"><Link href={`/saint-martin-ship/${ship.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{ship.name}</Link></th>
                  <td className="px-3 py-3.5 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.oneWay}</td>
                  <td className="px-3 py-3.5 text-right font-extrabold tabular-nums text-brand-ink sm:px-4">{ship.roundTrip}</td>
                  <td className="hidden px-4 py-3.5 text-prose md:table-cell">{BEST_FOR[ship.slug]?.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-prose">See <Link href="/saint-martin-ship-ticket-price" className={inlineLink}>every seat and cabin fare</Link>, <Link href="/saint-martin-ship" className={inlineLink}>compare the ships</Link> or plan your <Link href="/saint-martin-trip-cost" className={inlineLink}>full trip cost</Link>.</p>
      </KitSection>

      <KitSection id="jetty" title="Where the Saint Martin ship leaves from">
        <FactBox facts={[
          ['Boarding point', 'BIWTA Nuniarchhara Jetty, Cox’s Bazar'],
          ['Sailing from Teknaf', 'Not permitted for tourists in 2026–27'],
          ['MV Teknaf', 'A ship’s name. It also sails from Cox’s Bazar'],
        ]}>
          <p className="t-small mt-4 text-prose">Read more on <Link href="/blog/teknaf-to-saint-martin-ship" className={inlineLink}>why you cannot sail from Teknaf</Link>. Always follow the boarding point printed on your ticket.</p>
        </FactBox>
      </KitSection>

      <KitSection id="times" title="Cox’s Bazar to Saint Martin ship time">
        <p className="t-body max-w-3xl text-prose">Ships leave in the morning. MV Teknaf, MV Karnafuly Express and MV Baro Awlia change with the tide, and {DATED_SCHEDULE_PERIOD} has times for every date. Schedules for <Link href="/saint-martin-ship/keari-sindbad" className={inlineLink}>Keari Sindbad</Link> and <Link href="/saint-martin-ship/keari-cruise-dine" className={inlineLink}>Keari Cruise &amp; Dine</Link> have not been published yet, so ask us for your date.</p>
        <Link href="/saint-martin-ship-schedule" className={`${secondaryButton} mt-4`}>See the full ship schedule</Link>
      </KitSection>

      <KitSection id="season" title="Saint Martin tourist season 2026–27">
        <FactBox facts={[
          ['Season', `${season.startDate} to ${season.endDate}`],
          ['Daily limit', 'Up to 3,500 tourists a day'],
          ['Overnight stays', 'Allowed this season'],
          ['Environmental fee', '৳100, included with our tickets'],
          ['Travel Pass', 'QR-coded, included with our tickets'],
          ['First tourist ship', '5 November 2026'],
        ]}>
          <p className="t-small mt-4 text-prose">See the <Link href="/saint-martin-travel-rules" className={inlineLink}>travel rules</Link> and <Link href="/saint-martin-travel-pass" className={inlineLink}>Travel Pass guide</Link>.</p>
        </FactBox>
      </KitSection>

      <KitSection id="carry" title="What to carry for the journey">
        <IconCards columns={3} items={[
          { icon: FileCheck, heading: 'Documents', text: 'Your ticket with QR code, plus your national ID or other identification.' },
          { icon: PhoneIcon, heading: 'Phone and power', text: 'Your phone with the ticket saved, a charger and a power bank.' },
          { icon: Droplets, heading: 'Sun and water', text: 'Drinking water, a cap, sunglasses, sunscreen and light clothing.' },
          { icon: Backpack, heading: 'Personal items', text: 'Any medication you need. Avoid prohibited single-use plastic items.' },
        ]} />
      </KitSection>

      <BanglaBox id="bangla" title="কক্সবাজার থেকে সেন্টমার্টিন জাহাজ: ভাড়া, জেটি ও সময়">
        <p>পর্যটকবাহী জাহাজ ছাড়ে কক্সবাজারের নুনিয়ারছড়া বিআইডব্লিউটিএ জেটি থেকে। দূরত্ব প্রায় ১২০ কিলোমিটার, আর যেতে সময় লাগে প্রায় ৬ থেকে ৭ ঘণ্টা। জাহাজ ছাড়ার অন্তত ১ ঘণ্টা আগে জেটিতে পৌঁছে যান।</p>
        <p>এই মৌসুমে পর্যটকেরা টেকনাফ থেকে জলপথে যেতে পারবেন না। এমভি টেকনাফ শুধু একটি জাহাজের নাম, সেটিও কক্সবাজার থেকেই ছাড়ে। পুরো ভাড়া দেখুন <Link href="/saint-martin-ship-ticket-price" className={inlineLink}>জাহাজের টিকিটের দাম</Link> পাতায়, আর সময় দেখুন <Link href="/saint-martin-ship-schedule" className={inlineLink}>জাহাজের সময়সূচিতে</Link>। দূরত্ব নিয়ে পড়ুন <Link href="/blog/coxs-bazar-saint-martin-distance" className={inlineLink}>দূরত্ব ও সময়ের লেখায়</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Cox’s Bazar to Saint Martin ship questions" id="faq" />

      <KitSection title="More for this route">
        <LinkGrid links={[
          ['/saint-martin-ship', 'Compare all Saint Martin ships'],
          ['/saint-martin-ship-schedule', 'Ship schedule and return times'],
          ['/saint-martin-travel-pass', 'Saint Martin Travel Pass'],
          ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ticket'],
          ['/saint-martin-cabin-price', 'Cabin and seat prices'],
          ['/saint-martin-guide', 'Saint Martin travel guide'],
        ]} />
      </KitSection>

      <CtaBand title="Book your Cox’s Bazar to Saint Martin ticket" text="Send your date and passenger count. We confirm the fare before you pay." message="Hello ShipTickets.bd, I want a Cox’s Bazar to Saint Martin ship ticket for my travel date." eventLabel="route_cta" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Cox’s Bazar to Saint Martin', url: path }])] }} />
    </SeoPage>
  )
}
