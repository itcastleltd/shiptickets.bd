import { Clock, Mail, MapPin, Megaphone, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { FaqAccordion } from '@/components/faq-accordion'
import { BanglaBox, GuideHero, KitSection, LinkGrid, pageMeta, pageUrl, phoneHref } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, faqSchema, siteSchema, websiteSchema, whatsapp } from '@/components/seo-page'
import { PHONE_NUMBER, site } from '@/lib/ships'

const path = '/contact'
const pageTitle = 'Saint Martin Ship Ticket Contact Number'
const description = `Saint Martin ship ticket contact number: call or WhatsApp ShipTickets.bd on ${PHONE_NUMBER} for fares, availability and booking help.`
const askWhatsApp = `${whatsapp}${encodeURIComponent('Hello ShipTickets.bd, I need help with Saint Martin ship tickets.')}`

export const metadata = pageMeta({
  title: pageTitle,
  description,
  path,
  keywords: ['saint martin ship ticket contact number', 'saint martin ship ticket number', 'shiptickets.bd contact', 'সেন্টমার্টিন জাহাজের টিকেট নাম্বার'],
})

const faqs: [string, string][] = [
  ['What is the Saint Martin ship ticket contact number?', `You can reach ShipTickets.bd for Saint Martin ship tickets on ${PHONE_NUMBER}, by phone or WhatsApp.`],
  ['What are your support hours?', `Our support hours are ${site.supportHours}. WhatsApp messages are usually answered the same day within these hours.`],
  ['What should I send to get a fare?', 'Send your travel date, passenger count, preferred ship or seat class, and whether you want one way or round trip.'],
  ['Where is the ShipTickets.bd office?', `Our office is at ${site.office}.`],
  ['সেন্টমার্টিন জাহাজের টিকেটের জন্য কোন নম্বরে যোগাযোগ করব?', `ফোন বা WhatsApp-এ ${PHONE_NUMBER} নম্বরে যোগাযোগ করুন। যাত্রার তারিখ, যাত্রীর সংখ্যা ও পছন্দের জাহাজ জানালে আমরা দ্রুত সাহায্য করতে পারব।`],
]

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Contact' }]}
      h1={pageTitle}
      lede={<><strong className="font-extrabold text-ink">Call or WhatsApp ShipTickets.bd on <span className="whitespace-nowrap">{PHONE_NUMBER}</span>.</strong> We confirm fares, availability and schedules before you pay.</>}
      bangla="টিকেট, ভাড়া বা সময়সূচি জানতে ফোন বা WhatsApp করুন।"
      updated="6 November 2026"
    >
      <div className="mt-5 grid max-w-xl gap-2 sm:grid-cols-2">
        <ContactLink href={phoneHref} kind="phone" eventLabel="contact_page_call" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] px-5 text-base font-extrabold text-white transition-colors hover:bg-[#1d3045]"><Phone size={18} aria-hidden="true" /> Call now</ContactLink>
        <ContactLink href={askWhatsApp} target="_blank" rel="noopener noreferrer" kind="whatsapp" eventLabel="contact_page_whatsapp" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 text-base font-extrabold text-white transition-colors hover:bg-brand-ink-hover"><MessageCircle size={18} aria-hidden="true" /> WhatsApp</ContactLink>
      </div>
    </GuideHero>
  )
}

const rowIcon = 'grid size-11 shrink-0 place-items-center rounded-xl bg-[#e4f2ee] text-brand-ink'

