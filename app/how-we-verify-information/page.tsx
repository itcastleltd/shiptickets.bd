import type { Metadata } from 'next'
import { SeoPage, Section, Bullet, LinkCard, Schema, siteSchema, websiteSchema, breadcrumbSchema, faqSchema, whatsapp } from '@/components/seo-page'
import { LAST_VERIFIED, STATUS_LABELS, ships } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const title = 'How We Verify Saint Martin Ship Information'
const description = `How ShipTickets.bd verifies Saint Martin ship fares, schedules, operating status and ticket categories before publishing them. Last verified: ${LAST_VERIFIED}.`

export const metadata: Metadata = {
  title: 'How We Verify Saint Martin Ship Information',
  description,
  alternates: { canonical: 'https://www.shiptickets.bd/how-we-verify-information' },
  openGraph: { title, description, url: 'https://www.shiptickets.bd/how-we-verify-information' },
}

const steps = [
  { title: 'Operating status checked', text: 'We confirm whether the vessel is sailing for your season before we describe it as bookable.' },
  { title: 'Fare checked', text: 'Fares are collected per ticket class (open deck, lounge, AC seating and cabin) rather than as a single headline number.' },
  { title: 'Operator and route confirmed', text: 'Each ship page names the operator and the route it serves, so you know who is actually sailing.' },
  { title: 'Availability confirmed before payment', text: 'Final availability, cabin basis and Travel Pass requirements are confirmed by a human support agent.' },
  { title: 'Page updated with a new date', text: 'When something changes, the "last verified" date on the page changes with it. Stale pages are corrected, not quietly left in place.' },
]

const faqs: [string, string][] = [
  ['How do I know if a Saint Martin ship fare is current?', 'Every ship page and price page shows a "Last verified" date and an operating status. Because fares are seasonal, treat the published figure as a reference and confirm the exact fare for your travel date on WhatsApp before paying.'],
  ['Does ShipTickets.bd sell tickets online?', 'No. ShipTickets.bd is an information and booking support platform. There is no live booking engine or payment on this site. A support agent confirms availability, fare and Travel Pass requirements with you first.'],
  ['Where does the ship information come from?', 'Fares, classes and facilities come from operator-published references and our authorized sales-partner contacts. Government travel rules are checked against official notices. We never publish invented prices, schedules, ratings or reviews.'],
  ['Why do some ships say "needs confirmation"?', 'A seasonal vessel or a recently changed schedule is marked "needs confirmation" until we verify it for the current season. That status is deliberate. It tells you to confirm before booking rather than presenting an unverified schedule as fact.'],
]

export default function HowWeVerifyPage() {
  return (
    <SeoPage eyebrow="Trust & verification" title={title} intro={description}>
      <Section title="Quick Answer">
        <p><strong>How does ShipTickets.bd verify ship information?</strong> We check operating status, fares per ticket class, operator and route, then confirm live availability with a human agent before any payment. Every page carries a <strong>Last verified: {LAST_VERIFIED}</strong> date, and every ship shows a clear seasonal status.</p>
        <p className="mt-3"><strong>Do you publish live availability?</strong> No. We do not run a live booking engine or hold inventory, so we never present unconfirmed availability or fares as current. Confirmation happens on WhatsApp or phone.</p>
      </Section>

      <Section title="Our verification process">
        <ol className="flex flex-col gap-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#1d9e75] text-xs font-extrabold text-white">{index + 1}</span>
              <span><strong className="block text-[#0d1b2a]">{step.title}</strong>{step.text}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="What we will not publish">
        <ul className="flex flex-col gap-3">
          <Bullet>Invented fares, schedules, availability, ratings or review counts.</Bullet>
          <Bullet>A departure time copied from a previous season presented as current.</Bullet>
          <Bullet>Cabin pricing without stating whether it is per person or per cabin.</Bullet>
          <Bullet>Claims of live booking or online payment that the site does not support.</Bullet>
          <Bullet>A ship marked as confirmed when its seasonal status is still unverified.</Bullet>
        </ul>
      </Section>

      <Section title="Information source for each ship">
        <div className="overflow-x-auto rounded-xl border border-[#d4e6e2]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1b2a]/[4%]">
              <tr><th className="px-4 py-3 font-bold">Ship</th><th className="px-4 py-3 font-bold">Operator</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Last verified</th></tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-[#e7f0ee]">
                  <td className="px-4 py-3 font-extrabold">{ship.name}</td>
                  <td className="px-4 py-3">{ship.operator}</td>
                  <td className="px-4 py-3">{STATUS_LABELS[ship.status]}</td>
                  <td className="px-4 py-3">{ship.lastVerified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#67878c]">Government travel rules are checked against official notices. Seasonal access, Travel Pass and QR ticket requirements can change between seasons.</p>
      </Section>

      <Section title="See the verification date on each page">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard href="/saint-martin-ship" title="All Saint Martin ships" text="Every ship with status, fares, classes and cabins." />
          <LinkCard href="/saint-martin-ship-ticket-price" title="Ticket price guide" text="How fares vary by ship, class, cabin and season." />
          <LinkCard href="/saint-martin-ship-schedule" title="Schedule and status" text="Departure information with verification notes." />
          <LinkCard href="/saint-martin-travel-rules" title="Travel rules" text="Current restrictions to check before you travel." />
        </div>
      </Section>

      <Section title="FAQ">
        <div className="flex flex-col gap-4">
          {faqs.map(([question, answer]) => (
            <div key={question}>
              <p className="font-extrabold text-[#0d1b2a]">{question}</p>
              <p className="mt-1">{answer}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Confirm before you book">
        <p className="mb-4">Share your travel date and passenger count. A support agent will confirm the current sailing, fare, cabin basis and Travel Pass requirement with you.</p>
        <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please confirm the current schedule and fare for my travel date.`} kind="whatsapp" eventLabel="verify_page_whatsapp" className="inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-5 py-3 text-sm font-extrabold text-white">Confirm on WhatsApp</ContactLink>
      </Section>

      <Schema data={{
        '@context': 'https://schema.org',
        '@graph': [
          siteSchema,
          websiteSchema,
          breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'How we verify information' }]),
          faqSchema(faqs),
        ],
      }} />
    </SeoPage>
  )
}