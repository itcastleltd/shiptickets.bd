import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, BedDouble, Check, Clock3, Info, MessageCircle, Ship, Ticket } from 'lucide-react'
import { LinkCard, Pill, Schema, Section, SeoPage, faqSchema, siteSchema, websiteSchema, breadcrumbSchema, whatsapp } from '@/components/seo-page'

export const metadata: Metadata = {
  title: 'Saint Martin Ship Ticket Price',
  description: 'Compare Saint Martin ship ticket prices from Cox\'s Bazar, including one-way, round-trip, seat, lounge and cabin fares for Karnafuly Express and Baro Awlia.',
  keywords: ['saint martin ship ticket price', 'সেন্টমার্টিন জাহাজের টিকিটের দাম', 'saint martin ship cabin price', 'cox\'s bazar to saint martin ship ticket'],
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-ship-ticket-price' },
}

const fares = [
  ['Lavender / Marigold', 'Standard seat', '৳1,800', '৳3,500'],
  ['Open Deck', 'Open deck seat', '৳2,100', '৳4,000'],
  ['Gladiolus', 'Business seat', '৳2,600', '৳5,000'],
  ['Lilac Lounge', 'Lounge seating', '৳2,700', '৳5,300'],
  ['Chrysanthemum Lounge', 'Premium lounge', '৳2,900', '৳5,600'],
  ['Single Cabin', '1 passenger', '৳3,300', '৳6,500'],
  ['Twin Cabin', '2 passengers', '৳7,000', '৳13,000'],
  ['VIP Cabin', 'Premium cabin', '৳8,500', '৳16,000'],
  ['VVIP Cabin', 'Top-tier cabin', '৳10,500', '৳20,000'],
]

const baroFares = [
  ['Sun Deck / Main Deck', '৳1,800', '৳3,500'],
  ['Panorama / Riviera Chair', '৳2,100', '৳4,000'],
  ['Mozarat Chair', '৳2,200', '৳4,300'],
  ['Bunker Bed', '৳4,100', '৳8,000'],
  ['Deluxe Cabin', '৳7,000', '৳13,000'],
  ['Family Bunker / VIP Cabin', '৳8,500', '৳16,000'],
  ['VVIP Cabin', '৳10,500', '৳20,000'],
]

const faqs: [string, string][] = [
  ['সেন্টমার্টিন জাহাজের টিকিট কত টাকা?', 'জাহাজ, seat category, cabin, travel date এবং one-way বা round-trip অনুযায়ী ভাড়া পরিবর্তিত হয়। প্রকাশিত Karnafuly Express fare ৳1,800 থেকে শুরু হয়ে VVIP cabin-এ ৳10,500 one-way পর্যন্ত হতে পারে। পেমেন্টের আগে বর্তমান ভাড়া নিশ্চিত করুন।'],
  ['Saint Martin ship ticket price কি fixed?', 'না। অপারেটর, অনুমোদিত route, season, ticket class এবং availability অনুযায়ী মূল্য পরিবর্তন হতে পারে। এই পেজের fares reference হিসেবে দেখুন এবং আপনার travel date-এর জন্য WhatsApp-এ confirm করুন।'],
  ['One-way এবং round-trip fare-এর পার্থক্য কী?', 'One-way fare একদিকের যাত্রার জন্য। Round-trip fare Cox\'s Bazar থেকে Saint Martin এবং ফেরত যাত্রা—দুই দিকের জন্য প্রযোজ্য হতে পারে। Cabin fare per person না per cabin, সেটিও আগে জেনে নিন।'],
  ['সেন্টমার্টিন ship cabin price কত?', 'Karnafuly Express-এর প্রকাশিত reference fare অনুযায়ী Single Cabin ৳3,300 one-way, Twin Cabin ৳7,000, VIP ৳8,500 এবং VVIP ৳10,500 থেকে শুরু হতে পারে। Cabin availability সীমিত হতে পারে।'],
  ['টিকিটের মধ্যে Travel Pass বা QR code কি থাকে?', 'বর্তমান সরকারি নিয়ম এবং authorised ticketing process-এর ওপর এটি নির্ভর করে। আপনার booking-এর সঙ্গে Travel Pass, QR code, boarding point এবং passenger details included কি না, তা payment-এর আগে confirm করুন।'],
]

