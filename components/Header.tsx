'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MessageCircle, Phone, ShipWheel, X } from 'lucide-react'
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/ships'

const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

const navLinks = [
  { href: '/saint-martin-ship', label: 'Ships' },
  { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
  { href: '/saint-martin-ship-schedule', label: 'Schedule' },
  { href: '/saint-martin-travel-pass', label: 'Travel Pass' },
  { href: '/saint-martin-guide', label: 'Guide' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#ecf0ee] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="ShipTickets.bd home">
          <Image src="/Logo.svg" alt="ShipTickets.bd — Saint Martin ship tickets" width={150} height={43} className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#507279] lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#1d9e75]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink('Hello ShipTickets.bd, I want to check Saint Martin ship ticket availability.')}
            className="hidden items-center gap-2 rounded-full bg-[#0d1b2a] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1d5863] sm:flex"
            aria-label="WhatsApp for ticket"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a
            href={phoneHref}
            className="grid size-10 place-items-center rounded-full border border-[#cfe1df] bg-white text-[#0d1b2a] sm:hidden"
            aria-label="Call for ticket"
          >
            <Phone size={17} />
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-[#0d1b2a] hover:bg-[#f0f4f3] lg:hidden"
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
          <nav className="flex flex-col gap-1 border-t border-[#ecf0ee] bg-white px-5 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between py-3 text-sm font-semibold text-[#507279] hover:text-[#1d9e75]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
