import type { Metadata } from 'next'
import { BanglaSummary } from '@/components/bangla-summary'
import Link from 'next/link'
import { SeoPage, Section, Bullet, Status, LinkCard, Schema, siteSchema, websiteSchema, faqSchema, breadcrumbSchema, whatsapp, ProseSection } from '@/components/seo-page'
import { RelatedGuides } from '@/components/related-guides'
import { LAST_REVIEWED, STATUS_LABELS, season, ships } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'

const title = 'Saint Martin ship schedule from Cox’s Bazar'
const description =
  'Check how to verify Saint Martin ship departure times, reporting times, return schedules, jetty check-in points and seasonal operating status for your travel date.'

export const metadata: Metadata = {
  title: 'Saint Martin Ship Schedule & Times',
  description,
  alternates: { canonical: 'https://www.shiptickets.bd/saint-martin-ship-schedule' },
  openGraph: {
    title: 'Saint Martin Ship Schedule & Departure Times',
    description,
    url: 'https://www.shiptickets.bd/saint-martin-ship-schedule',
    images: [{ url: '/og_image.png', width: 1200, height: 630 }],
  },
}

const faqs: [string, string][] = [
  [
    'What time do ships depart to Saint Martin?',
    'Departure times are seasonal and operator-specific, and there is no single fixed schedule across the five vessels. Confirm the reporting and departure times for your travel date.',
  ],
  [
    'How long does it take to reach Saint Martin by ship?',
    'It depends on the vessel. MV Karnafuly Express is generally quoted at around 5 hours, while MV Baro Awlia is listed at around 2–2.5 hours. Keari Sindbad and Keari Cruise & Dine publish no fixed duration. Sailing time changes with weather, sea conditions and tide.',
  ],
  [
    'How early should I arrive at the jetty?',
    'Arrive at least 30 minutes before departure for check-in and boarding. Some operators list their own reporting time, which may be earlier, so follow the time printed on your ticket.',
  ],
  [
    'Can ship schedules change due to weather?',
    'Yes. Weather, tide, sea conditions and government permission can affect both departure and return times. Confirm any change on the day of travel.',
  ],
  [
    'Is there a return sailing schedule?',
    'Return sailings depend on the current season and the operator. Confirm the return date, time and boarding point before you book a round trip.',
  ],
  [
    'Where do Saint Martin ships depart from?',
    'Most published information points to the BIWTA Nuniarchhara Jetty area in Cox’s Bazar, though boarding points can vary by season. The jetty printed on your ticket is the authority.',
  ],
]

