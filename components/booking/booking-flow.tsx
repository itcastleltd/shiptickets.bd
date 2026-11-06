'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Armchair, BedDouble, Check, ChevronDown, ChevronLeft, CircleAlert, Clock, Loader2, MessageCircle, Minus, Plus, Ticket } from 'lucide-react'
import { getShipSchedule, getUsualTimes } from '@/content/ship-schedules'
import { CopyButton } from '@/components/booking/copy-button'
import { clearBookingFailure, saveBookingFailure, saveBookingOutcome, takeBookingResume } from '@/lib/bookings/outcome'
import { trackBookingSubmitted, trackEvent, trackWhatsApp } from '@/lib/gtm-events'
import type { BookingCatalog, CatalogCategory } from '@/lib/bookings/catalog'
import { bookingSchema, todayInDhaka } from '@/lib/bookings/validate'

type Step = 0 | 1 | 2 | 3
type TripType = 'one_way' | 'round_trip'
type Errors = Record<string, string>

const STEPS = [
  { name: 'Trip', bn: 'যাত্রা', title: 'কবে যাবেন?', subtitle: 'Choose your ship, trip type and dates.' },
  { name: 'Seats', bn: 'সিট', title: 'কোন সিট নেবেন?', subtitle: 'Choose how many tickets, then your seat or cabin.' },
  { name: 'Details', bn: 'তথ্য', title: 'যাত্রীর তথ্য দিন', subtitle: 'We use these details for your ticket.' },
  { name: 'Pay', bn: 'পেমেন্ট', title: 'অগ্রিম পেমেন্ট করুন', subtitle: 'Pay the advance, then enter your Transaction ID.' },
]

/** Order used to find the first field with an error. */
const FIELD_ORDER = ['shipSlug', 'travelDate', 'returnDate', 'categoryCode', 'fullName', 'mobileNumber', 'email', 'coPassengers', 'transactionId', 'acceptedTerms']
const DRAFT_KEY = 'shiptickets-booking-draft'
const DRAFT_MAX_AGE_MS = 6 * 60 * 60 * 1000
const MAX_TICKETS = 20

