'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CircleAlert, MessageCircle, Minus, Phone, Plus } from 'lucide-react'
import { trackClickCTA, trackPhoneClick, trackWhatsApp } from '@/lib/gtm-events'

const MAX_PASSENGERS = 20
const dhakaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
const longDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/**
 * The homepage's trip form. The date and passenger count go straight into the
 * WhatsApp message, or to /booking when online booking is switched on.
 */
export function HomeTripPanel({ ships, minDate, maxDate, bookingEnabled, whatsappNumber, phoneHref, phoneNumber }: {
  ships: { slug: string; name: string }[]
  minDate: string
  maxDate: string
  bookingEnabled: boolean
  whatsappNumber: string
  phoneHref: string
  phoneNumber: string
}) {
  const router = useRouter()
  const [trip, setTrip] = useState<'round_trip' | 'one_way'>('round_trip')
  const [ship, setShip] = useState('')
  const [date, setDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(2)
  const [error, setError] = useState('')
  const [earliest, setEarliest] = useState(minDate)

  useEffect(() => {
    const today = dhakaToday()
    if (today > minDate) setEarliest(today)
  }, [minDate])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!date) return setError('Choose your journey date')
    if (trip === 'round_trip' && !returnDate) return setError('Choose your return date')
    if (trip === 'round_trip' && returnDate < date) return setError('The return date cannot be before the journey date')
    setError('')
    const shipName = ships.find((item) => item.slug === ship)?.name
    if (bookingEnabled) {
      trackClickCTA('book_now', 'home_trip_panel')
      const params = new URLSearchParams({ trip, date, qty: String(passengers) })
      if (ship) params.set('ship', ship)
      if (trip === 'round_trip') params.set('ret', returnDate)
      router.push(`/booking?${params}`)
      return
    }
    trackWhatsApp('search_ship', shipName)
    const when = trip === 'round_trip' ? `round trip, ${longDate(date)} to ${longDate(returnDate)}` : `one way on ${longDate(date)}`
    const which = shipName ? `${shipName} tickets` : 'Saint Martin ship tickets'
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ShipTickets.bd, I want to check ${which}: ${when}, ${passengers} passenger${passengers === 1 ? '' : 's'}.`)}`
  }

  const field = 'mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-line bg-white px-2 py-2 text-base text-ink focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/30 sm:px-3 [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:p-0'
  const tripButton = (value: 'round_trip' | 'one_way', label: string) => (
    <button type="button" aria-pressed={trip === value} onClick={() => { setTrip(value); setError('') }} className={`min-h-11 cursor-pointer rounded-lg text-sm font-extrabold transition duration-200 ${trip === value ? 'bg-white text-ink shadow-card' : 'text-quiet hover:text-ink'}`}>{label}</button>
  )

  return (
    <form onSubmit={submit} noValidate aria-labelledby="trip-panel-title" className="rounded-3xl border border-line-soft bg-white p-4 shadow-raised sm:p-5">
      <h2 id="trip-panel-title" className="text-lg font-black text-ink">Check your Saint Martin ship ticket</h2>
      <p className="t-small text-quiet">Cox’s Bazar to Saint Martin</p>

      <div role="group" aria-label="Trip type" className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-[#e9f0ee] p-1">
        {tripButton('round_trip', 'Round trip')}
        {tripButton('one_way', 'One way')}
      </div>

      <div className={`mt-3 grid gap-3 ${trip === 'round_trip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div className="min-w-0">
          <label htmlFor="trip-date" className="text-xs font-bold text-quiet">Journey date</label>
          <input id="trip-date" type="date" value={date} min={earliest} max={maxDate} onChange={(event) => { setDate(event.target.value); setError('') }} className={field} />
        </div>
        {trip === 'round_trip' && (
          <div className="min-w-0">
            <label htmlFor="trip-return" className="text-xs font-bold text-quiet">Return date</label>
            <input id="trip-return" type="date" value={returnDate} min={date || earliest} max={maxDate} onChange={(event) => { setReturnDate(event.target.value); setError('') }} className={field} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <label htmlFor="trip-ship" className="text-xs font-bold text-quiet">Ship</label>
        <select id="trip-ship" value={ship} onChange={(event) => setShip(event.target.value)} className={field}>
          <option value="">Any ship: suggest one for me</option>
          {ships.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p id="trip-passengers" className="text-sm font-bold text-ink">Passengers</p>
        <div role="group" aria-labelledby="trip-passengers" className="inline-flex items-center gap-1">
          <button type="button" aria-label="Remove one passenger" disabled={passengers <= 1} onClick={() => setPassengers(passengers - 1)} className="grid size-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition disabled:cursor-not-allowed disabled:opacity-40"><Minus size={17} aria-hidden="true" /></button>
          <output aria-live="polite" className="w-9 text-center text-lg font-black tabular-nums text-ink">{passengers}</output>
          <button type="button" aria-label="Add one passenger" disabled={passengers >= MAX_PASSENGERS} onClick={() => setPassengers(passengers + 1)} className="grid size-11 cursor-pointer place-items-center rounded-full border border-line text-ink transition disabled:cursor-not-allowed disabled:opacity-40"><Plus size={17} aria-hidden="true" /></button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 flex items-start gap-1.5 text-sm font-semibold text-[#b42318]">
          <CircleAlert size={15} aria-hidden="true" className="mt-0.5 shrink-0" /> {error}
        </p>
      )}

      <button type="submit" className="mt-3 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-base font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover">
        {bookingEnabled ? 'Book now' : <><MessageCircle size={17} aria-hidden="true" /> Check on WhatsApp</>}
      </button>
      <a href={phoneHref} onClick={() => trackPhoneClick('hero_ticket')} className="mt-1 flex min-h-11 items-center justify-center gap-1.5 text-sm font-extrabold text-ink underline-offset-4 hover:text-brand-ink hover:underline"><Phone size={15} aria-hidden="true" /> Or call {phoneNumber}</a>
      <p className="t-small text-center text-quiet">{bookingEnabled ? 'Next, choose your seat or cabin.' : 'We reply with the fare and availability for your date.'}</p>
    </form>
  )
}
