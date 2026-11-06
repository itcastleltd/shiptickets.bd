import Link from 'next/link'
import { BadgeCheck, CircleDollarSign, FileText, ShieldAlert, Undo2 } from 'lucide-react'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, CtaBand, GuideHero, IconCards, KitSection, LinkGrid, pageMeta, pageUrl } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema } from '@/components/seo-page'

const path = '/booking-policy'
const pageTitle = 'Booking Policy – Saint Martin Ship Tickets'
const h1 = 'Saint Martin Ship Ticket Booking Policy'
const description = 'Read ShipTickets.bd’s booking policy for Saint Martin ship tickets, passenger information, NID, Travel Pass, payment, cancellation and rescheduling.'

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['Saint Martin ship ticket booking policy', 'ShipTickets.bd booking policy', 'ship ticket cancellation policy Bangladesh', 'Saint Martin ticket booking rules', 'Travel Pass requirements'],
})

const faqs: [string, string][] = [
  ['How can I book a Saint Martin ship ticket?', 'Book online on our booking page, or contact ShipTickets.bd by phone or WhatsApp at +880 1718-116799. Online, you choose your ship, dates and seat or cabin, add your details, pay the advance shown at checkout and enter your transaction ID.'],
  ['Is my booking confirmed after I pay the advance online?', 'Not yet. You receive a booking reference, then send your payment screenshot, NID number and date of birth on WhatsApp. Our team checks your payment and confirms the ticket with the operator. Your booking is final when your ticket is issued.'],
  ['When do I pay the rest of the fare?', 'You pay the advance when you book online, and the balance when your ticket is issued, collected or delivered.'],
  ['What if my seat is not available after I pay the advance?', 'Our team will contact you on WhatsApp. You can choose another date or ship, or get your advance back in full.'],
  ['What information is required to issue a ticket?', 'Depending on operator requirements, you may need to provide your name, mobile number, identification details, date of birth, journey date, passenger count and preferred seat or cabin category.'],
  ['Are ship tickets refundable?', 'Refund eligibility depends on the ticket conditions and the relevant operator’s cancellation policy. Confirm the applicable terms before payment.'],
  ['What should I do if my ticket has no QR code or Travel Pass?', 'If a QR code or Travel Pass is required but missing, contact the relevant operator or ShipTickets.bd support for verification before travelling.'],
  ['What happens if a ship departure is cancelled?', 'The available options depend on the operator’s applicable policy and the reason for cancellation. Contact support to confirm whether rescheduling, a refund or another arrangement is available.'],
  ['How can I contact ShipTickets.bd?', 'For booking assistance and ticket-related questions, contact ShipTickets.bd by phone or WhatsApp at +880 1718-116799.'],
]

const SECTIONS = [
  { id: 'issuance', title: 'Booking and ticket issuance' },
  { id: 'information', title: 'Required passenger information' },
  { id: 'documents', title: 'NID, QR code and Travel Pass' },
  { id: 'procedure', title: 'Booking procedure' },
  { id: 'payment', title: 'Payment policy' },
  { id: 'cancellation', title: 'Cancellation, refund and rescheduling' },
  { id: 'missed', title: 'Missed departure and schedule changes' },
  { id: 'lost', title: 'Lost tickets and incorrect information' },
  { id: 'checklist', title: 'Travel checklist' },
]