const taka = (amount: number) => `৳${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
const prettyDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const inputClass = 'mt-1.5 block min-h-12 w-full min-w-0 rounded-xl border border-line bg-white px-3.5 py-2.5 text-base text-ink transition-colors focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/30 aria-[invalid=true]:border-[#b42318]'
const primaryButton = 'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-ink px-6 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover disabled:cursor-not-allowed disabled:opacity-60'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-[#b42318]">
      <CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {message}
    </p>
  )
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="t-small mt-1 text-quiet">{hint}</p>}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

/**
 * Shows payment instructions as written in the database, with "Label: value"
 * lines set out as rows. Rows holding a number, such as a merchant or account
 * number, get a copy button because people switch apps to pay.
 */
function PaymentInstructions({ text }: { text: string }) {
  const lines = text.split('\n').map((line) => line.trim())
  return (
    <div lang="bn" className="mt-3 space-y-1.5">
      {lines.map((line, index) => {
        if (!line) return <div key={index} className="h-1.5" aria-hidden="true" />
        const row = line.match(/^([^:]{2,40}):\s*(.+)$/)
        if (!row) return <p key={index} className="t-small leading-relaxed text-ink">{line}</p>
        const hasNumber = /\d{6,}|\d[\d\s-]{7,}\d/.test(row[2])
        return (
          <div key={index} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-bold text-quiet">{row[1]}</p>
              <p className="break-words font-extrabold text-ink tabular-nums">{row[2]}</p>
            </div>
            {hasNumber && <CopyButton value={row[2].replace(/[\s-]/g, '')} label={row[1]} />}
          </div>
        )
      })}
    </div>
  )
}

export function BookingFlow({
  catalog,
  whatsappNumber,
  seasonStart,
  seasonEnd,
  initialShip,
  initialCategory,
  initialTrip,
  initialDate,
  initialReturn,
  initialQuantity,
}: {
  catalog: BookingCatalog
  whatsappNumber: string
  seasonStart: string
  seasonEnd: string
  initialShip?: string
  initialCategory?: string
  initialTrip?: string
  initialDate?: string
  initialReturn?: string
  initialQuantity?: string
}) {
  const startShip = catalog.ships.some((ship) => ship.slug === initialShip) ? initialShip! : ''
  const startCategory = catalog.ships.find((ship) => ship.slug === startShip)?.categories.some((category) => category.code === initialCategory) ? initialCategory! : ''

  // Answers carried over from a ship page's quick form. Anything invalid is ignored.
  const isDate = (value?: string): value is string => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') && value! >= todayInDhaka()
  const startTrip: TripType = initialTrip === 'one_way' ? 'one_way' : 'round_trip'
  const startDate = isDate(initialDate) ? initialDate : ''
  const startReturn = startTrip === 'round_trip' && isDate(initialReturn) && initialReturn >= startDate ? initialReturn : ''
  const startQuantity = Math.min(MAX_TICKETS, Math.max(1, Math.floor(Number(initialQuantity)) || 1))
  const tripIsComplete = Boolean(startShip && startDate && (startTrip === 'one_way' || startReturn))

  const [step, setStep] = useState<Step>(tripIsComplete ? 1 : 0)
  const [shipSlug, setShipSlug] = useState(startShip)
  const [tripType, setTripType] = useState<TripType>(startTrip)
  const [travelDate, setTravelDate] = useState(startDate)
  const [returnDate, setReturnDate] = useState(startReturn)
  const [categoryCode, setCategoryCode] = useState(startCategory)
  const [quantity, setQuantity] = useState(startQuantity)
  const [seatPreference, setSeatPreference] = useState('')
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [coPassengers, setCoPassengers] = useState<string[]>([])
  const [paymentMethodType, setPaymentMethodType] = useState(catalog.paymentMethods[0]?.type ?? 'bkash_merchant')
  const [transactionId, setTransactionId] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // Stays the same across retries and reloads, so a repeated submit cannot create two bookings.
  const [clientRequestId, setClientRequestId] = useState(() => crypto.randomUUID())
  const [draftReady, setDraftReady] = useState(false)

  const router = useRouter()
  const heading = useRef<HTMLHeadingElement>(null)
  const moveFocus = useRef(false)
  const finished = useRef(false)

  const ship = catalog.ships.find((item) => item.slug === shipSlug)
  const category = ship?.categories.find((item) => item.code === categoryCode)
  const fareFor = useCallback((item: CatalogCategory) => (tripType === 'round_trip' ? item.roundTrip : item.oneWay), [tripType])
  const fare = category ? fareFor(category) : null
  const total = fare ? fare * quantity : 0
  const advance = Math.round(total * catalog.advancePercentage) / 100
  const balance = Math.round((total - advance) * 100) / 100
  const method = catalog.paymentMethods.find((item) => item.type === paymentMethodType)
  const today = useMemo(() => todayInDhaka(), [])
  const earliest = today > seasonStart ? today : seasonStart

  const schedule = shipSlug ? getShipSchedule(shipSlug) : undefined
  const usual = shipSlug ? getUsualTimes(shipSlug) : undefined
  const outbound = schedule?.rows.find((row) => row.date === travelDate) ?? (travelDate ? usual : undefined)
  const inbound = schedule?.rows.find((row) => row.date === returnDate) ?? (returnDate ? usual : undefined)

  const seats = ship?.categories.filter((item) => item.type === 'seat') ?? []
  const cabins = ship?.categories.filter((item) => item.type === 'cabin') ?? []
  const lowestSeat = Math.min(...seats.map((item) => fareFor(item) ?? Infinity))

  const helpLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  const helpMessage = ship ? `Hello ShipTickets.bd, I need help booking ${ship.name}.` : 'Hello ShipTickets.bd, I need help booking a Saint Martin ship ticket.'

  // Restores a draft after a reload, which phones often do when someone switches to the bKash app.
  useEffect(() => {
    try {
      const saved = initialDate ? null : window.sessionStorage.getItem(DRAFT_KEY)
      const parsed = saved ? JSON.parse(saved) : null
      // A tab left open on a shared phone should not keep showing someone's details.
      const expired = parsed && !(Date.now() - parsed.savedAt < DRAFT_MAX_AGE_MS)
      if (expired) window.sessionStorage.removeItem(DRAFT_KEY)
      const draft = expired ? null : parsed
      if (draft && (!startShip || draft.shipSlug === startShip)) {
        setShipSlug(draft.shipSlug ?? startShip)
        setTripType(draft.tripType === 'one_way' ? 'one_way' : 'round_trip')
        setTravelDate(draft.travelDate ?? '')
        setReturnDate(draft.returnDate ?? '')
        setCategoryCode(startCategory || (draft.categoryCode ?? ''))
        setQuantity(draft.quantity ?? 1)
        setSeatPreference(draft.seatPreference ?? '')
        setFullName(draft.fullName ?? '')
        setMobileNumber(draft.mobileNumber ?? '')
        setEmail(draft.email ?? '')
        setCoPassengers(draft.coPassengers ?? [])
        if (draft.paymentMethodType) setPaymentMethodType(draft.paymentMethodType)
        setTransactionId(draft.transactionId ?? '')
        if (draft.clientRequestId) setClientRequestId(draft.clientRequestId)
        // Return to the same step only after a reload or back navigation. A new visit starts at the beginning, with the answers kept.
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
        if (takeBookingResume()) setStep(3)
        else if (navigation?.type !== 'navigate' && typeof draft.step === 'number' && draft.step >= 0 && draft.step <= 3) setStep(draft.step as Step)
      }
    } catch {
      // Storage can be blocked or hold old data. The form still works from empty.
    }
    setDraftReady(true)
    // Runs once, after the first render, so server and browser HTML match.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!draftReady || finished.current) return
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), step, shipSlug, tripType, travelDate, returnDate, categoryCode, quantity, seatPreference, fullName, mobileNumber, email, coPassengers, paymentMethodType, transactionId, clientRequestId }))
    } catch {
      // Without storage, the booking simply is not restored after a reload.
    }
  }, [draftReady, step, shipSlug, tripType, travelDate, returnDate, categoryCode, quantity, seatPreference, fullName, mobileNumber, email, coPassengers, paymentMethodType, transactionId, clientRequestId])

  // The phone's back button moves between steps instead of leaving the booking.
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, bookingStep: step }, '')
    const onPopState = (event: PopStateEvent) => {
      const previous = event.state?.bookingStep
      if (typeof previous === 'number') {
        setStep(previous as Step)
        setErrors({})
        setFormError('')
        moveFocus.current = true
        window.scrollTo({ top: 0 })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
    // Only the starting step is recorded here. Later steps are pushed by goTo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (moveFocus.current) {
      moveFocus.current = false
      heading.current?.focus({ preventScroll: true })
    }
  }, [step])

  // After a failed Continue or Submit, go to the first field that needs attention.
  useEffect(() => {
    const first = FIELD_ORDER.find((key) => errors[key])
    if (!first) return
    const target = first === 'coPassengers'
      ? document.querySelector<HTMLElement>('[aria-invalid="true"][id^="co-"]')
      : document.getElementById(first)
    if (!target) return
    target.focus({ preventScroll: true })
    target.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [errors])

  const goTo = (next: Step) => {
    window.history.pushState({ ...window.history.state, bookingStep: next }, '')
    moveFocus.current = true
    setStep(next)
    setErrors({})
    setFormError('')
    trackEvent('booking_step', { step: STEPS[next].name, ...(ship ? { ship_name: ship.name } : {}) })
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    if (step !== 3) return
    router.prefetch('/booking/success')
    router.prefetch('/booking/failed')
  }, [step, router])

  const clearError = (key: string) => {
    if (errors[key]) setErrors((current) => Object.fromEntries(Object.entries(current).filter(([name]) => name !== key)))
  }

  const validateStep = (current: Step): Errors => {
    const found: Errors = {}
    if (current === 0) {
      if (!shipSlug) found.shipSlug = 'Choose a ship'
      if (!travelDate) found.travelDate = 'Choose your journey date'
      else if (travelDate < today) found.travelDate = 'The journey date cannot be in the past'
      else if (travelDate > seasonEnd) found.travelDate = 'The tourist season ends on 15 March 2027'
      if (tripType === 'round_trip') {
        if (!returnDate) found.returnDate = 'Choose your return date'
        else if (travelDate && returnDate < travelDate) found.returnDate = 'The return date cannot be before the journey date'
        else if (returnDate > seasonEnd) found.returnDate = 'The tourist season ends on 15 March 2027'
      }
    }
    if (current === 1) {
      if (!category) found.categoryCode = 'Choose a seat or cabin to continue'
      else if (!fareFor(category)) found.categoryCode = 'This option has no fare for your trip type. Choose another, or contact us on WhatsApp'
    }
    return found
  }

  const payload = () => ({
    clientRequestId, shipSlug, categoryCode, tripType, travelDate,
    returnDate: tripType === 'round_trip' ? returnDate : null,
    quantity, seatPreference, fullName, mobileNumber, email,
    coPassengers: coPassengers.slice(0, Math.max(0, quantity - 1)).map((name) => (name ?? '').trim()).filter(Boolean),
    paymentMethodType, transactionId, acceptedTerms,
  })

  const fieldErrors = () => {
    const parsed = bookingSchema.safeParse(payload())
    const found: Errors = {}
    if (!parsed.success) for (const issue of parsed.error.issues) found[String(issue.path[0])] ??= issue.message
    return found
  }

  const next = () => {
    let found = validateStep(step)
    if (step === 2) {
      const all = fieldErrors()
      found = Object.fromEntries(Object.entries(all).filter(([key]) => ['fullName', 'mobileNumber', 'email', 'coPassengers'].includes(key)))
    }
    setErrors(found)
    if (Object.keys(found).length === 0) goTo((step + 1) as Step)
  }

  const submit = async () => {
    const found = fieldErrors()
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    let leaving = false
    try {
      const response = await fetch('/api/bookings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload()) })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        // A problem on our side gets its own page. A problem the customer can fix stays on the form.
        if (response.status >= 500 || !data) {
          leaving = true
          trackEvent('booking_failed', { error_code: data?.error?.code ?? `HTTP_${response.status}`, ...(ship ? { ship_name: ship.name } : {}) })
          saveBookingFailure({ code: data?.error?.code ?? `HTTP_${response.status}`, shipName: ship?.name ?? '', travelDate })
          router.push('/booking/failed')
          return
        }
        setErrors(data.error?.fields ?? {})
        setFormError(data.error?.message ?? 'We could not save your booking. Please try again.')
        return
      }
      leaving = true
      finished.current = true
      saveBookingOutcome({
        reference: data.reference, total: data.total, advance: data.advance, balance: data.balance, advancePercentage: data.advancePercentage,
        shipName: ship?.name ?? '', categoryName: category?.name ?? '', isCabin: category?.type === 'cabin', quantity, tripType, travelDate,
        returnDate: tripType === 'round_trip' ? returnDate : '', departs: outbound?.departs, returns: tripType === 'round_trip' ? inbound?.returns : undefined, paymentMethod: method?.name ?? '',
      })
      clearBookingFailure()
      try {
        window.sessionStorage.removeItem(DRAFT_KEY)
      } catch {
        // Nothing to clear if storage is blocked.
      }
      trackBookingSubmitted({ shipName: ship?.name ?? '', category: category?.name ?? '', tripType, tickets: quantity, value: data.total })
      // Replace, so the back button cannot return to a form that has already been sent.
      router.replace('/booking/success')
    } catch {
      setFormError('We could not reach our server. Your details are still here, so please try again. If you have already paid, contact us on WhatsApp.')
    } finally {
      if (!leaving) setSubmitting(false)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    if (step < 3) next()
    else void submit()
  }

  const describe = (id: string, hint?: boolean) => (errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined)

  const primaryLabel = step < 3 ? 'Continue' : submitting ? 'Submitting…' : 'Submit payment'
  const primaryIcon = submitting ? <Loader2 size={17} aria-hidden="true" className="animate-spin" /> : null

  const summary = (
    <aside className="rounded-2xl border border-line-soft bg-white p-5 shadow-card lg:sticky lg:top-24" aria-label="Booking summary">
      <h2 className="t-subtitle text-ink">Your booking</h2>
      <dl className="mt-3 space-y-2 text-sm">
        {ship && <div className="flex justify-between gap-4"><dt className="text-quiet">Ship</dt><dd className="text-right font-bold text-ink">{ship.name}</dd></div>}
        {category && <div className="flex justify-between gap-4"><dt className="text-quiet">{category.type === 'cabin' ? 'Cabin' : 'Seat'}</dt><dd className="text-right font-bold text-ink">{category.name} × {quantity}</dd></div>}
        {travelDate && (
          <div className="flex justify-between gap-4">
            <dt className="text-quiet">Journey</dt>
            <dd className="text-right font-bold text-ink">{prettyDate(travelDate)}{outbound && <span className="block text-xs font-semibold text-quiet">Leaves {outbound.departs}</span>}</dd>
          </div>
        )}
        {tripType === 'round_trip' && returnDate && (
          <div className="flex justify-between gap-4">
            <dt className="text-quiet">Return</dt>
            <dd className="text-right font-bold text-ink">{prettyDate(returnDate)}{inbound && <span className="block text-xs font-semibold text-quiet">Leaves {inbound.returns}</span>}</dd>
          </div>
        )}
      </dl>
      <dl className="mt-3 space-y-2 border-t border-line-soft pt-3">
        <div className="flex justify-between gap-4"><dt className="text-sm text-quiet">Total</dt><dd className="font-extrabold tabular-nums text-ink">{total ? taka(total) : '—'}</dd></div>
        {total > 0 && <div className="flex justify-between gap-4"><dt className="text-sm text-quiet">Balance due later</dt><dd className="font-extrabold tabular-nums text-ink">{taka(balance)}</dd></div>}
        <div className="flex items-baseline justify-between gap-4"><dt className="text-sm font-bold text-ink">Pay now ({catalog.advancePercentage}%)</dt><dd className="text-xl font-black tabular-nums text-brand-ink">{total ? taka(advance) : '—'}</dd></div>
      </dl>
      <p className="t-small mt-3 flex items-start gap-2 text-prose"><Ticket size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" /> QR-coded Travel Pass included</p>
      <button type="submit" form="booking-form" disabled={submitting} className={`${primaryButton} mt-4 hidden w-full lg:inline-flex`}>{primaryIcon}{primaryLabel}</button>
      <a href={helpLink(helpMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('booking_help', ship?.name)} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand-ink hover:underline">
        <MessageCircle size={17} aria-hidden="true" /> Need help? Ask on WhatsApp
      </a>
    </aside>
  )

  const categoryOption = (item: CatalogCategory) => {
    const price = fareFor(item)
    const selected = categoryCode === item.code
    const Icon = item.type === 'cabin' ? BedDouble : Armchair
    return (
      <label key={item.code} className={`relative flex overflow-hidden rounded-2xl border bg-white transition duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-ink/50 ${price ? 'cursor-pointer hover:shadow-card' : 'cursor-not-allowed opacity-60'} ${selected ? 'border-brand-ink ring-1 ring-brand-ink' : 'border-line-soft hover:border-line'}`}>
        <input type="radio" name="category" value={item.code} checked={selected} disabled={!price} onChange={() => { setCategoryCode(item.code); clearError('categoryCode') }} className="sr-only" />
        <span className="relative min-h-28 w-28 shrink-0 self-stretch bg-[#e7e7e7]">
          {item.photo ? (
            <Image src={item.photo} alt={item.photoAlt} fill sizes="112px" className="object-cover" />
          ) : (
            <Image src="/no-image.jpg" alt="" fill sizes="112px" className="object-contain" />
          )}
        </span>
        <span className="min-w-0 flex-1 p-3 pr-9">
          <span className="block font-extrabold leading-snug text-ink">{item.name}</span>
          {item.nameBn && <span lang="bn" className="block text-[0.8125rem] font-semibold text-brand-ink">{item.nameBn}</span>}
          {item.bestForBn && <span lang="bn" className="mt-0.5 block text-[0.8125rem] leading-snug text-prose">{item.bestForBn}</span>}
          <span className="mt-1.5 block text-lg font-black tabular-nums leading-tight text-ink">{price ? taka(price) : 'Not available for this trip'}</span>
          {price && <span className="block text-xs text-quiet">per {item.type === 'cabin' ? 'cabin' : 'person'}, {tripType === 'round_trip' ? 'round trip' : 'one way'}</span>}
          {item.type === 'seat' && price === lowestSeat && <span lang="bn" className="mt-1.5 inline-block rounded-md bg-[#e4f2ee] px-2 py-0.5 text-xs font-bold text-[#1d5c4b]">সবচেয়ে কম ভাড়া</span>}
        </span>
        <span aria-hidden="true" className={`absolute right-3 top-3 grid size-6 place-items-center rounded-full border transition-colors ${selected ? 'border-brand-ink bg-brand-ink text-white' : 'border-line bg-white text-transparent'}`}><Check size={15} /></span>
      </label>
    )
  }

  const current = STEPS[step]

  return (
    <div>
      <h1 className="text-xl font-extrabold tracking-tight text-ink md:text-2xl">Book your Saint Martin ship ticket</h1>

      <ol className="mt-4 grid grid-cols-4" aria-label="Booking steps">
        {STEPS.map((item, index) => {
          const done = index < step
          const active = index === step
          const marker = (
            <>
              <span className={`relative z-10 grid size-8 place-items-center rounded-full text-sm font-black transition-colors ${done ? 'bg-brand-ink text-white' : active ? 'bg-brand-ink text-white ring-4 ring-[#d3e9e2]' : 'bg-[#e9eeec] text-quiet'}`}>
                {done ? <Check size={16} aria-hidden="true" /> : index + 1}
              </span>
              <span className={`mt-1.5 block text-xs font-extrabold sm:text-sm ${active || done ? 'text-ink' : 'text-quiet'}`}>{item.name}<span className="sr-only">{done ? ', completed' : ''}</span></span>
            </>
          )
          return (
            <li key={item.name} aria-current={active ? 'step' : undefined} className="relative flex flex-col items-center text-center">
              {index > 0 && <span aria-hidden="true" className={`absolute right-1/2 top-4 h-0.5 w-full ${index <= step ? 'bg-brand-ink' : 'bg-[#e0e6e3]'}`} />}
              {done ? (
                <button type="button" onClick={() => goTo(index as Step)} className="flex min-h-11 cursor-pointer flex-col items-center rounded-lg px-1">{marker}</button>
              ) : (
                <span className="flex flex-col items-center px-1">{marker}</span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
        <form id="booking-form" noValidate onSubmit={onSubmit} className="min-w-0 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5 md:p-7">
          <div className="mb-5">
            <h2 ref={heading} tabIndex={-1} lang="bn" className="t-subtitle text-ink outline-none">{current.title}</h2>
            <p className="t-small mt-0.5 text-quiet">Step {step + 1} of 4. {current.subtitle}</p>
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <Field id="shipSlug" label="Ship" error={errors.shipSlug}>
                <select id="shipSlug" value={shipSlug} onChange={(event) => { setShipSlug(event.target.value); setCategoryCode(''); clearError('shipSlug') }} aria-invalid={Boolean(errors.shipSlug)} aria-describedby={describe('shipSlug')} className={inputClass}>
                  <option value="">Choose a ship</option>
                  {catalog.ships.map((item) => <option key={item.slug} value={item.slug}>{item.name}{item.nameBn ? ` (${item.nameBn})` : ''}</option>)}
                </select>
              </Field>
              <fieldset>
                <legend className="text-sm font-bold text-ink">Trip type</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-[#e9f0ee] p-1">
                  {([['round_trip', 'Round trip', 'যাওয়া-আসা'], ['one_way', 'One way', 'একমুখী']] as const).map(([value, label, bn]) => (
                    <label key={value} className={`flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-1 text-center transition duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-ink/50 ${tripType === value ? 'bg-white text-ink shadow-card' : 'text-quiet hover:text-ink'}`}>
                      <input type="radio" name="tripType" value={value} checked={tripType === value} onChange={() => setTripType(value)} className="sr-only" />
                      <span className="text-sm font-extrabold">{label}</span>
                      <span lang="bn" className="text-xs font-semibold">{bn}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="travelDate" label="Journey date" hint="Cox’s Bazar to Saint Martin" error={errors.travelDate}>
                  <input id="travelDate" type="date" min={earliest} max={seasonEnd} value={travelDate} onChange={(event) => { setTravelDate(event.target.value); clearError('travelDate') }} aria-invalid={Boolean(errors.travelDate)} aria-describedby={describe('travelDate', true)} className={inputClass} />
                  {outbound && <p className="t-small mt-1 flex items-center gap-1.5 font-semibold text-brand-ink"><Clock size={14} aria-hidden="true" /> Published time: leaves at {outbound.departs}</p>}
                </Field>
                {tripType === 'round_trip' && (
                  <Field id="returnDate" label="Return date" hint="Saint Martin to Cox’s Bazar" error={errors.returnDate}>
                    <input id="returnDate" type="date" min={travelDate || earliest} max={seasonEnd} value={returnDate} onChange={(event) => { setReturnDate(event.target.value); clearError('returnDate') }} aria-invalid={Boolean(errors.returnDate)} aria-describedby={describe('returnDate', true)} className={inputClass} />
                    {inbound && <p className="t-small mt-1 flex items-center gap-1.5 font-semibold text-brand-ink"><Clock size={14} aria-hidden="true" /> Published time: leaves at {inbound.returns}</p>}
                  </Field>
                )}
              </div>
            </div>
          )}

          {step === 1 && ship && (
            <div>
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f1f8f6] px-3.5 py-2">
                <p id="quantity-label" className="text-sm font-bold text-ink">Number of {category?.type === 'cabin' ? 'cabins' : 'tickets'}</p>
                <div className="inline-flex items-center gap-1" role="group" aria-labelledby="quantity-label">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} aria-label="Remove one" className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition disabled:cursor-not-allowed disabled:opacity-40"><Minus size={18} aria-hidden="true" /></button>
                  <output className="w-9 text-center text-lg font-black tabular-nums" aria-live="polite">{quantity}</output>
                  <button type="button" onClick={() => setQuantity(Math.min(MAX_TICKETS, quantity + 1))} disabled={quantity >= MAX_TICKETS} aria-label="Add one" className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink transition disabled:cursor-not-allowed disabled:opacity-40"><Plus size={18} aria-hidden="true" /></button>
                </div>
              </div>

              <fieldset id="categoryCode" tabIndex={-1} aria-describedby={describe('categoryCode')} className="mt-5 outline-none">
                <legend className="sr-only">Choose your seat or cabin on {ship.name}</legend>
                <FieldError id="categoryCode-error" message={errors.categoryCode} />
                {seats.length > 0 && (
                  <>
                    <h3 className="mb-2 mt-1 text-sm font-extrabold text-ink">Seats</h3>
                    <div className="grid gap-2.5 xl:grid-cols-2">{seats.map(categoryOption)}</div>
                  </>
                )}
                {cabins.length > 0 && (
                  <>
                    <h3 className="mb-2 mt-5 text-sm font-extrabold text-ink">Cabins</h3>
                    <div className="grid gap-2.5 xl:grid-cols-2">{cabins.map(categoryOption)}</div>
                  </>
                )}
              </fieldset>

              <details className="group mt-5 rounded-xl border border-line-soft">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-3.5 text-sm font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  Add a seat preference (optional)
                  <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-3.5 pb-3.5">
                  <Field id="seatPreference" label="Seat preference" hint="For example, seats together or near a window. We will try, but seat numbers are not guaranteed." error={errors.seatPreference}>
                    <input id="seatPreference" type="text" maxLength={200} value={seatPreference} onChange={(event) => setSeatPreference(event.target.value)} aria-describedby={describe('seatPreference', true)} className={inputClass} />
                  </Field>
                </div>
              </details>
              <p className="t-small mt-3 text-quiet">Our team confirms availability with the operator, and fares are checked again when you book.</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Field id="fullName" label="Full name (as on your NID)" error={errors.fullName}>
                <input id="fullName" type="text" autoComplete="name" value={fullName} onChange={(event) => { setFullName(event.target.value); clearError('fullName') }} aria-invalid={Boolean(errors.fullName)} aria-describedby={describe('fullName')} className={inputClass} />
              </Field>
              <Field id="mobileNumber" label="Mobile number (WhatsApp)" hint="For example, 01712345678" error={errors.mobileNumber}>
                <input id="mobileNumber" type="tel" inputMode="tel" autoComplete="tel" value={mobileNumber} onChange={(event) => { setMobileNumber(event.target.value); clearError('mobileNumber') }} aria-invalid={Boolean(errors.mobileNumber)} aria-describedby={describe('mobileNumber', true)} className={inputClass} />
              </Field>
              <Field id="email" label="Email (optional)" error={errors.email}>
                <input id="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); clearError('email') }} aria-invalid={Boolean(errors.email)} aria-describedby={describe('email')} className={inputClass} />
              </Field>
              {quantity > 1 && category?.type !== 'cabin' && (
                <fieldset className="space-y-3">
                  <legend className="text-sm font-bold text-ink">Other passengers (optional)</legend>
                  <p className="t-small text-quiet">You can add their names now, or send them on WhatsApp later.</p>
                  {Array.from({ length: quantity - 1 }, (_, index) => {
                    const value = coPassengers[index] ?? ''
                    const invalid = Boolean(errors.coPassengers) && value.trim().length > 0 && value.trim().length < 2
                    return (
                      <div key={index}>
                        <label htmlFor={`co-${index}`} className="text-sm font-bold text-ink">Passenger {index + 2}</label>
                        <input id={`co-${index}`} type="text" autoComplete="off" value={value} aria-invalid={invalid} onChange={(event) => { const copy = Array.from({ length: quantity - 1 }, (_, position) => coPassengers[position] ?? ''); copy[index] = event.target.value; setCoPassengers(copy); clearError('coPassengers') }} className={inputClass} />
                      </div>
                    )
                  })}
                  <FieldError id="coPassengers-error" message={errors.coPassengers ? 'Enter a full name for each passenger you add' : undefined} />
                </fieldset>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <fieldset>
                <legend className="text-sm font-bold text-ink">Payment method</legend>
                <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-[#e9f0ee] p-1">
                  {catalog.paymentMethods.map((item) => (
                    <label key={item.type} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-lg px-2 py-1 text-center text-sm font-extrabold transition duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-ink/50 ${paymentMethodType === item.type ? 'bg-white text-ink shadow-card' : 'text-quiet hover:text-ink'}`}>
                      <input type="radio" name="paymentMethod" value={item.type} checked={paymentMethodType === item.type} onChange={() => setPaymentMethodType(item.type)} className="sr-only" />
                      {item.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="rounded-2xl bg-[#f1f8f6] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-quiet">Pay now ({catalog.advancePercentage}% advance)</p>
                    <p className="text-[1.75rem] font-black leading-tight tabular-nums text-brand-ink">{taka(advance)}</p>
                  </div>
                  <CopyButton value={String(advance)} label="amount" />
                </div>
                {method?.instructionsBn && <PaymentInstructions text={method.instructionsBn} />}
                {method?.instructions && (
                  <details className="group mt-3">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-bold text-brand-ink marker:content-none [&::-webkit-details-marker]:hidden">
                      Read in English
                      <ChevronDown size={16} aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="t-small text-prose">{method.instructions}</p>
                  </details>
                )}
              </div>

              <p className="t-small text-prose">Pay the balance when your ticket is issued, collected or delivered. If your seat or cabin is not available, you can choose another date or ship, or get your advance back in full.</p>

              <Field id="transactionId" label="Transaction ID (TrxID)" hint="Enter this after you have paid. You will find it in your payment confirmation." error={errors.transactionId}>
                <input id="transactionId" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} value={transactionId} onChange={(event) => { setTransactionId(event.target.value.toUpperCase()); clearError('transactionId') }} aria-invalid={Boolean(errors.transactionId)} aria-describedby={describe('transactionId', true)} className={`${inputClass} font-bold tracking-wide`} />
              </Field>

              <div>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-ink">
                  <input id="acceptedTerms" type="checkbox" checked={acceptedTerms} onChange={(event) => { setAcceptedTerms(event.target.checked); clearError('acceptedTerms') }} aria-invalid={Boolean(errors.acceptedTerms)} aria-describedby={describe('acceptedTerms')} className="mt-0.5 size-5 shrink-0 accent-brand-ink" />
                  <span>Refunds depend on the ticket conditions and the operator’s cancellation policy. I have read the <a href="/booking-policy" target="_blank" className="font-bold text-brand-ink underline">booking policy</a> and provided accurate information.</span>
                </label>
                <FieldError id="acceptedTerms-error" message={errors.acceptedTerms} />
              </div>
            </div>
          )}

          {formError && <p role="alert" className="mt-5 rounded-xl border border-[#b42318] bg-[#fef3f2] p-3 text-sm font-semibold text-[#b42318]">{formError}</p>}

          <div className="mt-6 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => goTo((step - 1) as Step)} className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-xl pr-3 text-sm font-bold text-ink transition-colors hover:text-brand-ink"><ChevronLeft size={18} aria-hidden="true" /> Back</button>
            ) : <span />}
            <button type="submit" disabled={submitting} className={`${primaryButton} hidden lg:inline-flex`}>{primaryIcon}{primaryLabel}</button>
          </div>
        </form>
        {summary}
      </div>

      {/* Phones and tablets: the amount and next action stay in reach on every step. */}
      <div data-ship-bar className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-line-soft bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-bar backdrop-blur lg:hidden">
        <a href={helpLink(helpMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsApp('booking_help', ship?.name)} aria-label="Need help? Ask on WhatsApp" className="grid size-12 shrink-0 place-items-center rounded-xl border border-line text-ink">
          <MessageCircle size={20} aria-hidden="true" />
        </a>
        {total > 0 && (
          <div className="min-w-0 flex-1 px-1">
            <p className="text-xs font-bold leading-tight text-quiet">Pay now</p>
            <p className="text-lg font-black leading-tight tabular-nums text-brand-ink">{taka(advance)}</p>
            <p className="truncate text-xs leading-tight text-quiet">Total {taka(total)}</p>
          </div>
        )}
        <button type="submit" form="booking-form" disabled={submitting} className={`${primaryButton} ${total > 0 ? 'shrink-0 px-4' : 'flex-1'}`}>{primaryIcon}{primaryLabel}</button>
      </div>
    </div>
  )
}
