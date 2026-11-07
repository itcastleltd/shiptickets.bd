'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/contact'
import { ContactLink } from '@/components/contact-link'

const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
// Read directly, because the shared booking rules are too large to send with the header on every page.
const BOOKING_ENABLED = process.env.NEXT_PUBLIC_BOOKING_ENABLED === 'true'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/saint-martin-ship', label: 'Ships' },
    { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
    { href: '/saint-martin-ship-schedule', label: 'Schedule' },
  ]

const menuLinks = [
  { href: '/saint-martin-ship', label: 'Ships' },
  { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
  { href: '/saint-martin-ship-schedule', label: 'Schedule' },
  { href: '/saint-martin-travel-rules', label: 'Travel rules' },
  { href: '/blog', label: 'Blog' },
]

const callIcon = 'grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-brand-ink hover:text-brand-ink'
const whatsappPill = 'min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#0d1b2a] px-4 text-sm font-bold text-white transition hover:bg-[#1d5863]'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
  // On phones and tablets the booking form keeps only what helps someone finish paying. Desktop keeps the full menu.
  const inCheckout = BOOKING_ENABLED && pathname === '/booking'
  const showBookNow = BOOKING_ENABLED && !inCheckout

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButton.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header data-site-header className="sticky top-0 z-40 border-b border-line-soft bg-white/95 backdrop-blur transition-transform duration-200">
      <div className="mx-auto flex h-(--header-h) max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex min-h-11 shrink-0 items-center" aria-label="ShipTickets.bd home">
          <img src="/Logo.png" alt="ShipTickets.bd — Saint Martin ship tickets" width={134} height={40} className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-quiet lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center transition-colors ${active ? 'text-brand-ink underline decoration-2 underline-offset-8' : 'text-quiet hover:text-brand-ink'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {inCheckout ? (
          <div className="flex items-center gap-2">
            <ContactLink href={waLink('Hello ShipTickets.bd, I need help with my booking.')} kind="whatsapp" eventLabel="checkout_header" target="_blank" rel="noopener noreferrer" className={`${whatsappPill} inline-flex lg:hidden`}>
              <MessageCircle size={16} aria-hidden="true" /> Need help?
            </ContactLink>
            <ContactLink href={waLink('Hello ShipTickets.bd, I need help with my booking.')} kind="whatsapp" eventLabel="checkout_header_desktop" target="_blank" rel="noopener noreferrer" className={`${whatsappPill} hidden lg:inline-flex`}>
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </ContactLink>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {showBookNow && (
              <Link href="/booking" className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-brand-ink px-4 text-sm font-extrabold text-white transition-colors hover:bg-brand-ink-hover">
                Book now
              </Link>
            )}
            <ContactLink href={waLink('Hello ShipTickets.bd, I want to check Saint Martin ship ticket availability.')} kind="whatsapp" eventLabel="header" ariaLabel="WhatsApp for ticket" className={`${whatsappPill} hidden sm:inline-flex`}>
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </ContactLink>
            {!BOOKING_ENABLED && (
              <ContactLink href={phoneHref} kind="phone" eventLabel="header_call" ariaLabel="Call ShipTickets.bd for a ticket" className={`${callIcon} sm:hidden`}>
                <Phone size={17} aria-hidden="true" />
              </ContactLink>
            )}
            <button
              ref={menuButton}
              type="button"
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-[#f0f4f3] lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>

      {menuOpen && !inCheckout && (
        <div id="site-menu" className="max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-t border-line-soft bg-white px-5 py-3 lg:hidden">
          {showBookNow && (
            <Link href="/booking" onClick={() => setMenuOpen(false)} className="flex min-h-12 flex-col items-center justify-center rounded-xl bg-brand-ink px-4 py-1.5 text-center text-sm font-extrabold text-white transition-colors hover:bg-brand-ink-hover">
              Book online
            </Link>
          )}
          <nav className="mt-2 flex flex-col" aria-label="Menu">
            {menuLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border-l-4 px-3 text-sm transition-colors ${active ? 'border-brand-ink bg-[#f1f8f6] font-extrabold text-brand-ink' : 'border-transparent font-semibold text-ink hover:text-brand-ink'}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