function PolicySection({ index, children }: { index: number; children: React.ReactNode }) {
  const { id, title } = SECTIONS[index]
  return (
    <section id={id} className="scroll-mt-24 border-t border-line-soft pt-6 first:border-t-0 first:pt-0">
      <h2 className="t-subtitle text-ink">{title}</h2>
      <div className="t-body mt-2 space-y-3 text-prose">{children}</div>
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  return <ul className="t-small grid gap-2 sm:grid-cols-2">{items.map((item) => <li key={item} className="flex gap-2"><BadgeCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" /> {item}</li>)}</ul>
}

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Booking Policy' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">Confirm your fare and ticket conditions before you pay.</strong> Availability, fares and cancellation terms vary by operator, travel date and government rules.</>}
      bangla="টাকা দেওয়ার আগে ভাড়া ও টিকেটের শর্ত জেনে নিন।"
      updated="6 November 2026"
    />
  )
}

export default function BookingPolicyPage() {
  return (
    <SeoPage eyebrow="Policy · নীতিমালা" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="summary" title="The short version">
        <IconCards items={[
          { icon: FileText, heading: 'Check your details', text: 'Your name, date, ship and seat should be right before and after your ticket is issued.' },
          { icon: CircleDollarSign, heading: 'Check, then pay', text: 'Check your total, advance and payment details before you pay, and keep your receipt.' },
          { icon: Undo2, heading: 'Refunds', text: 'These depend on the operator’s terms. Some tickets can’t be cancelled or refunded.' },
          { icon: ShieldAlert, heading: 'Stay safe', text: 'Never share your banking PIN, password or OTP with anyone.' },
        ]} />
      </KitSection>

      <div className="mb-12 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <nav aria-label="On this page" className="mb-6 rounded-2xl bg-[#f7fbfa] p-4 lg:sticky lg:top-24 lg:mb-0">
          <p className="text-sm font-extrabold text-ink">On this page</p>
          <ul className="mt-1 grid sm:grid-cols-2 lg:grid-cols-1">
            {SECTIONS.map(({ id, title }) => <li key={id}><a href={`#${id}`} className="flex min-h-11 items-center text-sm font-semibold text-brand-ink underline-offset-4 hover:underline">{title}</a></li>)}
          </ul>
        </nav>
        <div className="grid min-w-0 max-w-3xl gap-6">
          <PolicySection index={0}>
            <p>Before booking a Saint Martin ship ticket, confirm your travel date, vessel, seat or cabin category, passenger count and applicable ticket conditions. Passenger information and travel documents must meet the requirements of the relevant operator and applicable government regulations.</p>
            <p>After ticket issuance, check the passenger details, journey date, vessel name, seat or cabin category and any required QR code or Travel Pass information. Report discrepancies to ShipTickets.bd support before travelling.</p>
          </PolicySection>
          <PolicySection index={1}>
            <p>Depending on the vessel and applicable ticketing requirements, passengers may need to provide:</p>
            <CheckList items={['Full name', 'Active mobile number', 'Email address', 'NID or other accepted identification details', 'Date of birth', 'Journey date and return date, where applicable', 'Vessel name and preferred seat or cabin category', 'Number of passengers', 'Other information required by the operator']} />
            <p>Please provide accurate information and share only the personal data necessary for ticket issuance.</p>
          </PolicySection>
          <PolicySection index={2}>
            <p>Identification requirements, QR codes and Travel Pass rules are subject to current government regulations and operator instructions. Confirm any passenger-per-ID limits before booking.</p>
            <p>If a required QR code or Travel Pass is missing from an issued ticket, contact the relevant operator or ShipTickets.bd support for verification before travelling.</p>
          </PolicySection>
          <PolicySection index={3}>
            <p>You can book online on our <Link href="/booking" rel="nofollow" className="font-bold text-brand-ink underline underline-offset-2">booking page</Link>, or by phone or WhatsApp at +880 1718-116799.</p>
            <ol className="grid list-decimal gap-1.5 pl-5">
              <li>Choose your ship, trip type, dates, seat or cabin, and number of tickets.</li>
              <li>Enter the passenger’s full name as on their NID, a mobile number and, if you wish, an email address and co-passenger names.</li>
              <li>Pay the advance shown at checkout by bKash or bank transfer, then enter your Transaction ID (TrxID).</li>
              <li>Save your booking reference, then send your payment screenshot and each passenger’s NID number and date of birth on WhatsApp.</li>
              <li>Our team checks your payment and confirms with the operator, then sends your QR-coded ticket and Travel Pass on WhatsApp.</li>
            </ol>
            <p>A submitted booking is not final. Your booking is final when your ticket is issued. We do not show live seat availability, and ticket issuance is subject to the relevant operator’s systems and confirmation. If your choice is not available, our team will contact you on WhatsApp, and you can choose another date or ship, or get your advance back in full.</p>
            <p>To book by phone or WhatsApp, share your travel date, passenger count, preferred vessel, seat or cabin category, and return-trip requirements. To protect against misuse, we limit how many online bookings one mobile number can make in an hour. For a larger booking, contact us on WhatsApp.</p>
          </PolicySection>
          <PolicySection index={4}>
            <p>Online bookings require an advance, shown with your total and balance before you pay. You pay the balance when your ticket is issued, collected or delivered. Before making a payment, verify your booking details and the payment instructions on the payment step, or ask ShipTickets.bd support. Check the recipient name, account number, payment type and transaction amount carefully.</p>
            <p>Each Transaction ID can be used for one booking only. Our team checks every payment by hand, so a submitted Transaction ID does not mean your payment has been verified.</p>
            <p>Keep your transaction receipt until your booking and ticket issuance have been confirmed. If confirmation is delayed, contact support before making another payment for the same booking.</p>
            <p className="rounded-xl bg-[#fff8ee] p-3 font-bold text-ink">Security notice: Never share your banking PIN, password or one-time password (OTP) with anyone.</p>
          </PolicySection>
          <PolicySection index={5}>
            <p>If we cannot confirm the seat or cabin you booked online, you can choose another date or ship, or get your advance back in full.</p>
            <p>Once your ticket is issued, cancellation, refunds and rescheduling are governed by the applicable operator policy and ticket conditions. Some tickets may be non-cancellable and non-refundable.</p>
            <p>Before payment, confirm:</p>
            <CheckList items={['Whether cancellation is permitted', 'Applicable cancellation deadlines and charges', 'Whether documented medical emergencies qualify for an exception', 'Rescheduling eligibility and any additional fees', 'Options if the operator cancels or changes the sailing', 'Refund conditions and expected processing time']} />
            <p>No refund or cancellation exception should be assumed unless it is expressly permitted under the applicable ticket terms.</p>
          </PolicySection>
          <PolicySection index={6}>
            <p>Passengers should confirm the boarding point, reporting time and departure schedule before travelling. Refunds or alternative travel arrangements for missed departures depend on the applicable operator policy.</p>
            <p>Sailings may be delayed, rescheduled or cancelled due to weather, sea conditions, government instructions or operational requirements. Check for updates before departure.</p>
          </PolicySection>
          <PolicySection index={7}>
            <p>If a ticket is lost, passenger information is incorrect, or a QR code or Travel Pass cannot be verified, contact ShipTickets.bd support promptly. Identity verification, ticket replacement and any corrective action are subject to the relevant operator’s rules.</p>
          </PolicySection>
          <PolicySection index={8}>
            <CheckList items={['Your ticket and booking confirmation', 'Correct passenger details', 'Required identification and Travel Pass documentation', 'Confirmed vessel name, boarding point and reporting time', 'Reviewed ticket conditions and return-trip details', 'Saved your payment receipt']} />
          </PolicySection>
        </div>
      </div>

      <BanglaBox id="bangla" title="বুকিং নীতিমালা, সংক্ষেপে">
        <p>টিকেট বুকিং, যাত্রীর তথ্য, পেমেন্ট, ট্রাভেল পাস, টিকেট বাতিল ও তারিখ বদলের নিয়ম এই পাতায় আছে। টাকা দেওয়ার আগে ভাড়া ও টিকেটের শর্ত জেনে নিন, আর পেমেন্টের রসিদ রেখে দিন।</p>
        <p>অনলাইনে বুকিং করলে অগ্রিম পেমেন্ট করে ট্রানজেকশন আইডি দিন, তারপর WhatsApp-এ স্ক্রিনশট, এনআইডি নম্বর ও জন্মতারিখ পাঠান। আমাদের টিম পেমেন্ট যাচাই করার পর টিকেট দেয়, আর টিকেট হাতে পেলে তবেই বুকিং চূড়ান্ত হয়। বাকি টাকা দিতে হয় টিকেট ইস্যু, সংগ্রহ বা ডেলিভারির সময়। সিট না থাকলে আপনি অন্য তারিখ বা জাহাজ বেছে নিতে পারবেন, অথবা অগ্রিমের পুরো টাকা ফেরত পাবেন।</p>
        <p>টাকা ফেরত পাওয়া যাবে কি না, তা জাহাজ কর্তৃপক্ষের নিয়মের ওপর নির্ভর করে। কাউকে কখনো আপনার পিন, পাসওয়ার্ড বা ওটিপি দেবেন না।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Booking policy questions" id="faq" />

      <KitSection title="Related information">
        <LinkGrid links={[
          ['/blog/saint-martin-ship-ticket-booking-guide', 'Step-by-step booking guide'],
          ['/saint-martin-travel-pass', 'Travel Pass and QR ticket'],
          ['/saint-martin-travel-rules', 'Travel rules and restrictions'],
          ['/how-we-verify-information', 'How we verify information'],
          ['/contact', 'Contact our support team'],
        ]} />
      </KitSection>

      <p className="t-small mb-6 text-quiet">See also our <Link href="/privacy-policy" className="font-bold text-brand-ink underline underline-offset-2">privacy policy</Link>.</p>

      <CtaBand title="A question about your booking?" text="Our support team can help with details, fares and ticket issues." message="Hello ShipTickets.bd, I have a question about the booking policy." eventLabel="booking_policy_whatsapp" />

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Booking Policy', url: path }])] }} />
    </SeoPage>
  )
}
