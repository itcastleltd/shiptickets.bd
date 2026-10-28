import Link from 'next/link'
import { MessageCircle, PhoneCall, Mail, MapPin, Clock } from 'lucide-react'
import { FaWhatsapp, FaFacebookF } from 'react-icons/fa'
import { site, PHONE_NUMBER, WHATSAPP_NUMBER } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`
const emailHref = `mailto:${site.email}`

/**
 * Footer navigation is grouped by intent rather than listed as one flat run of
 * links, which was hard to scan and gave no hint about what each area covered.
 */
const footerGroups = [
  {
    heading: 'Tickets & prices',
    links: [
      { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
      { href: '/saint-martin-cabin-price', label: 'Cabin & class prices' },
      { href: '/saint-martin-ship-schedule', label: 'Ship schedule' },
      { href: '/saint-martin-ship', label: 'All ships' },
    ],
  },
  {
    heading: 'Travel information',
    links: [
      { href: '/saint-martin-travel-pass', label: 'Travel Pass' },
      { href: '/saint-martin-travel-rules', label: 'Travel rules' },
      { href: '/saint-martin-guide', label: 'Travel guide' },
      { href: '/routes/coxs-bazar-to-saint-martin', label: "Cox's Bazar route" },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/how-we-verify-information', label: 'How we verify' },
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/booking-policy', label: 'Booking Policy' },
      { href: '/blog', label: 'Blog' },
    ],
  },
]

/**
 * Bottom padding is mobile-only and exists to clear the fixed MobileCallBar.
 * The bar is `sm:hidden`, so from `sm` up the normal padding applies and no
 * offset is needed. The clearance has to live here, after the footer content,
 * because the footer is the last element in the page — padding placed on a
 * container above it only opens a gap and still leaves the footer covered.
 */
export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-white px-5 pb-24 pt-16 lg:px-8 lg:pb-12 lg:pt-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_2fr]">
        {/* Brand + contact */}
        <div>
          <img
            src="/Logo.png"
            alt="ShipTickets.bd — Saint Martin ship tickets"
            width={134}
            height={40}
            className="h-10 w-auto"
          />

          <p className="mt-4 max-w-xs text-sm leading-6 text-quiet">
            ShipTickets.bd is a dedicated platform for Saint Martin’s ship tickets and travel information in Bangladesh. Operated by Tripzic.com, a CAAB-approved travel agency and ETAB member.
          </p>

          <address className="mt-6 space-y-2.5 text-sm not-italic text-quiet">
            <ContactLink href={phoneHref} kind="phone" eventLabel="footer_call" className="flex items-center gap-2.5 hover:text-brand-ink">
              <PhoneCall size={15} className="shrink-0 text-brand-ink" aria-hidden="true" />
              {PHONE_NUMBER}
            </ContactLink>
            <ContactLink href={whatsappHref} kind="whatsapp" eventLabel="footer_whatsapp" className="flex items-center gap-2.5 hover:text-brand-ink">
              <MessageCircle size={15} className="shrink-0 text-brand-ink" aria-hidden="true" />
              WhatsApp support
            </ContactLink>
            <a href={emailHref} className="flex items-center gap-2.5 hover:text-brand-ink">
              <Mail size={15} className="shrink-0 text-brand-ink" aria-hidden="true" />
              {site.email}
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-brand-ink" aria-hidden="true" />
              <span>{site.office}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="shrink-0 text-brand-ink" aria-hidden="true" />
              {site.supportHours}
            </div>
          </address>

<div className="mt-6 flex items-center gap-3">
  {[
    { name: 'WhatsApp', href: whatsappHref, icon: 'whatsapp' as const },
    { name: 'Facebook', href: 'https://facebook.com/shiptickets', icon: 'facebook' as const },
    { name: 'Phone', href: phoneHref, icon: 'phone' as const },
  ].map((social) => (
    <a
      key={social.name}
      href={social.href}
      target={social.icon === 'phone' ? undefined : '_blank'}
      rel={social.icon === 'phone' ? undefined : 'noopener noreferrer'}
      aria-label={social.name}
      className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-all hover:border-brand-ink hover:bg-brand-ink hover:text-white"
    >
      {social.icon === 'whatsapp' && (
        <FaWhatsapp size={19} aria-hidden="true" />
      )}

      {social.icon === 'facebook' && (
        <FaFacebookF size={17} aria-hidden="true" />
      )}

      {social.icon === 'phone' && (
        <PhoneCall size={18} aria-hidden="true" />
      )}
    </a>
  ))}
</div>
        </div>

        {/* Grouped navigation */}
        <nav aria-label="Footer navigation" className="grid gap-10 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h2 className="t-label text-ink">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-quiet hover:text-brand-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/*
        The review date is deliberately not repeated here. Every page already
        states it once at the top, where a reader meets it before the fares
        rather than after them. The footer keeps the guidance without the date
        so nothing reads twice.
      */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-line-soft pt-6 text-xs text-faint">
        <p>&copy; 2026 ShipTickets.bd . A platform by <a href="https://tripzic.com" target="_blank" rel="noopener noreferrer" className="text-brand-ink hover:text-brand-ink-hover">
          Tripzic.com
        </a> Civil Aviation Authority of Bangladesh (CAAB) Approved Travel Agency.</p>
        <p className="mt-2">
        </p>
      </div>
    </footer>
  )
}