import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SeasonBar } from '@/components/season-bar'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '@/lib/contact'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This page could not be found. See Saint Martin ship tickets, fares and schedules on ShipTickets.bd.',
  robots: { index: false, follow: true },
}

const LINKS = [
  { href: '/saint-martin-ship', title: 'Compare all 5 ships', text: 'Seats, cabins and fares side by side' },
  { href: '/saint-martin-ship-ticket-price', title: 'Ticket prices', text: 'Every seat and cabin fare for 2026–27' },
  { href: '/saint-martin-ship-schedule', title: 'Ship schedule', text: 'Departure and return times by date' },
  { href: '/blog', title: 'সেন্টমার্টিন ব্লগ', text: 'ভাড়া, নিয়ম ও ভ্রমণের গাইড', bangla: true },
]

export default function NotFound() {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I need help with a Saint Martin ship ticket.')}`
  const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
  return (
    <main id="main" className="min-h-screen bg-white text-ink">
      <SeasonBar />
      <Header />
      <section className="bg-[#f7fbfa]">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-5 md:py-16">
          <p className="text-sm font-extrabold text-brand-ink">Error 404</p>
          <h1 className="t-display mt-2">We couldn’t find this page</h1>
          <p lang="bn" className="mt-2 font-semibold text-prose">এই পাতাটি খুঁজে পাওয়া যায়নি।</p>
          <p className="t-body mt-3 max-w-xl text-prose">The link may be old, or the address may have a typing mistake. You can still find your ship ticket from here.</p>
          <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap">
            <Link href={BOOKING_ENABLED ? '/booking' : '/'} rel={BOOKING_ENABLED ? 'nofollow' : undefined} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-ink px-6 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">{BOOKING_ENABLED ? 'Book a ticket' : 'Go to the home page'}</Link>
            <ContactLink href={whatsappHref} kind="whatsapp" eventLabel="not_found_whatsapp" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink"><MessageCircle size={17} aria-hidden="true" /> Ask on WhatsApp</ContactLink>
            <ContactLink href={phoneHref} kind="phone" eventLabel="not_found_phone" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink"><Phone size={17} aria-hidden="true" /> {PHONE_NUMBER}</ContactLink>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-8 md:px-5 md:py-12">
        <h2 className="t-title">Popular pages</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} lang={item.bangla ? 'bn' : undefined} className="group flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-line-soft bg-white p-4 transition duration-200 hover:border-brand-ink hover:shadow-card">
              <span className="min-w-0">
                <span className="block font-extrabold text-ink">{item.title}</span>
                <span className="t-small mt-0.5 block text-prose">{item.text}</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
