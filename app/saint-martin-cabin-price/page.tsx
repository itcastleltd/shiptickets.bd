import Link from 'next/link'
import { BedDouble, Armchair, Sun, Users } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, GuideHero, IconCards, KitSection, LinkGrid, inlineLink, pageMeta, pageUrl, primaryButton, secondaryButton } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { ships } from '@/lib/ships'

const path = '/saint-martin-cabin-price'
const amount = (fare?: string) => Number((fare ?? '').replace(/[^0-9]/g, '')) || 0
const taka = (value: number) => `৳${value.toLocaleString('en-US')}`
const bangla = (value: string) => value.replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])

const withCabins = ships.filter((ship) => ship.cabins.length > 0)
const seatOnly = ships.filter((ship) => ship.cabins.length === 0)
const cabinFares = withCabins.flatMap((ship) => ship.cabins.map((cabin) => amount(cabin.oneWayFare)).filter(Boolean))
const lowestCabin = Math.min(...cabinFares)
const highestCabin = Math.max(...cabinFares)
const lowestSeat = Math.min(...ships.flatMap((ship) => ship.ticketClasses.map((item) => amount(item.oneWayFare)).filter(Boolean)))
const cheapestCabinShip = withCabins.find((ship) => ship.cabins.some((cabin) => amount(cabin.oneWayFare) === lowestCabin)) ?? withCabins[0]
const cabinShipNames = withCabins.map((ship) => ship.name).join(', ').replace(/, ([^,]*)$/, ' and $1')

const pageTitle = 'Saint Martin Ship Cabin Price 2026-27'
const h1 = 'Saint Martin Ship Cabin Price & Seat Class Fares 2026–27'
const description = `Compare Saint Martin ship cabin prices for 2026-27: private cabins from ${taka(lowestCabin)} one way on ${withCabins.length} ships, plus open deck, lounge and AC seat fares.`

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['saint martin ship cabin price', 'saint martin cabin price', 'saint martin ship vip cabin', 'সেন্টমার্টিন জাহাজের কেবিন ভাড়া'],
})

const faqs: [string, string][] = [
  ['What is the Saint Martin ship cabin price?', `Published cabin fares run from ${taka(lowestCabin)} to ${taka(highestCabin)} one way, depending on the ship and cabin. Cabin pricing may be quoted per person or per cabin, so confirm the basis before payment.`],
  ['Is a Saint Martin ship cabin price per person or per cabin?', 'It depends on the operator and the category. Bunker beds and lounge seats are normally per person, while a twin or VIP cabin is sometimes quoted for the whole cabin. Ask for the pricing basis before you pay.'],
  ['Which ship has the cheapest cabin?', `${cheapestCabinShip.name} has the lowest published cabin fare, from ${taka(lowestCabin)} one way.`],
  ['Which Saint Martin ships have cabins?', `${cabinShipNames} publish private cabins. ${seatOnly.map((ship) => ship.name).join(' and ')} publish seating categories only.`],
  ['Is open deck cheaper than a cabin?', `Yes. Seats start from ${taka(lowestSeat)} one way, while cabins start from ${taka(lowestCabin)}. On some ships a named Economy seat is cheaper than Open Deck, so check the fare table rather than assuming.`],
  ['সেন্টমার্টিন জাহাজের কেবিনের ভাড়া কত?', `প্রকাশিত কেবিন ভাড়া একমুখী ${bangla(taka(lowestCabin))} থেকে ${bangla(taka(highestCabin))}, জাহাজ ও কেবিনভেদে। ভাড়া জনপ্রতি নাকি পুরো কেবিনের জন্য, তা টাকা দেওয়ার আগে জেনে নিন।`],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Ticket price', href: '/saint-martin-ship-ticket-price' }, { name: 'Cabin price' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">Private cabins start at {taka(lowestCabin)} one way on {cheapestCabinShip.name}, and reach {taka(highestCabin)}.</strong> {cabinShipNames} publish cabins, and seats are cheaper, from {taka(lowestSeat)}.</>}
      bangla="জাহাজের কেবিনের ভাড়া মিলিয়ে দেখুন, আর জেনে নিন ভাড়া জনপ্রতি নাকি পুরো কেবিনের।"
      stats={[
        { label: 'Cabins from', value: taka(lowestCabin), note: 'one way' },
        { label: 'Highest cabin', value: taka(highestCabin), note: 'one way' },
        { label: 'Ships with cabins', value: String(withCabins.length), note: 'of 5 ships' },
        { label: 'Seats from', value: taka(lowestSeat), note: 'one way' },
      ]}
      actions={<><a href="#cabins" className={primaryButton}>Compare cabins</a><Link href="/saint-martin-ship-ticket-price" className={secondaryButton}>All ticket prices</Link></>}
      updated="6 November 2026"
    />
  )
}

