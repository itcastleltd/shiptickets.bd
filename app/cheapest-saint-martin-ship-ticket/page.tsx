import Link from 'next/link'
import { Armchair, CalendarDays, Sun, Users } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, GuideHero, IconCards, KitSection, LinkGrid, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { ships } from '@/lib/ships'

const path = '/cheapest-saint-martin-ship-ticket'
const amount = (fare: string) => Number(fare.replace(/[^0-9]/g, ''))
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const bangla = (value: string) => value.replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])

/** The lowest seat on each ship, read from content/ships.json and sorted by one-way fare. */
const rows = ships
  .map((ship) => {
    const lowest = ship.ticketClasses.reduce((best, item) => (amount(item.oneWayFare) < amount(best.oneWayFare) ? item : best))
    const oneWay = amount(lowest.oneWayFare)
    const roundTrip = amount(lowest.roundTripFare)
    return { ship, category: lowest.name, oneWay, roundTrip, saving: oneWay * 2 - roundTrip }
  })
  .sort((a, b) => a.oneWay - b.oneWay || a.roundTrip - b.roundTrip)

const cheapest = rows[0]
const cheapestRoundTrip = [...rows].sort((a, b) => a.roundTrip - b.roundTrip)[0]
const cheapestSentence = `${cheapest.ship.name} ${cheapest.category} is the cheapest published Saint Martin ship ticket for 2026–27, at ${taka(cheapest.oneWay)} one way and ${taka(cheapest.roundTrip)} round trip per person.`

const cabinRows = ships
  .filter((ship) => ship.cabins.some((cabin) => cabin.oneWayFare))
  .map((ship) => {
    const cabin = ship.cabins.filter((item) => item.oneWayFare).reduce((best, item) => (amount(item.oneWayFare!) < amount(best.oneWayFare!) ? item : best))
    return { ship, cabin }
  })
  .sort((a, b) => amount(a.cabin.oneWayFare!) - amount(b.cabin.oneWayFare!))

const pageTitle = `Cheapest Saint Martin Ship 2026-27: ${cheapest.ship.name} ${taka(cheapest.oneWay)}`
const h1 = 'Cheapest Saint Martin Ship Ticket 2026–27'
const description = `The cheapest Saint Martin ship ticket for 2026-27 starts from ${taka(cheapest.oneWay)} one way. Compare the lowest seat fare on all five ships from Cox’s Bazar.`

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['cheapest saint martin ship ticket', 'lowest saint martin ship fare', 'saint martin cheapest ship', 'সেন্টমার্টিনের সবচেয়ে কম ভাড়ার জাহাজ'],
})

const faqs: [string, string][] = [
  ['What is the cheapest ship ticket to Saint Martin?', `${cheapestSentence} Confirm the fare for your travel date before you pay.`],
  ['Which ship has the cheapest round trip to Saint Martin?', `${cheapestRoundTrip.ship.name} has the lowest published round-trip seat fare, at ${taka(cheapestRoundTrip.roundTrip)} per person for ${cheapestRoundTrip.category}.`],
  ['Is a round-trip ticket cheaper than two one-way tickets?', `Usually, yes. On ${cheapest.ship.name} ${cheapest.category}, a round trip costs ${taka(cheapest.roundTrip)}, while two one-way tickets cost ${taka(cheapest.oneWay * 2)}, a saving of ${taka(cheapest.saving)} per person.`],
  ['Does the cheapest ticket include the Travel Pass?', 'Yes. Every ship ticket booked through ShipTickets.bd includes the QR-coded Travel Pass, whichever seat you choose.'],
  ['What is the cheapest cabin to Saint Martin?', cabinRows.length ? `${cabinRows[0].ship.name} ${cabinRows[0].cabin.name} has the lowest published cabin fare, from ${cabinRows[0].cabin.oneWayFare} one way. Confirm whether a cabin fare applies per cabin or per passenger.` : 'Cabin fares differ by ship. Confirm the current fare before you pay.'],
]

const headCell = 'px-3 py-3 font-bold sm:px-4'
const cell = 'px-3 py-3.5 sm:px-4'

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Ticket price', href: '/saint-martin-ship-ticket-price' }, { name: 'Cheapest ticket' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">{cheapestSentence}</strong> The Travel Pass is included with tickets booked through ShipTickets.bd.</>}
      bangla="সবচেয়ে কম ভাড়া এমভি টেকনাফের মেইন ডেকে।"
      stats={[
        { label: 'Lowest one way', value: taka(cheapest.oneWay), note: cheapest.ship.name },
        { label: 'Lowest round trip', value: taka(cheapestRoundTrip.roundTrip), note: cheapestRoundTrip.ship.name },
        { label: 'Round trip saves', value: taka(cheapest.saving), note: 'per person' },
        { label: 'Travel Pass', value: 'Included', note: 'with our tickets' },
      ]}
      actions={<><a href="#compare" className={primaryButton}>Compare all 5 ships</a><Link href="/saint-martin-trip-cost" className={secondaryButton}>Full trip cost</Link></>}
      updated="6 November 2026"
    />
  )
}

