'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/ships'
import { ContactLink } from '@/components/contact-link'

const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/saint-martin-ship', label: 'Ships' },
    { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
    { href: '/saint-martin-ship-schedule', label: 'Schedule' },
  ]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-(--header-h) max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="ShipTickets.bd home">
          <Image src="/Logo.png" alt="ShipTickets.bd — Saint Martin ship tickets" width={134} height={40} className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-quiet lg:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${active ? 'text-brand-ink' : 'text-quiet hover:text-brand-ink'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink('Hello ShipTickets.bd, I want to check Saint Martin ship ticket availability.')}
            className="hidden items-center gap-2 rounded-full bg-[#0d1b2a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d5863] sm:flex"
            aria-label="WhatsApp for ticket"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <ContactLink href={phoneHref} kind="phone" eventLabel="header_call" ariaLabel="Call ShipTickets.bd for a ticket" className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink sm:hidden">
            <Phone size={17} aria-hidden="true" />
          </ContactLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-[#f0f4f3] lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden">
          <nav className="flex flex-col gap-1 border-t border-line-soft bg-white px-5 py-3">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between py-3 text-sm font-semibold ${active ? 'text-brand-ink' : 'text-quiet hover:text-brand-ink'}`}
                  onClick={() => setMenuOpen(false)}
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
