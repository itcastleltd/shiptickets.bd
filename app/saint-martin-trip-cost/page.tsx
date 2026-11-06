import Link from 'next/link'
import { BedDouble, Scale, Ticket, TrainFront, Users } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, GuideHero, IconCards, KitSection, LinkGrid, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { ships } from '@/lib/ships'

const path = '/saint-martin-trip-cost'
const amount = (fare: string) => Number(fare.replace(/[^0-9]/g, ''))
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const bangla = (value: string) => value.replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])

const shipRows = ships
  .map((ship) => {
    const fares = ship.ticketClasses.map((item) => amount(item.roundTripFare)).filter(Boolean)
    return { ship, low: Math.min(...fares), high: Math.max(...fares) }
  })

const lowest = Math.min(...shipRows.map((row) => row.low))
const lowestShip = shipRows.find((row) => row.low === lowest)?.ship.name
const highest = Math.max(...shipRows.map((row) => row.high))

/** Reported Dhaka to Cox's Bazar fares. These are dated reports, not current quotes. */
const TRAIN_SHOVON = 695
const exampleShip = lowest * 2
const exampleTrain = TRAIN_SHOVON * 4
const exampleTotal = exampleShip + exampleTrain

const pageTitle = 'Saint Martin Trip Cost 2026-27: Budget'
const h1 = 'How Much Does a Saint Martin Trip Cost? 2026–27 Budget'
const description = `Plan your Saint Martin trip budget for 2026-27: ship tickets from ${taka(lowest)} round trip per person, Dhaka to Cox’s Bazar transport, hotel and food.`

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['saint martin trip cost', 'saint martin tour cost', 'saint martin budget', 'dhaka to saint martin cost', 'সেন্টমার্টিন ভ্রমণ খরচ'],
})

const faqs: [string, string][] = [
  ['How much does a Saint Martin trip cost?', `The ship is the main fixed cost: round-trip seats from Cox’s Bazar cost ${taka(lowest)} to ${taka(highest)} per person in 2026–27. Add transport to Cox’s Bazar, your hotel, food and local costs. The total depends on your start point, nights and room type.`],
  ['What is the cheapest ship fare for a Saint Martin trip?', `The lowest published round-trip seat fare is ${taka(lowest)} per person on ${lowestShip}.`],
  ['Is the Travel Pass an extra cost?', 'No, not when you book through ShipTickets.bd. The QR-coded Travel Pass and the ৳100 environmental conservation fee are included with your ship ticket.'],
  ['How much is transport from Dhaka to Cox’s Bazar?', `Fares were reported in 2023 at about ৳${TRAIN_SHOVON} for a Shovon Chair train seat, ৳1,100 for a non-AC bus, ৳2,000 for an AC bus and ৳4,999 to ৳9,500 by air, each one way. Check the current fare, because these may have changed.`],
  ['How much is a hotel on Saint Martin?', 'Travel guides published between 2023 and 2025 report about ৳1,000 to ৳2,500 a night for a budget hotel, ৳2,000 to ৳7,000 for a mid-range resort and ৳8,000 to ৳15,000 for a higher-end resort, per room. These are not current quotes, so check with the hotel.'],
  ['Can I book only the ship ticket?', 'Yes. ShipTickets.bd helps with Saint Martin ship tickets. Your hotel, food and transport to Cox’s Bazar are arranged separately.'],
  ['সেন্টমার্টিন ভ্রমণে কত খরচ হয়?', `নির্দিষ্ট খরচের বড় অংশ জাহাজের টিকেট: যাওয়া-আসার সিটের ভাড়া জনপ্রতি ${bangla(taka(lowest))} থেকে ${bangla(taka(highest))}। এর সঙ্গে কক্সবাজার পর্যন্ত যাতায়াত, হোটেল ও খাবারের খরচ যোগ করুন।`],
]

const sourceLink = 'font-bold text-brand-ink underline underline-offset-2'
const headCell = 'px-3 py-3 font-bold sm:px-4'
const cell = 'px-3 py-3.5 sm:px-4'

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Travel guide', href: '/saint-martin-guide' }, { name: 'Trip cost' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">The ship is the main fixed cost: round-trip seats cost {taka(lowest)} to {taka(highest)} per person.</strong> Add transport to Cox’s Bazar, your hotel, food and local costs.</>}
      bangla="জাহাজের যাওয়া-আসার ভাড়ার সঙ্গে যাতায়াত, হোটেল ও খাবারের খরচ যোগ করুন।"
      stats={[
        { label: 'Ship, round trip from', value: taka(lowest), note: 'per person' },
        { label: 'Ship, round trip up to', value: taka(highest), note: 'seats' },
        { label: 'Travel Pass', value: 'Included', note: 'with our tickets' },
        { label: '৳100 fee', value: 'Included', note: 'with our tickets' },
      ]}
      actions={<><a href="#budget" className={primaryButton}>See the budget</a><a href="#example" className={secondaryButton}>Worked example</a></>}
      updated="6 November 2026"
    />
  )
}

