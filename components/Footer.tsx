import Image from 'next/image'
import Link from 'next/link'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { FaFacebookF } from 'react-icons/fa'
import { ContactLink } from '@/components/contact-link'
import { FooterGroup } from '@/components/footer-group'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { PHONE_NUMBER, WHATSAPP_NUMBER, isPreBooking, ships, site } from '@/lib/ships'

const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I need help with a Saint Martin ship ticket.')}`
const PAYMENT_OPTIONS = [
  { src: '/logo/pay-bkash.png', alt: 'bKash', width: 72, height: 72, className: 'h-6', label: 'bKash' },
  { src: '/logo/pay-bangla-qr.png', alt: 'Bangla QR', width: 59, height: 72, className: 'h-7' },
  { src: '/logo/pay-visa.png', alt: 'Visa', width: 222, height: 72, className: 'h-4' },
  { src: '/logo/pay-bank.png', alt: 'Southeast Bank', width: 100, height: 72, className: 'h-5', label: 'Bank transfer' },
]

const linkClass = 'flex min-h-11 items-center text-sm text-prose transition-colors hover:text-brand-ink lg:min-h-8'
const contactRow = 'flex min-h-11 items-center gap-2.5 text-sm text-prose transition-colors hover:text-brand-ink lg:min-h-8'