export default function ContactPage() {
  return (
    <SeoPage eyebrow="Contact · যোগাযোগ" title={pageTitle} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <KitSection id="ways" title="Ways to reach our ticket team">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
            <span className={rowIcon}><MessageCircle size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="font-extrabold text-ink">WhatsApp</h3><p className="t-small mt-1 text-prose">The fastest way to get your fare and availability, and to send your details.</p></div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
            <span className={rowIcon}><Phone size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="font-extrabold text-ink">Phone</h3><p className="t-small mt-1 text-prose">Call <a href={phoneHref} className="font-bold text-brand-ink underline underline-offset-2">{PHONE_NUMBER}</a> during support hours for ticket and booking questions.</p></div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
            <span className={rowIcon}><Mail size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="font-extrabold text-ink">Email</h3><p className="t-small mt-1 break-words text-prose">For a written reply or a fare breakdown, write to <a href={`mailto:${site.email}`} className="font-bold text-brand-ink underline underline-offset-2">{site.email}</a>.</p></div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
            <span className={rowIcon}><Megaphone size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="font-extrabold text-ink">Facebook</h3><p className="t-small mt-1 text-prose">Follow <a href="https://www.facebook.com/shiptickets" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-ink underline underline-offset-2">our Facebook page</a> for season and ship updates.</p></div>
          </div>
        </div>
      </KitSection>

      <KitSection id="send" title="What to send us for a fast reply">
        <div className="rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
          <ul className="t-small grid gap-2 text-prose sm:grid-cols-2">
            {['Your travel date, and return date if needed', 'Number of passengers', 'Your preferred ship, seat class or cabin', 'One way or round trip'].map((item) => <li key={item} className="flex gap-2"><ShieldCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" /> {item}</li>)}
          </ul>
          <p className="t-small mt-4 text-prose">Confirm the fare, availability and cancellation terms with our team before you send payment.</p>
        </div>
      </KitSection>

      <KitSection id="office" title="Support hours and office">
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
            <span className={rowIcon}><Clock size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="font-extrabold text-ink">Support hours</h3><p className="t-small mt-1 text-prose">{site.supportHours}. WhatsApp messages are usually answered the same day within these hours.</p></div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
            <span className={rowIcon}><MapPin size={20} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="font-extrabold text-ink">Office</h3><p className="t-small mt-1 text-prose">{site.office}</p></div>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line-soft">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.897587746245!2d90.39001387511516!3d23.75103117866998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9c5182ad5f1%3A0x2192fb66214a585e!2sSaint%20Martin%20Ship%20Tickets!5e0!3m2!1sen!2sbd!4v1790530440820!5m2!1sen!2sbd" width="600" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="ShipTickets.bd on Google Maps" className="h-[260px] w-full md:h-[320px]" />
        </div>
      </KitSection>

      <BanglaBox id="bangla" title="সেন্টমার্টিন জাহাজের টিকেটের জন্য যোগাযোগ">
        <p>টিকেট, ভাড়া বা সময়সূচি জানতে ফোন বা WhatsApp-এ যোগাযোগ করুন: <a href={phoneHref} className="font-bold text-brand-ink underline underline-offset-2">{PHONE_NUMBER}</a>। সাপোর্ট চলে রবি থেকে বৃহস্পতিবার, সকাল ৯টা থেকে সন্ধ্যা ৬টা। অফিস: ৩৩, হাফিজ ম্যানসন (১ম তলা), কারওয়ান বাজার, ঢাকা ১২১৫।</p>
        <p>আপনার যাত্রার তারিখ, যাত্রীর সংখ্যা ও পছন্দের জাহাজ জানালে আমরা দ্রুত সাহায্য করতে পারব।</p>
      </BanglaBox>

      <FaqAccordion items={faqs} heading="Contact questions" id="faq" />

      <KitSection title="Find answers yourself">
        <LinkGrid links={[
          ['/saint-martin-ship-ticket-price', 'Saint Martin ship ticket prices'],
          ['/saint-martin-ship-schedule', 'Saint Martin ship schedule'],
          ['/blog/saint-martin-ship-ticket-booking-guide', 'How to book your ticket'],
          ['/booking-policy', 'Booking policy'],
          ['/saint-martin-travel-pass', 'Saint Martin Travel Pass'],
          ['/about', 'About ShipTickets.bd'],
        ]} />
      </KitSection>

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'ContactPage', name: 'Contact ShipTickets.bd', url: pageUrl(path), about: { '@id': 'https://www.shiptickets.bd/#organization' } }, faqSchema(faqs), breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact', url: path }])] }} />
    </SeoPage>
  )
}