export default function CheapestTicketPage() {
  return (
    <SeoPage eyebrow="Cheapest fares · সবচেয়ে কম ভাড়া" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="compare" title="Lowest seat fare on each ship, 2026–27" intro="Per person, from Cox’s Bazar. Published operator fares, so confirm yours before you pay.">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lowest one-way and round-trip seat fares on each Saint Martin ship, in Bangladeshi taka</caption>
            <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className={headCell}>Ship and seat</th><th scope="col" className={`${headCell} text-right`}>One way</th><th scope="col" className={`${headCell} text-right`}>Round trip</th></tr></thead>
            <tbody className="tabular-nums">
              {rows.map((row) => (
                <tr key={row.ship.slug} className="border-t border-line-soft">
                  <th scope="row" className={`${cell} font-extrabold text-ink`}><Link href={`/saint-martin-ship/${row.ship.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{row.ship.name}</Link><span className="block text-xs font-semibold text-quiet">{row.category}</span></th>
                  <td className={`${cell} text-right font-extrabold text-brand-ink`}>{taka(row.oneWay)}</td>
                  <td className={`${cell} text-right font-extrabold text-brand-ink`}>{taka(row.roundTrip)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KitSection>

      <KitSection id="saving" title="How much a round trip saves" intro="Comparing each ship’s lowest seat with two one-way tickets.">
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.filter((row) => row.saving > 0).map((row) => (
            <li key={row.ship.slug} className="flex items-center justify-between gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card">
              <span className="min-w-0 font-extrabold text-ink">{row.ship.name}</span>
              <span className="shrink-0 font-black tabular-nums text-brand-ink">Save {taka(row.saving)}</span>
            </li>
          ))}
        </ul>
      </KitSection>

      {cabinRows.length > 0 && (
        <KitSection id="cabin" title="Cheapest cabin on each ship" intro="Confirm whether a cabin fare applies per cabin or per passenger before you pay.">
          <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Lowest cabin fares on each Saint Martin ship with cabins, in Bangladeshi taka</caption>
              <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className={headCell}>Ship and cabin</th><th scope="col" className={`${headCell} text-right`}>One way</th><th scope="col" className={`${headCell} text-right`}>Round trip</th></tr></thead>
              <tbody className="tabular-nums">
                {cabinRows.map(({ ship, cabin }) => (
                  <tr key={ship.slug} className="border-t border-line-soft">
                    <th scope="row" className={`${cell} font-extrabold text-ink`}>{ship.name}<span className="block text-xs font-semibold text-quiet">{cabin.name}</span></th>
                    <td className={`${cell} text-right font-extrabold text-brand-ink`}>{cabin.oneWayFare}</td>
                    <td className={`${cell} text-right font-extrabold text-brand-ink`}>{cabin.roundTripFare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KitSection>
      )}

      <KitSection id="right-for-you" title="Is the cheapest ticket right for you?" intro="The lowest fare is usually a main deck seat. Compare it with what you need for a crossing of about 6 to 7 hours.">
        <IconCards items={[
          { icon: Sun, heading: 'Indoors or open deck?', text: 'Check where the seat is, especially in strong sun or rough weather.' },
          { icon: Armchair, heading: 'Air conditioning', text: 'Check whether your seat has it, as many lower fares do not.' },
          { icon: Users, heading: 'The total cost', text: 'Add up all your passengers, there and back.' },
          { icon: CalendarDays, heading: 'Your departure time', text: 'A cheaper ship may leave at a different time on your date.' },
        ]} />
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিনের সবচেয়ে কম ভাড়ার টিকেট">
        <p>প্রকাশিত ভাড়া অনুযায়ী ২০২৬-২৭ মৌসুমে সবচেয়ে কম ভাড়া এমভি টেকনাফের মেইন ডেকে: একমুখী {bangla(taka(cheapest.oneWay))} এবং যাওয়া-আসা {bangla(taka(cheapest.roundTrip))}, জনপ্রতি। ShipTickets.bd-এর টিকেটে QR কোডযুক্ত ট্রাভেল পাস অন্তর্ভুক্ত।</p>
        <p>টাকা দেওয়ার আগে আপনার তারিখের ভাড়া জেনে নিন। আরও পড়ুন <Link href="/blog/saint-martin-cheapest-ship-ticket" className="font-bold text-brand-ink underline underline-offset-2">সবচেয়ে কম ভাড়া নিয়ে আমাদের লেখা</Link>।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Cheapest ship ticket questions" id="faq" />

      <KitSection title="More on fares">
        <LinkGrid links={[
          ['/saint-martin-ship-ticket-price', 'Every seat and cabin fare'],
          ['/saint-martin-trip-cost', 'Plan your full budget'],
          ['/saint-martin-ship-schedule', 'Ship schedule'],
          ['/saint-martin-cabin-price', 'Cabin price guide'],
        ]} />
      </KitSection>

      <CtaBand title="Check the lowest fare for your date" text="Tell us your date and passenger count, and we’ll confirm the lowest fare for it." message="Hello ShipTickets.bd, I want the cheapest available Saint Martin ship ticket for my travel date." eventLabel="cheapest_ticket" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Ticket price', url: '/saint-martin-ship-ticket-price' }, { name: 'Cheapest ticket', url: path }])] }} />
    </SeoPage>
  )
}
