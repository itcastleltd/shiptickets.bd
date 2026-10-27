import type { Metadata } from 'next'
import Link from 'next/link'
import { SeoPage, Section, Bullet, ProseSection, Schema, siteSchema, websiteSchema, breadcrumbSchema, faqSchema } from '@/components/seo-page'
import { BanglaSummary } from '@/components/bangla-summary'
import { FaqAccordion } from '@/components/faq-accordion'
import { LinkCard } from '@/components/seo-page'
import { ContactLink } from '@/components/contact-link'
import { whatsapp } from '@/components/seo-page'

export const metadata: Metadata = {
  title: 'Booking Policy – Saint Martin Ship Tickets | ShipTickets.bd',
  description: 'Read ShipTickets.bd\'s booking policy for Saint Martin ship tickets, passenger information, NID, Travel Pass, payment, cancellation and rescheduling.',
  keywords: ['Saint Martin ship ticket booking policy', 'ShipTickets.bd booking policy', 'ship ticket cancellation policy Bangladesh', 'Saint Martin ticket booking rules', 'Travel Pass requirements'],
  alternates: { canonical: 'https://www.shiptickets.bd/booking-policy' },
  openGraph: {
    title: 'Booking Policy – Saint Martin Ship Tickets | ShipTickets.bd',
    description: 'Read ShipTickets.bd\'s booking policy for Saint Martin ship tickets, passenger information, NID, Travel Pass, payment, cancellation and rescheduling.',
    url: 'https://www.shiptickets.bd/booking-policy',
    type: 'website',
    images: [{ url: '/og_image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Booking Policy – Saint Martin Ship Tickets | ShipTickets.bd', description: 'Read ShipTickets.bd\'s booking policy for Saint Martin ship tickets.' },
}

const faqs: [string, string][] = [
  ['How can I book a Saint Martin ship ticket?', 'Contact ShipTickets.bd by phone or WhatsApp at +880 1718-116799. Share your travel date, passenger count and preferred seat or cabin category. Confirm the final fare and availability before payment.'],
  ['What information is required to issue a ticket?', 'Depending on operator requirements, you may need to provide your name, mobile number, identification details, date of birth, journey date, passenger count and preferred seat or cabin category.'],
  ['Are ship tickets refundable?', 'Refund eligibility depends on the ticket conditions and the relevant operator\'s cancellation policy. Confirm the applicable terms before payment.'],
  ['What should I do if my ticket has no QR code or Travel Pass?', 'If a QR code or Travel Pass is required but missing, contact the relevant operator or ShipTickets.bd support for verification before travelling.'],
  ['What happens if a ship departure is cancelled?', 'The available options depend on the operator\'s applicable policy and the reason for cancellation. Contact support to confirm whether rescheduling, a refund or another arrangement is available.'],
  ['How can I contact ShipTickets.bd?', 'For booking assistance and ticket-related questions, contact ShipTickets.bd by phone or WhatsApp at +880 1718-116799, or visit https://www.shiptickets.bd/.'],
]

export default function BookingPolicyPage() {
  return (
    <SeoPage eyebrow="Policy · নীতিমালা" title="Booking Policy" intro="ShipTickets.bd provides ship-ticket information and booking assistance for travellers planning a journey to Saint Martin Island, Bangladesh. Ticket availability, fares, required passenger information and cancellation conditions may vary by operator, travel date and applicable government regulations." crumbs={[{ name: 'Home', href: '/' }, { name: 'Booking Policy' }]}>
      <BanglaSummary path="/booking-policy" />
      <ProseSection title="Booking and Ticket Issuance Policy">
        <p>Before booking a Saint Martin ship ticket, confirm your travel date, vessel, seat or cabin category, passenger count and applicable ticket conditions. Passenger information and travel documents must meet the requirements of the relevant operator and applicable government regulations.</p>
        <p className="mt-3">After ticket issuance, check the passenger details, journey date, vessel name, seat or cabin category and any required QR code or Travel Pass information. Report discrepancies to ShipTickets.bd support before travelling.</p>
      </ProseSection>
      <Section title="Required Passenger Information">
        <p className="mb-3">Depending on the vessel and applicable ticketing requirements, passengers may need to provide:</p>
        <ul className="grid gap-2 md:grid-cols-2">
          <Bullet>Full name</Bullet><Bullet>Active mobile number</Bullet><Bullet>Email address</Bullet><Bullet>NID or other accepted identification details</Bullet><Bullet>Date of birth</Bullet><Bullet>Journey date and return date, where applicable</Bullet><Bullet>Vessel name and preferred seat or cabin category</Bullet><Bullet>Number of passengers</Bullet><Bullet>Other information required by the operator</Bullet>
        </ul>
        <p className="mt-3">Please provide accurate information and share only the personal data necessary for ticket issuance.</p>
      </Section>
      <Section title="NID, QR Code and Travel Pass">
        <p>Identification requirements, QR codes and Travel Pass rules are subject to current government regulations and operator instructions. Confirm any passenger-per-ID limits before booking.</p>
        <p className="mt-3">If a required QR code or Travel Pass is missing from an issued ticket, contact the relevant operator or ShipTickets.bd support for verification before travelling.</p>
      </Section>
      <Section title="Online Booking Procedure">
        <p>To request booking assistance, contact ShipTickets.bd by phone or WhatsApp at +880 1718-116799.</p>
        <p className="mt-3">Please provide your intended travel date, passenger count, preferred vessel, seat or cabin category, and return-trip requirements. Confirm the final fare, ticket availability, sailing schedule and applicable conditions before making payment.</p>
        <p className="mt-3">ShipTickets.bd provides information and booking assistance. Live inventory and ticket issuance are subject to the relevant operator's systems and confirmation.</p>
      </Section>
      <Section title="Payment Policy">
        <p>Before making a payment, verify your booking details, final fare and approved payment instructions with ShipTickets.bd support. Check the recipient name, account number, payment type and transaction amount carefully.</p>
        <p className="mt-3">Keep your transaction receipt until your booking and ticket issuance have been confirmed. If confirmation is delayed, contact support before making another payment for the same booking.</p>
        <p className="mt-3 font-bold">Security notice: Never share your banking PIN, password or one-time password (OTP) with anyone.</p>
      </Section>
      <Section title="Cancellation, Refund and Rescheduling Policy">
        <p>Cancellation, refunds and rescheduling are governed by the applicable operator policy and ticket conditions. Some tickets may be non-cancellable and non-refundable.</p>
        <p className="mt-3">Before payment, confirm: whether cancellation is permitted; applicable cancellation deadlines and charges; whether documented medical emergencies qualify for an exception; rescheduling eligibility and any additional fees; options if the operator cancels or changes the sailing; refund conditions and expected processing time.</p>
        <p className="mt-3">No refund or cancellation exception should be assumed unless it is expressly permitted under the applicable ticket terms.</p>
      </Section>
      <Section title="Missed Departure and Schedule Changes">
        <p>Passengers should confirm the boarding point, reporting time and departure schedule before travelling. Refunds or alternative travel arrangements for missed departures depend on the applicable operator policy.</p>
        <p className="mt-3">Sailings may be delayed, rescheduled or cancelled due to weather, sea conditions, government instructions or operational requirements. Check for updates before departure.</p>
      </Section>
      <Section title="Lost Tickets and Incorrect Information">
        <p>If a ticket is lost, passenger information is incorrect, or a QR code or Travel Pass cannot be verified, contact ShipTickets.bd support promptly. Identity verification, ticket replacement and any corrective action are subject to the relevant operator's rules.</p>
      </Section>
      <Section title="Important Travel Checklist">
        <ul className="grid gap-2 md:grid-cols-2">
          <Bullet>Your ticket and booking confirmation</Bullet><Bullet>Correct passenger details</Bullet><Bullet>Required identification and Travel Pass documentation</Bullet><Bullet>Confirmed vessel name, boarding point and reporting time</Bullet><Bullet>Reviewed ticket conditions and return-trip details</Bullet><Bullet>Saved your payment receipt</Bullet>
        </ul>
      </Section>
      <FaqAccordion items={faqs} heading="Frequently asked questions" />
      <Section title="Related information">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard href="/saint-martin-travel-rules" title="Travel rules" text="Current restrictions affecting your sailing." />
          <LinkCard href="/saint-martin-travel-pass" title="Travel Pass" text="QR ticket and authorization information." />
          <LinkCard href="/how-we-verify-information" title="How we verify" text="Why fares are reference values and how we check them." />
          <LinkCard href="/contact" title="Contact" text="Reach our support team on WhatsApp or phone." />
        </div>
      </Section>
      <Section title="Contact ShipTickets.bd">
        <p>For assistance with ticket booking, passenger details, fare verification, Travel Pass information or ticket-related issues, contact our support team.</p>
        <div className="mt-4">
          <ContactLink href={`${whatsapp}Hello ShipTickets.bd, I have a question about the booking policy.`} kind="whatsapp" eventLabel="booking_policy_whatsapp" className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#13734f]">
            WhatsApp for booking help
          </ContactLink>
        </div>
      </Section>
      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Booking Policy' }])] }} />
    </SeoPage>
  )
}