export default function TripCostPage() {
  return (
    <SeoPage eyebrow="Trip cost · ভ্রমণ খরচ" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="budget" title="What to budget for" intro="Ship fares are published prices. Hotel and food figures are reported ranges, so we don’t give a single total.">
        <IconCards columns={3} items={[
          { icon: Ticket, heading: `Ship: ${taka(lowest)} to ${taka(highest)}`, text: 'Round-trip seats per person, from published operator fares. Cabins cost more.' },
          { icon: TrainFront, heading: 'Dhaka to Cox’s Bazar', text: <>You pay this twice if you start in Dhaka. See the <a href="#transport" className={inlineLink}>reported fares</a> below.</> },
          { icon: BedDouble, heading: 'Hotel: from about ৳1,000', text: <>Per room, per night, and it varies by room and date. See the <a href="#hotel-food" className={inlineLink}>reported ranges</a> below.</> },
          { icon: Scale, heading: 'Food and local costs', text: 'Budget for meals on the island, in Cox’s Bazar and on board, plus transport to the jetty.' },
        ]} />
      </KitSection>

      <KitSection id="ship" title="Round-trip ship fare by ship, 2026–27" intro="Per person, from Cox’s Bazar. Confirm the fare for your date before you pay.">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lowest and highest round-trip seat fares on each Saint Martin ship, in Bangladeshi taka</caption>
            <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className={headCell}>Ship</th><th scope="col" className={`${headCell} text-right`}>Lowest seat</th><th scope="col" className={`${headCell} text-right`}>Highest seat</th></tr></thead>
            <tbody className="tabular-nums">
              {shipRows.map(({ ship, low, high }) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <th scope="row" className={`${cell} font-extrabold text-ink`}><Link href={`/saint-martin-ship/${ship.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{ship.name}</Link></th>
                  <td className={`${cell} text-right font-extrabold text-brand-ink`}>{taka(low)}</td>
                  <td className={`${cell} text-right font-extrabold text-brand-ink`}>{taka(high)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KitSection>

      <KitSection id="transport" title="Dhaka to Cox’s Bazar: reported fares" intro={<><strong className="text-ink">These are not current quotes.</strong> They were reported in late 2023, so check today’s fare with the railway, bus company or airline.</>}>
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Reported one-way fares from Dhaka to Cox’s Bazar in late 2023</caption>
            <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className={headCell}>Transport</th><th scope="col" className={`${headCell} text-right`}>Reported one way</th></tr></thead>
            <tbody className="tabular-nums">
              {[
                ['Train, Shovon Chair', taka(TRAIN_SHOVON)],
                ['Train, AC Chair', taka(1325)],
                ['Bus, non-AC', taka(1100)],
                ['Bus, AC', taka(2000)],
                ['Air', `${taka(4999)} to ${taka(9500)}`],
              ].map(([mode, fare]) => (
                <tr key={mode} className="border-t border-line-soft">
                  <th scope="row" className={`${cell} font-semibold text-prose`}>{mode}</th>
                  <td className={`${cell} text-right font-extrabold text-ink`}>{fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-quiet">Sources: Dhaka Tribune reports on the <a className={sourceLink} href="https://www.dhakatribune.com/bangladesh/332689/cox-s-bazar-express-opens-in-dhaka-cox-s-bazar" target="_blank" rel="noopener noreferrer">Cox’s Bazar Express launch</a> and on <a className={sourceLink} href="https://www.dhakatribune.com/bangladesh/321086/dhaka-cox%E2%80%99s-bazar-train-cheaper-safer-journey-to" target="_blank" rel="noopener noreferrer">Dhaka to Cox’s Bazar fares</a>. See the <Link href="/blog/dhaka-to-saint-martin-travel-guide" className={inlineLink}>Dhaka to Saint Martin guide</Link>.</p>
      </KitSection>

      <KitSection id="hotel-food" title="Saint Martin hotel and food costs" intro={<><strong className="text-ink">These are not current quotes.</strong> They come from Bangladeshi travel guides published between 2023 and 2025, so prices may be higher now. Check with the hotel before you pay.</>}>
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Reported hotel and food prices on Saint Martin’s Island, in Bangladeshi taka</caption>
            <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className={headCell}>Cost</th><th scope="col" className={`${headCell} text-right`}>Reported range</th></tr></thead>
            <tbody className="tabular-nums">
              {[
                ['Budget hotel', 'per room, per night', '৳1,000 to ৳2,500'],
                ['Mid-range resort', 'per room, per night', '৳2,000 to ৳7,000'],
                ['Higher-end resort', 'per room, per night', '৳8,000 to ৳15,000'],
                ['Breakfast', 'per person', '৳150 to ৳200'],
                ['Lunch', 'per person', '৳250 to ৳300'],
              ].map(([item, basis, range]) => (
                <tr key={item} className="border-t border-line-soft">
                  <th scope="row" className={`${cell} font-extrabold text-ink`}>{item}<span className="block text-xs font-semibold text-quiet">{basis}</span></th>
                  <td className={`${cell} text-right font-extrabold text-ink`}>{range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-quiet">Food prices come from one guide, so treat them as a rough idea. ShipTickets.bd helps with ship tickets, and hotels are booked separately.</p>
      </KitSection>

      <KitSection id="example" title="Example: two people from Dhaka" intro="Using the lowest published ship fare and the reported 2023 Shovon Chair train fare. This is a worked example, not a quote.">
        <div className="rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
          <dl className="grid gap-3 sm:grid-cols-3 sm:gap-6">
            <div><dt className="text-xs font-bold text-quiet">Ship, round trip for two</dt><dd className="mt-0.5 text-2xl font-black tabular-nums text-ink">{taka(exampleShip)}</dd></div>
            <div><dt className="text-xs font-bold text-quiet">Train, both ways for two</dt><dd className="mt-0.5 text-2xl font-black tabular-nums text-ink">{taka(exampleTrain)}</dd></div>
            <div><dt className="text-xs font-bold text-quiet">Total before hotel and food</dt><dd className="mt-0.5 text-2xl font-black tabular-nums text-brand-ink">{taka(exampleTotal)}</dd></div>
          </dl>
        </div>
      </KitSection>

      <KitSection id="save" title="How to spend less on a Saint Martin trip">
        <IconCards items={[
          { icon: Ticket, heading: 'Pick the lowest seat', text: <>Compare <Link href="/cheapest-saint-martin-ship-ticket" className={inlineLink}>the cheapest ticket on each ship</Link>.</> },
          { icon: Scale, heading: 'Buy a round trip', text: 'It usually costs less than two one-way tickets.' },
          { icon: TrainFront, heading: 'Check the train first', text: 'Compare it before you pay for a bus or flight.' },
          { icon: Users, heading: 'Share a room', text: 'Hotels usually price per room, not per person.' },
        ]} />
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিন ভ্রমণ খরচ ২০২৬-২৭">
        <p>সেন্টমার্টিন ভ্রমণে নির্দিষ্ট খরচের বড় অংশ জাহাজের টিকেট: যাওয়া-আসার সিটের ভাড়া জনপ্রতি {bangla(taka(lowest))} থেকে {bangla(taka(highest))}। এর সঙ্গে কক্সবাজার পর্যন্ত যাতায়াত, হোটেল ও খাবারের খরচ যোগ করুন।</p>
        <p>২০২৩ থেকে ২০২৫ সালের ভ্রমণ গাইড অনুযায়ী দ্বীপে কক্ষপ্রতি রাতের ভাড়া সাধারণ হোটেলে প্রায় ৳১,০০০ থেকে ৳২,৫০০, মাঝারি রিসোর্টে ৳২,০০০ থেকে ৳৭,০০০ আর ভালো মানের রিসোর্টে ৳৮,০০০ থেকে ৳১৫,০০০। এখনকার ভাড়া এর চেয়ে বেশি হতে পারে, তাই হোটেলে জেনে নিন।</p>
        <p>ShipTickets.bd-এর টিকেটে ট্রাভেল পাস ও ৳১০০ পরিবেশ ফি অন্তর্ভুক্ত। বিস্তারিত পড়ুন <Link href="/blog/saint-martin-tour-cost" className={inlineLink}>ভ্রমণ খরচের গাইডে</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Saint Martin trip cost questions" id="faq" />

      <KitSection title="More on your budget">
        <LinkGrid links={[
          ['/saint-martin-ship-ticket-price', 'Every seat and cabin fare'],
          ['/cheapest-saint-martin-ship-ticket', 'Cheapest ship ticket'],
          ['/routes/coxs-bazar-to-saint-martin', 'Cox’s Bazar to Saint Martin route'],
          ['/saint-martin-travel-pass', 'What the Travel Pass includes'],
        ]} />
      </KitSection>

      <CtaBand title="Need a ship fare for your date?" text="Send your travel date and passenger count, and we’ll confirm the fare and availability." message="Hello ShipTickets.bd, I am planning a Saint Martin trip and need the ship fare for my date." eventLabel="trip_cost" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Travel guide', url: '/saint-martin-guide' }, { name: 'Trip cost', url: path }])] }} />
    </SeoPage>
  )
}
