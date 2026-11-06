import Link from 'next/link'
import { Anchor, CloudSun, Waves } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, GuideHero, IconCards, KitSection, LinkGrid, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { season } from '@/lib/ships'

const path = '/routes/coxs-bazar-to-saint-martin-distance'
const pageTitle = 'Cox’s Bazar to Saint Martin Distance: 120 km, 6-7 Hours'
const h1 = 'How Far Is Saint Martin from Cox’s Bazar? About 120 km by Sea'
const description = 'Cox’s Bazar to Saint Martin is about 120 km by sea, or roughly 6 to 7 hours by ship. See the route, boarding jetty and how the journey works for 2026-27.'

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['cox’s bazar to saint martin distance', 'cox’s bazar to saint martin distance time', 'cox’s bazar to saint martin distance time by ship', 'কক্সবাজার থেকে সেন্টমার্টিন দূরত্ব'],
})

const faqs: [string, string][] = [
  ['How far is Saint Martin from Cox’s Bazar?', 'Saint Martin’s Island is about 120 km from Cox’s Bazar, which is roughly 65 nautical miles.'],
  ['How long does the ship take from Cox’s Bazar to Saint Martin?', 'The ship takes about 6 to 7 hours from Cox’s Bazar to Saint Martin. The time depends on the ship, weather, sea conditions and tide.'],
  ['Can I go to Saint Martin by road?', 'No. Saint Martin is an island, so the only way to reach it is by water. Tourist ships for 2026–27 leave from the BIWTA Nuniarchhara Jetty in Cox’s Bazar.'],
  ['How far is Saint Martin from Teknaf?', 'Saint Martin is about 9 km south of the tip of the Cox’s Bazar-Teknaf peninsula. Tourists are not permitted to travel by water from Teknaf in the 2026–27 season.'],
  ['What time will I reach Saint Martin?', 'Add 6 to 7 hours to your departure time. A 7:00 AM sailing reaches the island at about 1:00 to 2:00 PM, though weather and sea conditions can change this.'],
  ['কক্সবাজার থেকে সেন্টমার্টিনের দূরত্ব কত?', 'কক্সবাজার থেকে সেন্টমার্টিন দ্বীপের দূরত্ব প্রায় ১২০ কিলোমিটার, আর জাহাজে সময় লাগে প্রায় ৬ থেকে ৭ ঘণ্টা।'],
]

const sourceLink = 'font-bold text-brand-ink underline underline-offset-2'

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Cox’s Bazar route', href: '/routes/coxs-bazar-to-saint-martin' }, { name: 'Distance' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">Saint Martin’s Island is about 120 km from Cox’s Bazar, and the ship takes about 6 to 7 hours.</strong> You can only reach the island by water.</>}
      bangla="কক্সবাজার থেকে সেন্টমার্টিনের দূরত্ব প্রায় ১২০ কিলোমিটার, জাহাজে লাগে প্রায় ৬ থেকে ৭ ঘণ্টা।"
      stats={[
        { label: 'Distance', value: '120 km', note: 'about, by sea' },
        { label: 'Nautical miles', value: '65', note: 'roughly, converted' },
        { label: 'Time by ship', value: '6–7 hrs', note: 'each way' },
        { label: 'By road', value: 'No', note: 'water only' },
      ]}
      actions={<><Link href="/saint-martin-ship-schedule" className={primaryButton}>See sailing times</Link><Link href="/saint-martin-ship-ticket-price" className={secondaryButton}>Ticket prices</Link></>}
      updated="6 November 2026"
    />
  )
}