export default function SchedulePage() {
  return (
    <SeoPage
      eyebrow="Schedule · সময়সূচি"
      title={title}
      intro={description}
      updated={LAST_REVIEWED}
      crumbs={[
        { name: 'Home', href: '/' },
        { name: 'Saint Martin ships', href: '/saint-martin-ship' },
        { name: 'Schedule' },
      ]}
    >
      <BanglaSummary path="/saint-martin-ship-schedule" />
      <Section title="Quick Answer">
        <div className="flex flex-wrap items-center gap-3">
          <Status>Verified</Status>
        </div>
        <p>The 2026–27 tourist season for Saint Martin’s Island runs from 1 November 2026 to 15 March 2027. However, the opening of the tourist season does not mean that ship services begin on the same day. Passenger ship operations are scheduled to start from 5 November 2026, subject to the necessary government approvals and operational clearance.</p>

<p>Tourist ships are expected to depart from BIWTA’s Nuniachhara Jetty in Cox’s Bazar. Regular passenger services from Teknaf are not confirmed for this season. MV Karnafuly Express, MV Baro Awlia and MV Teknaf are among the vessels preparing to operate from 5 November. Other approved vessels, including Keari Sindbad and Keari Cruise & Dine, are also expected to begin operations around the same week, subject to their individual schedules and clearances.</p>

<p>Departure and return times may vary by vessel, sailing date, sea conditions and approved operating schedules. There is no single fixed departure time or journey duration for all ships. Always confirm your vessel, travel date, reporting time and boarding jetty with the operator before departure.</p>

<p>Under the revised government guidelines, tourists can visit Saint Martin’s during the season, including overnight stays, subject to applicable travel restrictions. Passengers must also comply with the official travel-pass and QR-coded ticket requirements.</p>

<p>Please note: ShipTickets.bd provides ship information and ticket-related assistance. Schedules, fares and vessel operations may change. All information is for guidance only and does not guarantee sailing or ticket availability.</p>
      </Section>

      <Section title="November 2026 cruise schedule (Karnafuly)">
        <p className="mb-3 text-sm text-prose">Operator: Karnafuly Cruise Line Ltd · Route: Cox's Bazar ⇄ Saint Martin · Ships: MV Karnafuly Express &amp; MV Baro Awlia. Departure times subject to tide/ebb; confirm before travel.</p>
        <div className="overflow-x-auto rounded-xl border border-line-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#e3ecea] text-ink"><tr><th className="px-3 py-2 font-bold">Date</th><th className="px-3 py-2 font-bold">Day</th><th className="px-3 py-2 font-bold">CB Departure</th><th className="px-3 py-2 font-bold">SM Return</th></tr></thead>
            <tbody>
              {[
                ['05.11.2026','Thursday','07:00 AM','03:00 PM'],
                ['06.11.2026','Friday','07:00 AM','03:00 PM'],
                ['07.11.2026','Saturday','07:00 AM','03:00 PM'],
                ['08.11.2026','Sunday','08:00 AM','04:00 PM'],
                ['09.11.2026','Monday','08:00 AM','04:00 PM'],
                ['10.11.2026','Tuesday','08:00 AM','04:00 PM'],
                ['11.11.2026','Wednesday','09:00 AM','05:00 PM'],
                ['12.11.2026','Thursday','09:00 AM','05:00 PM'],
                ['13.11.2026','Friday','10:00 AM','05:00 PM'],
                ['14.11.2026','Saturday','10:00 AM','05:00 PM'],
                ['15.11.2026','Sunday','10:00 AM','05:00 PM'],
                ['16.11.2026','Monday','04:00 AM','05:00 PM'],
                ['17.11.2026','Tuesday','04:00 AM','05:00 PM'],
                ['18.11.2026','Wednesday','04:00 AM','05:00 PM'],
                ['19.11.2026','Thursday','06:00 AM','03:00 PM'],
                ['20.11.2026','Friday','06:00 AM','03:00 PM'],
                ['21.11.2026','Saturday','07:00 AM','04:00 PM'],
                ['22.11.2026','Sunday','07:00 AM','04:00 PM'],
                ['23.11.2026','Monday','07:00 AM','04:00 PM'],
                ['24.11.2026','Tuesday','07:00 AM','04:00 PM'],
                ['25.11.2026','Wednesday','08:00 AM','04:00 PM'],
                ['26.11.2026','Thursday','09:00 AM','04:00 PM'],
                ['27.11.2026','Friday','09:00 AM','04:00 PM'],
                ['28.11.2026','Saturday','10:00 AM','05:00 PM'],
                ['29.11.2026','Sunday','10:00 AM','05:00 PM'],
                ['30.11.2026','Monday','05:00 AM','03:00 PM'],
              ].map(([d,day,dep,ret]) => (
                <tr key={d} className="border-t border-line-soft"><td className="px-3 py-2">{d}</td><td className="px-3 py-2">{day}</td><td className="px-3 py-2">{dep}</td><td className="px-3 py-2">{ret}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>


        <p>
          These are the schedule details each operator has published. They are reference values, not confirmed
          sailings for your date.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#e3ecea] text-ink">
              <tr>
                <th className="px-4 py-3 font-bold">Ship</th>
                <th className="px-4 py-3 font-bold">Departure</th>
                <th className="px-4 py-3 font-bold">Journey</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <td className="px-4 py-3 font-extrabold">
                    <Link href={`/saint-martin-ship/${ship.slug}`} className="hover:text-brand-ink hover:underline">
                      {ship.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-prose">{ship.departure ?? 'Confirm for your date'}</td>
                  <td className="px-4 py-3 text-prose">{ship.journeyDuration ?? 'Confirm for your date'}</td>
                  <td className="px-4 py-3 text-prose">
                    {ship.slug === 'mv-teknaf' ? 'Sailing 2026–27' : STATUS_LABELS[ship.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-3 text-quiet">
          Confirm your operator, date, jetty and reporting time before leaving for Cox’s Bazar.
        </p>
      </Section>

      <Section title="What to confirm before you travel">
        <ul className="grid gap-3 md:grid-cols-2">
          <Bullet>Departure date and reporting time</Bullet>
          <Bullet>Designated jetty and check-in counter</Bullet>
          <Bullet>Estimated journey duration for your vessel</Bullet>
          <Bullet>Return sailing date and time</Bullet>
          <Bullet>Weather or tide-related changes</Bullet>
          <Bullet>Travel Pass and QR ticket requirements</Bullet>
        </ul>
      </Section>

      <ProseSection title="Why departure times change">
        <p>
          Passenger vessel operations depend on government permission, seasonal access, weather, tide and operator
          readiness. A departure time published for one season may not hold for the next. That is why every ship
          page on this site carries both an operating status and the date we last reviewed it, rather than a bare
          timetable that looks authoritative but is not.
        </p>
        <p>
          If a vessel is marked as needing confirmation, that is deliberate. It means we have not verified current
          operation for your season, and we would rather say so than present an unverified schedule as fact.
        </p>
      </ProseSection>

      <ProseSection title="Boarding point">
        <p>
          Most published information points to the <strong>BIWTA Nuniarchhara Jetty</strong> area in Cox’s Bazar.
          Boarding arrangements can change between seasons, and some operators have referred to other points on the
          coast. The jetty and reporting time printed on your own ticket are the authority, so check them before you
          travel.
        </p>
      </ProseSection>

      <Section title="Related information">
        <div className="grid gap-4 md:grid-cols-2">
          <LinkCard
            href="/saint-martin-ship"
            title="Compare Saint Martin ships"
            text="All five vessels with fares, seating classes and cabins."
          />
          <LinkCard
            href="/saint-martin-ship-ticket-price"
            title="Ticket price guide"
            text="Verified fares for every ship, class and cabin type."
          />
          <LinkCard
            href="/routes/coxs-bazar-to-saint-martin"
            title="Cox’s Bazar to Saint Martin route"
            text="What the crossing involves and what to expect."
          />
          <LinkCard
            href="/saint-martin-travel-pass"
            title="Travel Pass and QR ticket"
            text="Seasonal entry requirements to check before you travel."
          />
          <LinkCard
            href="/saint-martin-travel-rules"
            title="Travel rules and restrictions"
            text="Current rules that can affect your sailing."
          />
          <LinkCard
            href="/saint-martin-guide"
            title="Saint Martin travel guide"
            text="Planning advice and what to do once you arrive."
          />
        </div>
      </Section>

      <RelatedGuides
        title="Before you travel"
        intro="Planning guides from our sister brand, useful once your sailing is confirmed."
      />

      <FaqAccordion items={faqs} />

      <ProseSection title="Confirm the schedule for your date">
        <p className="mb-4">
          Send your travel date and preferred vessel. We will confirm the current sailing, reporting time and
          boarding point before you pay.
        </p>
        <ContactLink href={`${whatsapp}Hello ShipTickets.bd, please confirm the current schedule for my travel date.`} kind="whatsapp" eventLabel="schedule_whatsapp" className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-extrabold text-white">
          Confirm on WhatsApp
        </ContactLink>
      </ProseSection>

      <Schema
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            siteSchema,
            websiteSchema,
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Saint Martin ships', url: '/saint-martin-ship' },
              { name: 'Schedule', url: '/saint-martin-ship-schedule' },
            ]),
            faqSchema(faqs),
          ],
        }}
      />
    </SeoPage>
  )
}