const linkGroups = [
  {
    heading: 'Tickets & prices',
    links: [
      ...(BOOKING_ENABLED ? [{ href: '/booking', label: 'Book online' }] : []),
      { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
      { href: '/saint-martin-cabin-price', label: 'Cabin & class prices' },
      { href: '/cheapest-saint-martin-ship-ticket', label: 'Cheapest ticket' },
      { href: '/saint-martin-ship-schedule', label: 'Ship schedule' },
    ],
  },
  {
    heading: 'Travel information',
    links: [
      { href: '/saint-martin-travel-pass', label: 'Travel Pass' },
      { href: '/saint-martin-travel-rules', label: 'Travel rules' },
      { href: '/saint-martin-guide', label: 'Travel guide' },
      { href: '/routes/coxs-bazar-to-saint-martin', label: 'Cox’s Bazar route' },
      { href: '/routes/coxs-bazar-to-saint-martin-distance', label: 'Distance & journey time' },
      { href: '/saint-martin-trip-cost', label: 'Trip cost' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/how-we-verify-information', label: 'How we verify' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

const LinkList = ({ links }: { links: { href: string; label: string }[] }) => (
  <ul>
    {links.map((link) => <li key={link.href}><Link href={link.href} className={linkClass}>{link.label}</Link></li>)}
  </ul>
)

/**
 * Help first, then the site's pages, then who runs it.
 *
 * Bottom padding clears the fixed call bar on phones. It belongs here because the
 * footer is the last element on the page.
 */
export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-[#f7fbfa] px-4 pb-24 pt-5 md:px-5 lg:px-8 lg:pb-8 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <section aria-labelledby="footer-help" className="rounded-2xl border border-line-soft bg-white p-5 shadow-card lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-6">
          <div>
            <h2 id="footer-help" className="t-subtitle text-ink">Need help with your ticket?</h2>
            <p lang="bn" className="mt-0.5 text-sm font-semibold text-brand-ink">টিকেট নিয়ে সাহায্য দরকার?</p>
            <p className="t-small mt-1 flex items-center gap-1.5 text-prose"><Clock size={14} aria-hidden="true" className="shrink-0 text-brand-ink" /> {site.supportHours}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 lg:mt-0 lg:flex lg:shrink-0">
            <ContactLink href={whatsappHref} kind="whatsapp" eventLabel="footer_whatsapp" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover lg:px-6">
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp
            </ContactLink>
            <ContactLink href={phoneHref} kind="phone" eventLabel="footer_call" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink lg:px-6">
              <Phone size={17} aria-hidden="true" /> Call us
            </ContactLink>
          </div>
        </section>

        <div className="mt-3 grid lg:mt-10 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-8">
          <nav aria-label="Footer navigation" className="lg:contents">
            <div className="lg:order-2">
              <FooterGroup heading="Ships">
                <ul>
                  {ships.map((ship) => (
                    <li key={ship.slug}>
                      <Link href={`/saint-martin-ship/${ship.slug}`} className={`${linkClass} gap-2`}>
                        {ship.name}
                        {isPreBooking(ship) && <span className="shrink-0 rounded-md bg-[#fff8ee] px-1.5 py-0.5 text-[0.6875rem] font-bold text-[#8a5a2f]">Pre-booking</span>}
                      </Link>
                    </li>
                  ))}
                  <li><Link href="/saint-martin-ship" className="flex min-h-11 items-center text-sm font-bold text-brand-ink transition-colors hover:text-brand-ink-hover lg:min-h-8">Compare all ships</Link></li>
                </ul>
              </FooterGroup>
            </div>
            {linkGroups.map((group, index) => (
              <div key={group.heading} className={['lg:order-3', 'lg:order-4', 'lg:order-5'][index]}>
                <FooterGroup heading={group.heading}><LinkList links={group.links} /></FooterGroup>
              </div>
            ))}
          </nav>

          <div className="mt-5 lg:order-1 lg:mt-0">
            <img src="/Logo.png" alt="ShipTickets.bd, Saint Martin ship tickets" width={134} height={40} className="h-10 w-auto" />
            <address className="mt-1 not-italic lg:mt-3">
              {site.googleReviewsUrl ? (
                <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-start gap-2.5 py-2 text-sm text-prose transition-colors hover:text-brand-ink">
                  <MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-ink" /> {site.office}
                </a>
              ) : (
                <p className="flex items-start gap-2.5 py-2 text-sm text-prose"><MapPin size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-ink" /> {site.office}</p>
              )}
              <div className="flex flex-wrap gap-x-5 lg:block">
                <a href={`mailto:${site.email}`} className={contactRow}><Mail size={15} aria-hidden="true" className="shrink-0 text-brand-ink" /> {site.email}</a>
                <a href="https://www.facebook.com/shiptickets" target="_blank" rel="noopener noreferrer" className={contactRow}><FaFacebookF size={14} aria-hidden="true" className="shrink-0 text-brand-ink" /> Facebook</a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-3 border-t border-line-soft pt-4 lg:mt-8 lg:pt-5">
          <p className="text-sm font-semibold text-ink">Pay {site.advancePercentage}% to book <span aria-hidden="true" className="text-faint">·</span> Printed ticket by office pickup or courier <span aria-hidden="true" className="text-faint">·</span> Travel Pass included</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-1 text-xs font-bold text-quiet">We accept</h2>
            <ul className="flex flex-wrap gap-1.5">
              {PAYMENT_OPTIONS.map((option) => (
                <li key={option.src} className="flex h-10 items-center gap-1.5 rounded-lg border border-line-soft bg-white px-2.5 text-xs font-bold text-ink">
                  <Image src={option.src} alt={option.label ? '' : option.alt} width={option.width} height={option.height} unoptimized className={`${option.className} w-auto`} />
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 border-t border-line-soft pt-1 text-xs text-quiet lg:mt-5 lg:flex lg:items-center lg:justify-between lg:pt-3">
          <p className="flex items-center">© 2026 ShipTickets.bd. Operated by&nbsp;<a href="https://www.tripzic.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-brand-ink underline underline-offset-2 hover:text-brand-ink-hover lg:min-h-8">Tripzic</a>.</p>
          <p className="flex flex-wrap gap-x-4">
            <Link href="/booking-policy" className="inline-flex min-h-11 items-center font-semibold hover:text-brand-ink lg:min-h-8">Booking Policy</Link>
            <Link href="/privacy-policy" className="inline-flex min-h-11 items-center font-semibold hover:text-brand-ink lg:min-h-8">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