function FareTable({ rows, title }: { rows: string[][]; title: string }) {
  return <div className="overflow-hidden rounded-2xl border border-[#dedcd3]">
    <div className="flex items-center justify-between gap-3 border-b border-[#dedcd3] bg-[#f7f6f2] px-4 py-4"><h3 className="font-extrabold">{title}</h3><Pill>Reference fare</Pill></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-[#0d1b2a] text-white"><tr><th className="px-4 py-3 font-bold">Category</th><th className="px-4 py-3 font-bold">Type</th><th className="px-4 py-3 text-right font-bold">One way</th><th className="px-4 py-3 text-right font-bold">Round trip</th></tr></thead><tbody>{rows.map((row, index) => <tr className="border-b border-[#eceae3] last:border-0" key={row[0]}><td className="px-4 py-3 font-bold text-[#0d1b2a]">{row[0]}</td><td className="px-4 py-3 text-[#5f5e5a]">{row[1]}</td><td className="px-4 py-3 text-right font-extrabold text-[#1d9e75]">{row[2]}</td><td className="px-4 py-3 text-right font-extrabold text-[#0d1b2a]">{row[3]}</td></tr>)}</tbody></table></div>
  </div>
}

export default function PricePage() {
  const productSchema = ['Karnafuly Express', 'MV Baro Awlia'].map((name, index) => ({ '@type': 'Product', name: `${name} Saint Martin ship ticket`, description: `Reference fares and booking information for ${name} from Cox's Bazar to Saint Martin.`, brand: { '@type': 'Brand', name }, category: 'Saint Martin ship ticket', areaServed: 'Bangladesh', offers: { '@type': 'AggregateOffer', priceCurrency: 'BDT', lowPrice: index === 0 ? '1800' : '1800', highPrice: index === 0 ? '10500' : '10500', offerCount: index === 0 ? '9' : '7', availability: 'https://schema.org/LimitedAvailability', url: 'https://www.shiptickets.bd/saint-martin-ship-ticket-price' } }))

  return <SeoPage eyebrow="Price guide · ভাড়ার তথ্য" title="Saint Martin ship ticket price" intro="Compare current reference fares from Cox's Bazar to Saint Martin by ship, seat class, cabin and journey type. See one-way and round-trip prices, then confirm availability before payment.">
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      {[['Starting fare', '৳1,800', 'one-way reference'], ['Cabin fare', '৳3,300+', 'subject to availability'], ['Last reviewed', 'Sep 2026', 'confirm before payment']].map(([label, value, note]) => <div className="rounded-2xl border border-[#dedcd3] bg-white p-5" key={label}><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#888780]">{label}</p><p className="mt-2 text-2xl font-extrabold tracking-tight text-[#0d1b2a]">{value}</p><p className="mt-1 text-xs text-[#5f5e5a]">{note}</p></div>)}
    </div>

    <div className="mb-10 flex flex-col gap-4 rounded-3xl bg-[#0d1b2a] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8"><div><div className="flex items-center gap-2 text-sm font-bold text-[#ef9f27]"><BadgeCheck size={17} /> Fare status: operator-published reference</div><h2 className="mt-3 text-2xl font-extrabold tracking-tight">Need the fare for your date?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Send your travel date and passenger count. We will help you confirm the latest price, ship status and cabin availability before you pay.</p></div><a href={`${whatsapp}Hello ShipTickets.bd, please confirm the latest Saint Martin ship ticket price for my travel date.`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ef9f27] px-5 py-3 text-sm font-extrabold text-[#0d1b2a]"><MessageCircle size={17} /> WhatsApp for latest fare</a></div>

    <Section title="সেন্টমার্টিন জাহাজের টিকিটের দাম এক নজরে"><p>There is no single fixed Saint Martin ship ticket price. Fare depends on the ship, ticket category, season, travel date and whether you need a one-way or round-trip ticket. The tables below are useful planning references—not a promise of availability.</p><div className="mt-5 flex flex-wrap gap-2"><Pill>One-way fare</Pill><Pill>Round-trip fare</Pill><Pill>Seat & cabin options</Pill><Pill>Confirm before payment</Pill></div></Section>

    <Section title="Karnafuly Express ticket price"><FareTable rows={fares.map(([name, type, one, round]) => [name, type, one, round])} title="Karnafuly Express · Cox's Bazar to Saint Martin" /><p className="mt-4 text-sm">Karnafuly Express publishes multiple seating, lounge and cabin categories. Fare may be quoted per passenger or per cabin depending on the category, so ask the booking team to clarify the basis of the price.</p><Link href="/mv-karnafuly-express" className="mt-4 inline-flex items-center gap-2 font-extrabold text-[#1d9e75]">Read MV Karnafuly Express details <ArrowRight size={16} /></Link></Section>

    <Section title="MV Baro Awlia ticket price"><FareTable rows={baroFares.map(([name, one, round]) => [name, 'Seat or cabin category', one, round])} title="MV Baro Awlia · reference fare" /><Link href="/saint-martin-ship/baro-awlia" className="mt-4 inline-flex items-center gap-2 font-extrabold text-[#1d9e75]">View MV Baro Awlia ship page <ArrowRight size={16} /></Link></Section>

    <Section title="Saint Martin ship cabin price"><div className="grid gap-3 sm:grid-cols-3">{[['Single cabin', '1 passenger', 'From ৳3,300'], ['Twin cabin', '2 passengers', 'From ৳7,000'], ['VIP / VVIP', 'Premium space', 'From ৳8,500']].map(([name, detail, price]) => <div className="rounded-2xl bg-[#f7f6f2] p-4" key={name}><BedDouble className="text-[#1d9e75]" size={20} /><h3 className="mt-3 font-extrabold">{name}</h3><p className="text-sm text-[#5f5e5a]">{detail}</p><p className="mt-2 font-extrabold text-[#0d1b2a]">{price}</p></div>)}</div><p>Cabin prices can be limited by passenger capacity and booking date. Confirm whether the displayed amount is per person or for the full cabin, and ask what facilities are included.</p></Section>

    <Section title="One-way vs round-trip ticket"><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-[#dedcd3] p-5"><Ticket className="text-[#1d9e75]" size={22} /><h3 className="mt-3 font-extrabold">One-way</h3><p className="mt-2 text-sm">Cox's Bazar → Saint Martin. Useful when your return plan is flexible or booked separately.</p></div><div className="rounded-2xl border border-[#dedcd3] p-5"><Ship className="text-[#1d9e75]" size={22} /><h3 className="mt-3 font-extrabold">Round trip</h3><p className="mt-2 text-sm">Cox's Bazar → Saint Martin → Cox's Bazar. Confirm the return date, reporting time and ticket conditions.</p></div></div></Section>

    <Section title="What to confirm before you pay"><ul className="grid gap-3 md:grid-cols-2">{['Ship name and approved departure point', 'One-way or round-trip fare', 'Passenger count and cabin capacity', 'Boarding time and return schedule', 'Travel Pass and QR requirements', 'Cancellation and refund conditions'].map(item => <li className="flex gap-3" key={item}><Check className="mt-1 shrink-0 text-[#1d9e75]" size={17} /><span>{item}</span></li>)}</ul><div className="mt-5 flex gap-3 rounded-2xl bg-[#fff4db] p-4 text-sm text-[#6b4c12]"><Info className="mt-0.5 shrink-0" size={18} /><p>Saint Martin tourism is seasonal. Vessel operation, visitor access, Travel Pass rules and fares can change with government instructions.</p></div></Section>

    <Section title="Frequently asked questions"><div className="divide-y divide-[#eceae3]">{faqs.map(([question, answer]) => <details className="group py-4 first:pt-0 last:pb-0" key={question}><summary className="cursor-pointer list-none pr-8 font-extrabold text-[#0d1b2a] marker:hidden">{question}<span className="float-right text-[#1d9e75]">+</span></summary><p className="mt-3 text-sm leading-7">{answer}</p></details>)}</div></Section>

    <div className="mb-10 grid gap-3 md:grid-cols-2"><LinkCard href="/saint-martin-ship-schedule" title="Check ship schedule" text="Review seasonal departure and return schedule guidance." /><LinkCard href="/saint-martin-travel-pass" title="Understand Travel Pass" text="Learn about pass, QR and current travel requirements." /><LinkCard href="/saint-martin-ship" title="Compare ships" text="Explore available Saint Martin ships and operator pages." /><LinkCard href="/saint-martin-guide" title="Read the Saint Martin guide" text="Plan jetty, boarding, stay and island activities." /></div>

    <div className="flex items-center gap-2 text-xs font-bold text-[#888780]"><Clock3 size={15} /> Fare source: operator-published reference information · Last price review: September 2026 · Confirm before booking</div>
    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, ...productSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Saint Martin Ship Ticket Price' }])] }} />
  </SeoPage>
}


