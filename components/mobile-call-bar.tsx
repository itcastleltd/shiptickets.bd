'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '@/lib/ships'
import { trackPhoneClick, trackWhatsApp } from '@/lib/gtm-events'

const waLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`

/**
 * Persistent mobile contact bar.
 *
 * This is a Client Component so it can own its own GTM tracking rather than
 * receiving handlers from a Server Component. Every page renders this from its
 * own layout, so the bar is not tied to any single page's markup.
 *
 * It is fixed to the bottom and only visible below the `sm` breakpoint, where
 * the header's own links are not reachable while scrolling. `sm:hidden` keeps it
 * out of the way on tablet and desktop.
 */
export function MobileCallBar({ message }: { message?: string }) {
  const text = message ?? 'Hello ShipTickets.bd, I want to check ticket availability.'

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[#dcebea] bg-white/95 p-2 shadow-[0_-8px_30px_rgba(18,60,69,.1)] backdrop-blur sm:hidden">
      <a
        href={waLink(text)}
        onClick={() => trackWhatsApp('mobile_cta')}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] py-3 text-sm font-extrabold text-white"
      >
        <MessageCircle size={16} aria-hidden="true" /> WhatsApp
      </a>
      <a
        href={phoneHref}
        onClick={() => trackPhoneClick('mobile_cta')}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#1d9e75] py-3 text-sm font-extrabold text-white"
      >
        <Phone size={16} aria-hidden="true" /> Call now
      </a>
    </div>
  )
}