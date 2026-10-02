import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, PhoneCall, Mail, MapPin, Clock } from 'lucide-react'
import { site, PHONE_NUMBER, WHATSAPP_NUMBER } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`
const emailHref = `mailto:${site.email}`

/**
 * Brand marks are kept as inline SVG because lucide-react dropped third-party
 * brand icons. They live in their own component so this file stays readable.
 */
function BrandIcon({ name }: { name: 'facebook' | 'instagram' }) {
  if (name === 'facebook') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H11.5v-9.3H8.875V11.1h2.625V8.4c0-2.6 1.562-3.984 3.875-3.984 1.114 0 2.075.083 2.35 0.119v2.7h-1.612c-1.272 0-1.516.6-1.763 1.449l-.029.116v2.072h3.612l-.47 3.66H13.5v9.3h8.174c.726 0 1.326-.6 1.326-1.326V1.326C24 .6 23.4 0 22.675 0z" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.74 0 8.29 0.01 7.05 0.07 5.81 0.13 4.9 0.37 4.14 0.66c-.77.29-1.43.65-2.08 1.3C1.39 2.61.97 3.27.65 4.05.38 4.81.15 5.72.06 6.96 0 8.29 0 8.74 0 12s.01 3.71.07 4.95c.08 1.24.33 2.15.62 2.91.28.77.68 1.43 1.33 2.08.66.65 1.36 1.31 2.13 1.97.65.66 1.31 1.32 2.07 1.97.64.65.99 1.01 1.37 1.13.39.13.81.23 1.54.25 0 .02.04.05 0 .07 0 .04.03.03.04.07 0 .02.04 0 .04 0H12c0 .01-.03.02-.03.07 0 .04.02.02 0 .07-.01 0 0 .03.03.07 0 0-.01 0 0 .07 0 0 0 0 .03.05 0-.03.01-.06.01-.09V12c0-.01-.01-.03-.01-.05v-.03c0 0 .01-.01 0-.01 0 0 .01.01 0 .02A4.44 4.44 0 0 1 12 24c3.26 0 3.31-.01 4.55-.07 1.24-.06 2.15-.3 2.91-.59.77-.29 1.54-.68 2.21-1.35.66-.66 1.33-1.32 1.99-2.01.66-.65 1.04-1.13 1.19-1.51.16-.39.31-.8.43-1.54.12-1.24.15-1.69.15-4.95s-.03-3.71-.16-4.95c-.12-1.24-.36-2.17-.64-2.93-.28-.77-.76-1.43-1.34-1.99-.6-.64-1.37-1.3-2.04-1.96s-.94-1.28-1.48-1.71c-.55-.55-.61-.61-.61-.61s.32-.85 0-1.25c.32-.41 0-1.15 0-1.15s1.07 0 1.91-.04c.83-.05 1.68.15 2.43.4.78.27 1.31.73 1.77 1.2.48.52 1.04 1.25 1.51 2.15.49.93.69 1.89.81 2.86.12 1.25.16 1.29.16 4.54s-.04 3.29-.16 4.54c-.12.97-.32 1.93-.81 2.86-.47.9-1.03 1.63-1.51 2.15-.46.47-1 1-1.37 1.39-.55.55-.62.61-.62.61s.37.96 0 1.48c.38.51.99 1.08 1.57 1.66.56.58 1.37 1.38 2.04 2.04.66.66 1.32 1.32 1.99 2.01.65.66 1.31 1.32 2.04 1.96.56.55 1.03.99 1.49 1.37.45.38.92.72 1.48.98.55.26 1.31.53 2.41.9-.48.47-1.05.99-1.62 1.49-1.31 1.17-2.82 1.97-4.5 2.38-1.69.41-3.51.62-5.45.67C12.04 23.99 12 24 12 24s-.04-.01-.15-.01c-1.94 0-3.76-.17-5.45-.67-1.68-.41-3.18-1.2-4.5-2.38C1.89 19.63 1.5 18.94 1.15 18.16c-.4-.8-.72-1.68-.88-2.64C.11 13.83 0 12.95 0 12s.11-1.83.27-2.79c.16-.96.48-1.84.88-2.64.36-.78.84-1.5 1.44-2.1.6-.6 1.27-1.03 2-1.38.72-.34 1.25-.59 1.93-.82.67-.23 1.64-.44 2.79-.62.03-.75.07-1.51.07-1.51s-.03-.75-.07-1.51c1.15.18 2.12.39 2.79.62.73.22 1.33.54 2.01 1.09.66.55 1.34 1.05 1.97 1.65.61.6 1.16 1.34 1.62 2.14.39.85.7 1.77.84 2.77.04.3.06.61.06.93 0 .32-.02.63-.07.93l2.08-.01c-.05-.3-.08-.62-.08-.93 0-1.98.47-3.89 1.32-5.61.38-.76.83-1.48 1.33-2.14.59-.78 1.25-1.5 1.97-2.14.6-.55 1.3-1.02 2.08-1.37.75-.34 1.56-.55 2.42-.69.28 0 .55-.01.82-.01l.01-2.75c-.27 0-.55 0-.83.01-1.01.15-1.97.38-2.83.72-.8.32-1.48.73-2.08 1.23-.9.75-1.62 1.68-2.12 2.8-.61-1.36-1.67-2.54-3.02-3.32-1.35-.78-2.92-1.21-4.79-1.21-2.29 0-4.27.81-5.74 2.19-1.47 1.38-2.34 3.36-2.34 5.85 0 2.49.87 4.57 2.34 6.05 1.47 1.48 3.45 2.29 5.74 2.29 2.89 0 5.15-1.01 6.81-2.85.75-.85 1.46-1.86 2.05-3.02.5.96.81 2.01.93 3.11l.01 4.79c0 .65.04 1.28.11 1.89.07.62.19 1.22.36 1.79.66.35 1.37.64 2.12.85.75.21 1.55.36 2.37.43l.13-2.79c-.61-.06-1.19-.17-1.74-.33-.55-.16-1.03-.38-1.44-.66-.24-.48-.43-1-.57-1.56-.14-.56-.23-1.15-.28-1.74-.05-.59-.07-1.2-.07-1.81v-5.19c0-1.1.28-2.05.82-2.83.54-.78 1.34-1.17 2.4-1.17.83 0 1.45.26 1.86.78.41.52.62 1.25.62 2.19v6.59c0 2.24.28 3.98.83 5.22.55 1.24 1.51 1.87 2.87 1.87.93 0 1.68-.36 2.24-1.07.56-.71.84-1.75.84-3.11v-5.19c0-.93.04-1.71.12-2.35.08-.64.2-1.15.36-1.53.16-.38.42-.6.77-.66.35-.06.81-.09 1.37-.09h2.02v-2.76z" />
    </svg>
  )
}

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
    <footer className="border-t border-[#ecf0ee] bg-white px-5 pb-24 pt-16 lg:px-8 lg:pb-12 lg:pt-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_2fr]">
        {/* Brand + contact */}
        <div>
          <Image
            src="/Logo.png"
            alt="ShipTickets.bd — Saint Martin ship tickets"
            width={134}
            height={40}
            className="h-10 w-auto"
          />

          <p className="mt-4 max-w-xs text-sm leading-6 text-[#507279]">
            Saint Martin ship ticket information and human-assisted booking support from Cox&rsquo;s Bazar.
          </p>

          <address className="mt-6 space-y-2.5 text-sm not-italic text-[#507279]">
            <ContactLink href={phoneHref} kind="phone" eventLabel="footer_call" className="flex items-center gap-2.5 hover:text-[#1d9e75]">
              <PhoneCall size={15} className="shrink-0 text-[#1d9e75]" aria-hidden="true" />
              {PHONE_NUMBER}
            </ContactLink>
            <ContactLink href={whatsappHref} kind="whatsapp" eventLabel="footer_whatsapp" className="flex items-center gap-2.5 hover:text-[#1d9e75]">
              <MessageCircle size={15} className="shrink-0 text-[#1d9e75]" aria-hidden="true" />
              WhatsApp support
            </ContactLink>
            <a href={emailHref} className="flex items-center gap-2.5 hover:text-[#1d9e75]">
              <Mail size={15} className="shrink-0 text-[#1d9e75]" aria-hidden="true" />
              {site.email}
            </a>
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#1d9e75]" aria-hidden="true" />
              <span>{site.office}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="shrink-0 text-[#1d9e75]" aria-hidden="true" />
              {site.supportHours}
            </div>
          </address>

          <div className="mt-6 flex items-center gap-3">
            {[
              { name: 'WhatsApp', href: whatsappHref, icon: 'whatsapp' as const },
              { name: 'Facebook', href: 'https://facebook.com/shipticketsbd', icon: 'facebook' as const },
              { name: 'Instagram', href: 'https://instagram.com/shipticketsbd', icon: 'instagram' as const },
              { name: 'Phone', href: phoneHref, icon: 'phone' as const },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.icon === 'phone' ? undefined : '_blank'}
                rel={social.icon === 'phone' ? undefined : 'noopener noreferrer'}
                aria-label={social.name}
                className="flex size-10 items-center justify-center rounded-full border border-[#cfe1df] bg-white text-[#0d1b2a] transition-all hover:border-[#1d9e75] hover:bg-[#1d9e75] hover:text-white"
              >
                {social.icon === 'whatsapp' && <MessageCircle size={18} aria-hidden="true" />}
                {social.icon === 'facebook' && <BrandIcon name="facebook" />}
                {social.icon === 'instagram' && <BrandIcon name="instagram" />}
                {social.icon === 'phone' && <PhoneCall size={18} aria-hidden="true" />}
              </a>
            ))}
          </div>
        </div>

        {/* Grouped navigation */}
        <nav aria-label="Footer navigation" className="grid gap-10 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h2 className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0d1b2a]">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#507279] hover:text-[#1d9e75]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-[#ecf0ee] pt-6 text-xs text-[#8ba3a6]">
        <p>&copy; 2026 ShipTickets.bd · Prices and schedules are subject to confirmation and current government rules.</p>
        <p className="mt-2">
          Information last reviewed: {site.lastReviewed}. Confirm your fare, sailing and Travel Pass requirements before you travel.
        </p>
      </div>
    </footer>
  )
}