export default function DistancePage() {
  return (
    <SeoPage eyebrow="Distance · দূরত্ব" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="glance" title="The route at a glance">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Cox’s Bazar to Saint Martin route details</caption>
            <tbody>
              {[
                ['Distance', 'About 120 km'],
                ['In nautical miles', 'Roughly 65 (converted from 120 km)'],
                ['Time by ship', 'About 6 to 7 hours'],
                ['Boarding point', 'BIWTA Nuniarchhara Jetty, Cox’s Bazar'],
                ['Arrival point', 'Saint Martin jetty'],
                ['2026–27 tourist season', `${season.startDate} to ${season.endDate}`],
              ].map(([term, value], index) => (
                <tr key={term} className={index ? 'border-t border-line-soft' : undefined}>
                  <th scope="row" className="w-2/5 px-3 py-3.5 font-extrabold text-ink sm:px-4">{term}</th>
                  <td className="px-3 py-3.5 text-prose sm:px-4">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-quiet">Sources: <a className={sourceLink} href="https://en.prothomalo.com/bangladesh/hywpe0a9qj" target="_blank" rel="noopener noreferrer">Prothom Alo</a> (120 km, 6 to 7 hours) and <a className={sourceLink} href="https://en.wikipedia.org/wiki/St._Martin%27s_Island" target="_blank" rel="noopener noreferrer">Wikipedia</a> (120 km). Actual sailing distance can vary with the route taken.</p>
      </KitSection>

      <KitSection id="arrival" title="What time will you reach Saint Martin?" intro="Our estimates, adding 6 to 7 hours to the departure time. Weather and sea conditions can change them.">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Estimated arrival times at Saint Martin by departure time</caption>
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Leaves Cox’s Bazar</th>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Reach the jetty by</th>
                <th scope="col" className="px-3 py-3 font-bold sm:px-4">Reach the island</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[
                ['4:00 AM', '3:00 AM', '10:00–11:00 AM'],
                ['7:00 AM', '6:00 AM', '1:00–2:00 PM'],
                ['8:00 AM', '7:00 AM', '2:00–3:00 PM'],
                ['10:00 AM', '9:00 AM', '4:00–5:00 PM'],
              ].map(([leave, jetty, arrive]) => (
                <tr key={leave} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3.5 font-extrabold text-ink sm:px-4">{leave}</th>
                  <td className="px-3 py-3.5 text-prose sm:px-4">{jetty}</td>
                  <td className="px-3 py-3.5 text-prose sm:px-4">{arrive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-prose">Find the time for your date on the <Link href="/saint-martin-ship-schedule" className={inlineLink}>Saint Martin ship schedule</Link>.</p>
      </KitSection>

      <KitSection id="why" title="Why the journey takes 6 to 7 hours">
        <IconCards columns={3} items={[
          { icon: Anchor, heading: 'The ship', text: 'Sailing time varies from one ship to another.' },
          { icon: CloudSun, heading: 'Weather and sea', text: 'Rough sea or bad weather can slow a crossing.' },
          { icon: Waves, heading: 'Tide', text: 'Tide changes departure times from one date to the next.' },
        ]} />
      </KitSection>

      <KitSection id="teknaf" title="Is Saint Martin closer from Teknaf?">
        <p className="t-body max-w-3xl text-prose">Yes, on the map. The island lies about 9 km south of the tip of the Cox’s Bazar-Teknaf peninsula. However, tourists are not permitted to travel by water from Teknaf in the 2026–27 season. MV Teknaf is a ship’s name, and it sails from Cox’s Bazar. Read more about <Link href="/blog/teknaf-to-saint-martin-ship" className={inlineLink}>sailing from Teknaf</Link>.</p>
      </KitSection>

      <BanglaBox id="bangla" title="কক্সবাজার থেকে সেন্টমার্টিন দূরত্ব ও সময়">
        <p>কক্সবাজার থেকে সেন্টমার্টিন দ্বীপের দূরত্ব প্রায় ১২০ কিলোমিটার, আর জাহাজে সময় লাগে প্রায় ৬ থেকে ৭ ঘণ্টা। দ্বীপটিতে শুধু জলপথেই যাওয়া যায়। ২০২৬–২৭ মৌসুমে পর্যটকবাহী জাহাজ কক্সবাজারের বিআইডব্লিউটিএ নুনিয়ারছড়া জেটি থেকে ছাড়ে।</p>
        <p>আরও জানতে পড়ুন <Link href="/blog/coxs-bazar-saint-martin-distance" className={inlineLink}>দূরত্ব ও সময় নিয়ে আমাদের লেখা</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Cox’s Bazar to Saint Martin distance questions" id="faq" />

      <KitSection title="More about this crossing">
        <LinkGrid links={[
          ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin ship guide'],
          ['/saint-martin-ship-schedule', 'Ship schedule'],
          ['/saint-martin-ship-ticket-price', 'Every fare on all five ships'],
          ['/saint-martin-trip-cost', 'Plan your full budget'],
        ]} />
      </KitSection>

      <CtaBand title="Ready to book your crossing?" text="Send your date and passenger count, and we’ll confirm the fare before you pay." message="Hello ShipTickets.bd, I want a Saint Martin ship ticket for my travel date." eventLabel="distance_cta" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Cox’s Bazar route', url: '/routes/coxs-bazar-to-saint-martin' }, { name: 'Distance', url: path }])] }} />
    </SeoPage>
  )
}