export default function CabinPricePage() {
  return (
    <SeoPage eyebrow="Cabin prices · কেবিন" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="cabins" title="Saint Martin ship cabins compared" intro="Published fares, not live prices. Confirm the exact fare and pricing basis for your travel date.">
        <div className="grid gap-5 lg:grid-cols-2">
          {withCabins.map((ship) => (
            <div key={ship.slug} className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
              <h3 className="px-4 pb-2 pt-4 text-lg font-black text-ink"><Link href={`/saint-martin-ship/${ship.slug}`} className="underline-offset-2 hover:text-brand-ink hover:underline">{ship.name} cabins</Link></h3>
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Cabin fares on {ship.name}, in Bangladeshi taka</caption>
                <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className="px-4 py-2.5 font-bold">Cabin</th><th scope="col" className="px-3 py-2.5 text-right font-bold">One way</th><th scope="col" className="px-4 py-2.5 text-right font-bold">Round trip</th></tr></thead>
                <tbody className="tabular-nums">
                  {ship.cabins.map((cabin) => (
                    <tr key={cabin.name} className="border-t border-line-soft">
                      <th scope="row" className="px-4 py-3 font-extrabold text-ink">{cabin.name}{cabin.capacity && <span className="block text-xs font-semibold text-quiet">{cabin.capacity}</span>}</th>
                      <td className="px-3 py-3 text-right font-extrabold text-brand-ink">{cabin.oneWayFare ?? 'Ask us'}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-brand-ink">{cabin.roundTripFare ?? 'Ask us'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <p className="t-small mt-4 text-prose">{seatOnly.map((ship, index) => <span key={ship.slug}>{index > 0 && ' and '}<Link href={`/saint-martin-ship/${ship.slug}`} className={inlineLink}>{ship.name}</Link></span>)} publish seating categories only.</p>
      </KitSection>

      <KitSection id="classes" title="Seat classes and cabins explained" intro="Operators use their own names, so we keep their wording.">
        <IconCards items={[
          { icon: Sun, heading: 'Open deck and sun deck', text: 'Outdoor seating. It is often the entry fare, though a named Economy seat can cost less on some ships.' },
          { icon: Armchair, heading: 'Lounge and AC seating', text: 'Indoor seats. Many are air-conditioned, and some ships list them separately.' },
          { icon: Users, heading: 'Bunker bed', text: 'Shared berth accommodation, usually priced per person.' },
          { icon: BedDouble, heading: 'Private cabin', text: 'Single, twin, family, VIP or VVIP. Check whether the fare is per person or per cabin.' },
        ]} />
      </KitSection>

      <KitSection id="before" title="Before you pay for a cabin">
        <div className="rounded-3xl border border-[#f3d9bf] bg-[#fff8ee] p-5 md:p-7">
          <ul className="t-small grid gap-2.5 text-prose sm:grid-cols-2">
            {['Ask whether the price is per person or for the whole cabin', 'Confirm how many people the cabin holds', 'Check what is included: meals, deck access, washroom and seating', 'Confirm the cancellation terms', 'Keep the name on your ticket identical to your ID'].map((item) => <li key={item} className="flex gap-2"><BedDouble size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-[#b7791f]" /> {item}</li>)}
          </ul>
        </div>
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিন জাহাজের কেবিনের ভাড়া">
        <p>প্রকাশিত কেবিন ভাড়া একমুখী {bangla(taka(lowestCabin))} থেকে {bangla(taka(highestCabin))}। {withCabins.map((ship) => ship.nameBn).join(', ')} জাহাজে কেবিন আছে। সিট আরও কম ভাড়ায় পাওয়া যায়, একমুখী {bangla(taka(lowestSeat))} থেকে।</p>
        <p>ভাড়া জনপ্রতি নাকি পুরো কেবিনের জন্য, আর কেবিনে কতজন থাকতে পারবেন, তা টাকা দেওয়ার আগে জেনে নিন।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Saint Martin ship cabin questions" id="faq" />

      <KitSection title="More on cabins and fares">
        <LinkGrid links={[
          ['/saint-martin-ship-ticket-price', 'Full ticket price guide'],
          ['/cheapest-saint-martin-ship-ticket', 'Cheapest ship ticket'],
          ['/saint-martin-ship', 'Compare all ships'],
          ['/saint-martin-ship-schedule', 'Ship schedule'],
        ]} />
      </KitSection>

      <CtaBand title="Check the cabin fare for your date" text="Send your date, passenger count and preferred cabin. We confirm the fare and basis before you pay." message="Hello ShipTickets.bd, I want to check cabin availability and price for my travel date." eventLabel="cabin_price_whatsapp" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Ticket price', url: '/saint-martin-ship-ticket-price' }, { name: 'Cabin price', url: path }])] }} />
    </SeoPage>
  )
}
