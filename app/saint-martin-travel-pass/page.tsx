import type { Metadata } from 'next'
import { BanglaSummary } from '@/components/bangla-summary'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, faqSchema, breadcrumbSchema, ProseSection } from '@/components/seo-page'

export const metadata: Metadata = {
  title: 'Saint Martin Travel Pass 2026–27: Rules & Guide',
  description: 'Learn how to get the Saint Martin travel pass, check ticket requirements, travel rules, fees and official guidance for the 2026–27 season in Bangladesh.',
  openGraph: { title: 'Saint Martin Travel Pass 2026–27: Rules & Guide', description: 'Learn how to get the Saint Martin travel pass, check ticket requirements, travel rules, fees and official guidance for the 2026–27 season in Bangladesh.', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-travel-pass' },
}

const faqs: [string, string][] = [
  ['What is the Saint Martin Travel Pass?', 'It is the travel authorization used under government rules for visitors to Saint Martin Island. Requirements can change by season.'],
  ['Do I need a QR-coded ticket?', 'If current rules require a QR-coded ticket or Travel Pass, use only a valid ticket issued through an authorized process and verify the details before departure.'],
  ['How do I apply for a Travel Pass?', 'Start with the official portal at travelpass.gov.bd and follow its current instructions.'],
  ['Is the travel pass the same as a ship ticket?', 'No. The pass and ship ticket serve different purposes under the applicable rules. Check that you have all required travel documents.'],
  ['What is the environmental conservation fee for 2026–27?', 'An environmental conservation fee of ৳100 per tourist has been announced. Confirm the current payment process through official guidance.'],
  ['Can ShipTickets.bd issue my travel pass?', 'ShipTickets.bd provides ship information and travel guidance; it does not operate a live booking engine. Use the official portal for the current pass process.'],
  ['Can I stay overnight on Saint Martin’s Island?', 'Overnight-stay rules depend on the current government directives and travel date. Check the latest official guidance before arranging accommodation.'],
]

export default function TravelPassPage() {
  return (
    <SeoPage eyebrow="Travel Pass · ট্রাভেল পাস" title="Saint Martin Travel Pass — Plan Your Trip the Right Way" intro="Learn about the travel pass, QR-coded ship tickets, applicable fees and current travel requirements before visiting Saint Martin’s Island. Check the latest official guidance before confirming your journey.">
      <BanglaSummary path="/saint-martin-travel-pass" />
      <ProseSection title="What is a Saint Martin travel pass?">
        <p>A Saint Martin travel pass is part of the travel-control system used to manage tourist visits to the island and support environmental conservation. Under the government’s travel requirements, visitors need to follow the applicable pass and QR-coded ticket process through a recognized official portal. Requirements may change between travel seasons, so check the current instructions before travelling.</p>
        <p className="mt-4">সেন্টমার্টিন ট্রাভেল পাস হলো দ্বীপে পর্যটকদের যাতায়াত নিয়ন্ত্রণ এবং পরিবেশ সংরক্ষণের জন্য ব্যবহৃত একটি ব্যবস্থা। সরকারি নির্দেশনা অনুযায়ী, পর্যটকদের অনুমোদিত পোর্টালের মাধ্যমে প্রযোজ্য ট্রাভেল পাস ও QR কোডযুক্ত টিকিট সংগ্রহের নিয়ম অনুসরণ করতে হয়। মৌসুমভেদে নিয়ম পরিবর্তিত হতে পারে, তাই যাত্রার আগে সর্বশেষ নির্দেশনা দেখে নিন।</p>
        <p className="mt-4">Official travel pass portal: <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-extrabold text-brand-ink">travelpass.gov.bd</a></p>
      </ProseSection>
      <Section title="Travel rules for the 2026–27 season">
        <p className="text-sm text-quiet">The following details reflect announcements available as of 29 October 2026. Recheck official guidance before travelling.</p>
        <ul className="mt-4 grid gap-3">
          <Bullet><strong>Travel season:</strong> 1 November 2026 to 15 March 2027.</Bullet>
          <Bullet><strong>Environmental conservation fee:</strong> ৳100 per tourist announced included with ship ticket.</Bullet>
          <Bullet><strong>QR-coded ticket and travel pass:</strong> Saintmartin Travel pass and QR-code will added with ship ticket.</Bullet>
          <Bullet><strong>Approved passenger vessels:</strong> Travel only on vessels authorized to operate on the Saint Martin route.</Bullet>
        </ul>
        <p className="mt-4 text-sm text-prose">Important: Earlier rules restrict overnight stays in November and permit them in December and January. As implementation details can be updated, confirm the permitted travel date and overnight-stay conditions through the official portal or relevant authority before booking.</p>
      </Section>
      <ProseSection title="How to get your travel pass">
        <ol className="list-decimal pl-6 space-y-1">
          <li>Visit the official portal: <a href="https://travelpass.gov.bd/" target="_blank" rel="noopener noreferrer" className="font-extrabold text-brand-ink">travelpass.gov.bd</a>.</li>
          <li>Check the available travel dates, vessel information and pass requirements.</li>
          <li>Follow the official instructions to obtain the required pass and QR-coded ticket.</li>
          <li>Review your travel details and any applicable fee before completing the process.</li>
          <li>Keep your ticket and QR code accessible during your journey, and follow the instructions provided by the authorities.</li>
        </ol>
        <p className="mt-4 text-sm text-prose">Note: These are general guidance steps, not a guarantee of the portal's current workflow. Follow the instructions actually displayed on the official website.</p>
      </ProseSection>
      <Section title="Travel pass vs. ship ticket">
        <div className="overflow-x-auto rounded-xl border border-line-soft">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f5faf9]"><tr><th className="border-b border-line-soft px-3 py-2 text-left font-bold">Travel pass</th><th className="border-b border-line-soft px-3 py-2 text-left font-bold">Ship ticket</th></tr></thead>
            <tbody>
              <tr><td className="border-t border-line-soft px-3 py-2">Records or authorizes visitor access under the applicable travel-control rules.</td><td className="border-t border-line-soft px-3 py-2">QR coded Travel pass & Environmental conservation fee will included with our ship ticket.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-prose">Do not assume that a regular ticket or booking confirmation automatically satisfies every travel-pass requirement. Check that your travel documents comply with the current official rules.</p>
      </Section>
      <Section title="Before you travel">
        <ul className="grid gap-3">
          <Bullet>Confirm that your travel date falls within the permitted period.</Bullet>
          <Bullet>Check the official pass and QR-coded ticket requirements.</Bullet>
          <Bullet>Verify your ship's departure date, time and terminal.</Bullet>
          <Bullet>Confirm the applicable fare and conservation fee.</Bullet>
          <Bullet>Check the latest overnight-stay and island-access rules.</Bullet>
          <Bullet>Avoid prohibited plastics and follow environmental protection guidelines.</Bullet>
        </ul>
      </Section>
      <ProseSection title="How ShipTickets.bd can help">
        <p>ShipTickets.bd helps travellers explore Saint Martin’s ship information, reference fares, seat and cabin options, and travel guidance. We do not operate a live booking engine or real-time ticket inventory. Please verify ticket availability, current fares and travel-pass requirements through the official portal or our support team before making payment.</p>
      </ProseSection>
      <Section title="Related pages">
        <ul className="grid gap-3 sm:grid-cols-2">
          <Bullet><a href="/saint-martin-ship-ticket-price" className="font-extrabold text-brand-ink">Ship ticket price guide</a></Bullet>
          <Bullet><a href="/saint-martin-travel-rules" className="font-extrabold text-brand-ink">Travel rules</a></Bullet>
          <Bullet><a href="/saint-martin-ship" className="font-extrabold text-brand-ink">All ships directory</a></Bullet>
          <Bullet><a href="/saint-martin-guide" className="font-extrabold text-brand-ink">Saint Martin travel guide</a></Bullet>
        </ul>
      </Section>
    </SeoPage>
  )
}
