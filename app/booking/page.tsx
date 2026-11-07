import type { Metadata } from 'next'
import { MessageCircle } from 'lucide-react'
import { BookingFlow } from '@/components/booking/booking-flow'
import { getBookingCatalog } from '@/lib/bookings/catalog'
import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { WHATSAPP_NUMBER, season } from '@/lib/ships'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book a Saint Martin Ship Ticket',
  description: 'Book your Saint Martin ship ticket online: choose your ship, date and seat, pay the advance by bKash or bank, and collect your printed ticket.',
  alternates: { canonical: 'https://www.shiptickets.bd/booking' },
  robots: { index: false, follow: true },
}

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ ship?: string; category?: string; trip?: string; date?: string; ret?: string; qty?: string }> }) {
  const { ship, category, trip, date, ret, qty } = await searchParams
  const catalog = BOOKING_ENABLED ? await getBookingCatalog() : null

  if (catalog) {
    return <BookingFlow catalog={catalog} whatsappNumber={WHATSAPP_NUMBER} seasonStart={season.startISO} seasonEnd={season.endISO} initialShip={ship} initialCategory={category} initialTrip={trip} initialDate={date} initialReturn={ret} initialQuantity={qty} />
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-line-soft bg-white p-6 shadow-card md:p-8">
      <h1 className="t-title">Book on WhatsApp</h1>
      <p className="t-body mt-3 text-prose">Online booking is not available right now. Our team can help you with your travel date, fare and ticket on WhatsApp.</p>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello ShipTickets.bd, I want to book a Saint Martin ship ticket.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-extrabold text-white"
      >
        <MessageCircle size={18} aria-hidden="true" /> Book on WhatsApp
      </a>
    </section>
  )
}
