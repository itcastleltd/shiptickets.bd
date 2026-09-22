import Link from 'next/link'
import Image from 'next/image'
import { PHONE_NUMBER } from '@/lib/ships'

const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

const footerLinks = [
  { href: '/saint-martin-ship', label: 'All ships' },
  { href: '/saint-martin-ship-ticket-price', label: 'Ticket price' },
  { href: '/saint-martin-ship-schedule', label: 'Ship schedule' },
  { href: '/saint-martin-travel-pass', label: 'Travel Pass' },
  { href: '/saint-martin-travel-rules', label: 'Travel rules' },
  { href: '/routes/coxs-bazar-to-saint-martin', label: 'Route guide' },
  { href: '/saint-martin-guide', label: 'Travel guide' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#ecf0ee] bg-white px-5 py-16 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
        <div>
          <div className="flex items-center">
            <Image src="/Logo.svg" alt="ShipTickets.bd — Saint Martin ship tickets" width={150} height={43} className="h-10 w-auto" />
          </div>

          <a
            href={phoneHref}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1d9e75]"
          >
            Call {PHONE_NUMBER}
          </a>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-[#507279]">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#1d9e75]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-[#ecf0ee] pt-5 text-xs text-[#8ba3a6]">
        © 2026 ShipTickets.bd · Prices and schedules are subject to confirmation and current government rules.
      </div>
    </footer>
  )
}
