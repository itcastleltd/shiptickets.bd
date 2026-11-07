'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, CircleAlert, MessageCircle, Phone, RotateCcw } from 'lucide-react'
import { BookingNotice } from '@/components/booking/booking-notice'
import { CopyButton } from '@/components/booking/copy-button'
import { PHONE_NUMBER, WHATSAPP_NUMBER } from '@/lib/contact'
import { TICKET_OPTIONS } from '@/lib/bookings/validate'
import { readBookingFailure, readBookingOutcome, type BookingFailure, type BookingOutcome } from '@/lib/bookings/outcome'
import { trackPhoneClick, trackWhatsApp } from '@/lib/gtm-events'

const taka = (amount: number) => `৳${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
const prettyDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const whatsappLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
const card = 'mx-auto max-w-xl rounded-3xl border border-line-soft bg-white p-5 shadow-card sm:p-6 md:p-8'
const primary = 'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-ink px-6 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover'
const secondary = 'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink'
const textLink = 'font-bold text-brand-ink underline underline-offset-2'

/** Reads this tab's saved result after the first render, so server and browser HTML match. */
function useSaved<T>(read: () => T | null) {
  const [state, setState] = useState<{ ready: boolean; value: T | null }>({ ready: false, value: null })
  useEffect(() => {
    setState({ ready: true, value: read() })
  }, [read])
  return state
}

const Placeholder = () => <div className={`${card} min-h-96`} aria-busy="true" />

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="text-sm text-quiet">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-bold text-ink">{children}</dd>
    </div>
  )
}

export function BookingSuccess() {
  const { ready, value: outcome } = useSaved<BookingOutcome>(readBookingOutcome)
  if (!ready) return <Placeholder />

  if (!outcome) {
    return (
      <section className={card}>
        <h1 className="t-title">No recent booking to show</h1>
        <p className="t-body mt-3 text-prose">Your booking details are only kept in the browser tab you booked from. If you have booked, send us your mobile number on WhatsApp and our team will find it.</p>
        <div className="mt-5 grid gap-2">
          <a href={whatsappLink('Hello ShipTickets.bd, I need help finding my booking.')} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('booking_lookup')} className={primary}><MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp</a>
          <Link href="/booking" className={secondary}>Book a ticket</Link>
        </div>
      </section>
    )
  }

  const ticket = outcome.ticketDelivery ? TICKET_OPTIONS[outcome.ticketDelivery] : undefined
  // Seats are counted per person. A cabin holds an unknown number of people, so the customer adds them.
  const passengerLines = outcome.isCabin
    ? ['Passenger 1', 'NID Number:', 'Date of Birth:', '', 'Other passengers in the cabin (name, NID Number, Date of Birth):']
    : Array.from({ length: outcome.quantity }, (_, index) => [...(outcome.quantity > 1 ? [`Passenger ${index + 1}`] : []), 'NID Number:', 'Date of Birth:', '']).flat().slice(0, -1)
  const message = [
    `Hello ShipTickets.bd, my booking reference is ${outcome.reference}.`,
    `Ship: ${outcome.shipName}`,
    `${outcome.isCabin ? 'Cabin' : 'Seat'}: ${outcome.categoryName} x ${outcome.quantity}`,
    `Journey date: ${outcome.travelDate}`,
    ...(outcome.tripType === 'round_trip' && outcome.returnDate ? [`Return date: ${outcome.returnDate}`] : []),
    `Delivery: ${ticket ? (ticket.charge > 0 ? `${ticket.label} (${ticket.detail})` : ticket.label) : '(office pickup, or courier with full address)'}`,
    `Total: ${taka(outcome.total)}${ticket && ticket.charge > 0 ? ` (includes ${taka(ticket.charge)} courier)` : ''}`,
    `Paid: ${taka(outcome.advance)}`,
    `Due: ${taka(outcome.balance)}`,
    'I am attaching my payment screenshot.',
    '',
    ...passengerLines,
  ].join('\n')

  return (
    <section className={card} aria-labelledby="booking-success-title">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#e1f5ee] text-[#0f6e56]"><Check size={26} aria-hidden="true" /></span>
      <h1 id="booking-success-title" className="t-title mt-4">Booking received</h1>
      <p lang="bn" className="mt-1 text-sm font-semibold text-brand-ink">আপনার বুকিং জমা হয়েছে</p>
      <p className="t-body mt-3 text-prose">Your booking is not final yet. We have your payment details and still need to check them. Your booking is final when your ticket is issued.</p>

      <div className="mt-5 rounded-2xl bg-[#f1f8f6] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-quiet">Booking reference</p>
            <p className="break-words text-xl font-black text-ink">{outcome.reference}</p>
          </div>
          <CopyButton value={outcome.reference} label="booking reference" />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-brand-ink p-4">
        <h2 className="t-subtitle text-ink">Next step: message us on WhatsApp</h2>
        <p lang="bn" className="mt-1 text-sm font-semibold text-brand-ink">টিকেট পেতে আমাদের WhatsApp-এ মেসেজ পাঠান</p>
        <p className="mt-3 text-sm font-bold text-ink">We need these to issue your ticket:</p>
        <p lang="bn" className="text-sm font-semibold text-prose">টিকেট ইস্যু করতে এগুলো লাগবে:</p>
        <ol className="mt-2 grid gap-1.5 text-sm text-ink">
          {[
            ['Payment screenshot', 'পেমেন্টের স্ক্রিনশট'],
            [outcome.quantity > 1 || outcome.isCabin ? 'NID number of each passenger' : 'NID number', outcome.quantity > 1 || outcome.isCabin ? 'প্রত্যেক যাত্রীর NID নম্বর' : 'NID নম্বর'],
            [outcome.quantity > 1 || outcome.isCabin ? 'Date of birth of each passenger' : 'Date of birth', outcome.quantity > 1 || outcome.isCabin ? 'প্রত্যেক যাত্রীর জন্মতারিখ' : 'জন্মতারিখ'],
          ].map(([label, labelBn], index) => (
            <li key={label} className="flex items-start gap-2.5 rounded-xl bg-[#f1f8f6] px-3 py-2">
              <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-ink text-xs font-black text-white">{index + 1}</span>
              <span className="min-w-0"><span className="block font-bold">{label}</span><span lang="bn" className="block text-[0.8125rem] text-prose">{labelBn}</span></span>
            </li>
          ))}
        </ol>
        <p className="t-small mt-3 text-prose">We have written the message for you. Fill in the blank lines and attach the screenshot before you send it.</p>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('booking_confirmation', outcome.shipName)} className={`${primary} mt-3`}><MessageCircle size={18} aria-hidden="true" /> Send message on WhatsApp</a>
      </div>

      <h2 className="t-subtitle mt-6 text-ink">Your booking</h2>
      <dl className="mt-1 divide-y divide-line-soft">
        <Row label="Ship">{outcome.shipName}</Row>
        <Row label={outcome.isCabin ? 'Cabin' : 'Seat'}>{outcome.categoryName} × {outcome.quantity}</Row>
        <Row label="Journey">{prettyDate(outcome.travelDate)}{outcome.departs && <span className="block text-xs font-semibold text-quiet">Published time: {outcome.departs}</span>}</Row>
        {outcome.tripType === 'round_trip' && outcome.returnDate && <Row label="Return">{prettyDate(outcome.returnDate)}{outcome.returns && <span className="block text-xs font-semibold text-quiet">Published time: {outcome.returns}</span>}</Row>}
        {ticket && <Row label="Ticket">{ticket.label}{outcome.ticketDelivery !== 'office' && <span className="block text-xs font-semibold text-quiet">{ticket.detail}</span>}</Row>}
        <Row label="Payment method">{outcome.paymentMethod}</Row>
        {ticket && ticket.charge > 0 && <Row label="Courier">{taka(ticket.charge)}</Row>}
        <Row label="Total">{taka(outcome.total)}</Row>
        <Row label={`${outcome.balance > 0 ? `${outcome.advancePercentage}% advance` : 'Full fare'}${ticket && ticket.charge > 0 ? ' + courier' : ''}${outcome.balance > 0 ? '' : ' submitted'}`}>{taka(outcome.advance)}</Row>
        {outcome.balance > 0 && <Row label="Balance due later">{taka(outcome.balance)}</Row>}
      </dl>

      {outcome.preBooking && <p className="t-small mt-5 rounded-xl border border-[#f3d9bf] bg-[#fff8ee] p-3 font-semibold text-ink">This is a pre-booking. {outcome.shipName} has not published its schedule yet, so we will confirm your date and time on WhatsApp once it is published.</p>}

      <h2 className="t-subtitle mt-6 text-ink">What happens next</h2>
      <ol className="t-small mt-2 grid list-decimal gap-1.5 pl-5 text-prose">
        <li>You send us the WhatsApp message.</li>
        <li>Our team checks your payment and confirms the ticket with the operator.</li>
        <li>We confirm on WhatsApp. {!ticket ? 'Then collect your printed ticket from our office, or we can send it by courier.' : outcome.ticketDelivery === 'office' ? 'Then collect your printed ticket from our Kawran Bazar office.' : 'Then we send your printed ticket by courier.'}</li>
      </ol>
      <div className="mt-5"><BookingNotice title="মনে রাখবেন" delivery={outcome.ticketDelivery} balance={outcome.balance} /></div>
      <p className="t-small mt-4 text-prose">Please save your booking reference. See our <Link href="/booking-policy" className={textLink}>booking policy</Link> for refunds and changes, or call <a href={phoneHref} onClick={() => trackPhoneClick('booking_confirmation')} className={textLink}>{PHONE_NUMBER}</a> if you need help.</p>
    </section>
  )
}

export function BookingFailed() {
  const { ready, value: failure } = useSaved<BookingFailure>(readBookingFailure)
  if (!ready) return <Placeholder />

  const message = [
    'Hello ShipTickets.bd, my online booking did not go through.',
    ...(failure?.shipName ? [`Ship: ${failure.shipName}`] : []),
    ...(failure?.travelDate ? [`Journey date: ${failure.travelDate}`] : []),
    'Have I paid (yes or no):',
    'TrxID, if paid:',
  ].join('\n')

  return (
    <section className={card} aria-labelledby="booking-failed-title">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#fef3f2] text-[#b42318]"><CircleAlert size={26} aria-hidden="true" /></span>
      <h1 id="booking-failed-title" className="t-title mt-4">{failure ? 'Your booking was not saved' : 'Having trouble with a booking?'}</h1>
      {failure && <p lang="bn" className="mt-1 text-sm font-semibold text-[#b42318]">আপনার বুকিং জমা হয়নি</p>}
      <p className="t-body mt-3 text-prose">{failure ? 'Something went wrong on our side, and you have not received a booking reference. Your details are still saved in this browser tab, so you can try again.' : 'If a booking did not go through, you can try again or contact our team.'}</p>

      <div className="mt-5 rounded-2xl border border-[#f2c7c3] bg-[#fef3f2] p-4">
        <h2 className="t-subtitle text-ink">Already paid? Don’t pay again.</h2>
        <p lang="bn" className="mt-1 text-sm font-semibold text-ink">পেমেন্ট করে থাকলে আবার টাকা পাঠাবেন না।</p>
        <p className="t-small mt-2 text-prose">Try once more with the same Transaction ID. If it still fails, send it to us on WhatsApp and our team will check it.</p>
      </div>

      <div className="mt-5 grid gap-2">
        <Link href="/booking" className={primary}><RotateCcw size={17} aria-hidden="true" /> Try again</Link>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('booking_failed', failure?.shipName)} className={secondary}><MessageCircle size={18} aria-hidden="true" /> Get help on WhatsApp</a>
        <a href={phoneHref} onClick={() => trackPhoneClick('booking_failed')} className={secondary}><Phone size={17} aria-hidden="true" /> Call {PHONE_NUMBER}</a>
      </div>
    </section>
  )
}
