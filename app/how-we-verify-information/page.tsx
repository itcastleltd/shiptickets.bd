import { XCircle } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, GuideHero, KitSection, LinkGrid, StepRows, pageMeta, pageUrl } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { LAST_VERIFIED, STATUS_LABELS, ships } from '@/lib/ships'

const path = '/how-we-verify-information'
const h1 = 'How We Verify Saint Martin Ship Information'
const description = 'How ShipTickets.bd checks Saint Martin ship fares, schedules and ship status against operator sources, and what to confirm before you pay.'

export const metadata = pageMeta({
  title: h1,
  description,
  path,
  keywords: ['how shiptickets.bd verifies information', 'saint martin ship information source', 'is shiptickets.bd reliable'],
})

const steps = [
  { heading: 'Operating status checked', text: 'We confirm whether the ship is sailing for your season before we describe it as bookable.' },
  { heading: 'Fare checked', text: 'Fares are collected per ticket class (open deck, lounge, AC seating and cabin), not as one headline number.' },
  { heading: 'Operator and route confirmed', text: 'Each ship page names the operator and the route it serves, so you know who is actually sailing.' },
  { heading: 'Availability confirmed before payment', text: 'Final availability, cabin basis and Travel Pass details are confirmed by a real support agent.' },
  { heading: 'Page updated with a new date', text: 'When something changes, the date on the page changes with it. Stale pages are corrected, not left in place.' },
]

const faqs: [string, string][] = [
  ['How do I know if a Saint Martin ship fare is current?', 'Every ship page and price page shows a review date. Because fares are seasonal, treat the published figure as a reference and confirm the exact fare for your travel date before paying.'],
  ['Does the site show live seat availability?', 'No. We do not show live seat availability. A support agent confirms availability, fare and Travel Pass details with you before you pay.'],
  ['Where does the ship information come from?', 'Fares, classes and facilities come from operator-published references and our sales-partner contacts. Government travel rules are checked against official notices. We never publish invented prices, schedules, ratings or reviews.'],
  ['What if a ship’s schedule has not been received?', 'We say so on the page and don’t list a time for it. Ask us for the time on your date, and follow the time printed on your ticket.'],
  ['ShipTickets.bd-এর তথ্য কীভাবে যাচাই করা হয়?', 'জাহাজ কর্তৃপক্ষের প্রকাশিত তথ্য থেকে ভাড়া, টিকেটের ধরন ও রুট সংগ্রহ করা হয়। টাকা দেওয়ার আগে আমাদের সাপোর্ট টিম আপনার তারিখের টিকেট আছে কি না ও ভাড়া কত, তা নিশ্চিত করে।'],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'How we verify' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">We check each ship’s status, fares, operator and route, and a real agent confirms availability before you pay.</strong> Every page shows when it was last reviewed. Last verified: {LAST_VERIFIED}.</>}
      bangla="টাকা দেওয়ার আগে আমাদের সাপোর্ট টিম আপনার ভাড়া ও টিকেট নিশ্চিত করে।"
      updated="6 November 2026"
    />
  )
}

export default function HowWeVerifyPage() {
  return (
    <SeoPage eyebrow="Trust & verification" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="process" title="Our verification process">
        <StepRows columns={3} steps={steps} />
      </KitSection>

      <KitSection id="not-publish" title="What we will not publish">
        <div className="rounded-3xl border border-[#f3d9bf] bg-[#fff8ee] p-5 md:p-7">
          <ul className="t-small grid gap-2.5 text-prose md:grid-cols-2">
            {['Invented fares, schedules, availability, ratings or review counts', 'A departure time from a previous season shown as current', 'Cabin prices without saying if they are per person or per cabin', 'Live seat availability we can’t back up', 'A ship marked as confirmed when its status is unverified'].map((item) => <li key={item} className="flex gap-2"><XCircle size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-[#b7791f]" /> {item}</li>)}
          </ul>
        </div>
      </KitSection>

      <KitSection id="sources" title="Information source for each ship" intro="Government travel rules are checked against official notices. Seasonal access and Travel Pass requirements can change.">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Operator, status and last verified date for each Saint Martin ship</caption>
            <thead className="bg-[#e3ecea] text-ink"><tr><th scope="col" className="px-3 py-3 font-bold sm:px-4">Ship</th><th scope="col" className="px-3 py-3 font-bold sm:px-4">Status</th><th scope="col" className="px-3 py-3 font-bold sm:px-4">Last verified</th></tr></thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3.5 font-extrabold text-ink sm:px-4">{ship.name}<span className="block text-xs font-semibold text-quiet">{ship.operator}</span></th>
                  <td className="px-3 py-3.5 text-prose sm:px-4">{STATUS_LABELS[ship.status]}</td>
                  <td className="px-3 py-3.5 text-prose sm:px-4">{ship.lastVerified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KitSection>

      <BanglaBox id="bangla" title="আমরা তথ্য কীভাবে যাচাই করি">
        <p>জাহাজ কর্তৃপক্ষের প্রকাশিত তথ্য থেকে ভাড়া, টিকেটের ধরন ও রুট সংগ্রহ করার পর আমাদের সাপোর্ট টিম আপনার তারিখের টিকেট আছে কি না যাচাই করে। প্রতিটি পাতায় সর্বশেষ যাচাইয়ের তারিখ থাকে, আর কোনো তথ্য নিশ্চিত না হলে আমরা সেটি প্রকাশ করি না।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Questions about our information" id="faq" />

      <KitSection title="See the review date on each page">
        <LinkGrid links={[
          ['/saint-martin-ship', 'All Saint Martin ships'],
          ['/saint-martin-ship-ticket-price', 'Ticket price guide'],
          ['/saint-martin-ship-schedule', 'Schedule and status'],
          ['/saint-martin-travel-rules', 'Travel rules'],
        ]} />
      </KitSection>

      <CtaBand title="Confirm before you book" text="Share your travel date and passenger count, and a support agent will confirm your sailing and fare." message="Hello ShipTickets.bd, please confirm the current schedule and fare for my travel date." eventLabel="verify_page_whatsapp" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'How we verify', url: path }])] }} />
    </SeoPage>
  )
}
