'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CircleAlert, MessageCircle, Minus, Phone, Plus } from 'lucide-react'
import { trackClickCTA, trackPhoneClick, trackWhatsApp } from '@/lib/gtm-events'

/** A Book now link that reports its click, for use from server-rendered pages. */
export function BookLink({ href, location, className, children }: { href: string; location: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className} onClick={() => trackClickCTA('book_now', location)}>
      {children}
    </Link>
  )
}

type TabItem = { id: string; label: string; detail?: string; content: ReactNode }

/**
 * Seats and cabins switcher.
 *
 * Both panels are rendered on the server, so every category and fare stays in
 * the HTML. Links to #cabins open the Cabins panel.
 */
export function CategoryTabs({ tabs, label }: { tabs: TabItem[]; label: string }) {
  const [active, setActive] = useState(tabs[0].id)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1)
      if (!tabs.some((tab) => tab.id === id)) return
      setActive(id)
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [tabs])

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = tabs.length - 1
    const next = event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    setActive(tabs[next].id)
    buttons.current[next]?.focus()
  }

  if (tabs.length === 1) return <div id={tabs[0].id} className="scroll-mt-36">{tabs[0].content}</div>

  return (
    <>
      <div role="tablist" aria-label={label} className="mb-5 grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-[#e9f0ee] p-1">
        {tabs.map((tab, index) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(element) => { buttons.current[index] = element }}
              type="button"
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={tab.id}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`min-h-14 cursor-pointer rounded-xl px-3 py-2 text-center transition duration-200 ${selected ? 'bg-white text-ink shadow-card' : 'text-quiet hover:text-ink'}`}
            >
              <span className="block text-base font-extrabold leading-tight">{tab.label}</span>
              {tab.detail && <span className={`mt-0.5 block text-xs font-bold ${selected ? 'text-brand-ink' : 'text-quiet'}`}>{tab.detail}</span>}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} id={tab.id} role="tabpanel" aria-labelledby={`${tab.id}-tab`} hidden={tab.id !== active} className="ship-fade scroll-mt-36">
          {tab.content}
        </div>
      ))}
    </>
  )
}

/**
 * Sticky section links.
 *
 * Shows the section being read, and hides the site header while scrolling down
 * on phones and tablets so the page keeps more of the screen.
 */
export function ShipSectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setCurrent(visible.target.id)
      },
      { rootMargin: '-130px 0px -60% 0px' },
    )
    items.forEach((item) => {
      const section = document.getElementById(item.id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    const box = scroller.current
    const chip = box?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!box || !chip) return
    box.scrollTo({ left: chip.offsetLeft - (box.clientWidth - chip.clientWidth) / 2, behavior: 'smooth' })
  }, [current])

  useEffect(() => {
    const root = document.documentElement
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const menuOpen = document.querySelector('header[data-site-header] [aria-expanded="true"]')
      if (menuOpen || y < 300 || y < lastY - 4) root.removeAttribute('data-header-hidden')
      else if (y > lastY + 4) root.setAttribute('data-header-hidden', '')
      lastY = y
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      root.removeAttribute('data-header-hidden')
    }
  }, [])

  return (
    <nav aria-label="On this page" className="ship-section-nav sticky z-30 -mx-5 mb-8 border-y border-line-soft bg-white/95 backdrop-blur lg:mx-0 lg:rounded-2xl lg:border">
      <div ref={scroller} className="relative flex items-center gap-1 overflow-x-auto px-3 py-1 [scrollbar-width:none] lg:px-2 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const selected = item.id === current
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={selected ? 'true' : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 text-sm font-bold transition duration-200 ${selected ? 'bg-[#e4f2ee] text-brand-ink' : 'text-quiet hover:text-brand-ink'}`}
            >
              {item.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

const dhakaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
const showDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

const FIRST_ROWS = 7

/**
 * Upcoming sailings for one ship.
 *
 * Every date stays in the HTML. Pages are static, so past dates are removed in
 * the visitor's browser, using today's date in Bangladesh.
 */
export function NextSailings({ rows, whatsappHref, initialToday }: { rows: { date: string; departs: string; returns: string }[]; whatsappHref: string; initialToday?: string }) {
  const [today, setToday] = useState<string | null>(initialToday ?? null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => setToday(dhakaToday()), [])

  const upcoming = rows.filter((row) => !today || row.date >= today)

  if (today && upcoming.length === 0) {
    return (
      <p className="t-body rounded-2xl bg-[#f7fbfa] p-4 text-prose">
        These published dates have passed. <a href={whatsappHref} className="font-extrabold text-brand-ink underline underline-offset-4">Ask us on WhatsApp</a> for the next sailing times.
      </p>
    )
  }

  const shown = new Set((showAll ? upcoming : upcoming.slice(0, FIRST_ROWS)).map((row) => row.date))

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#e3ecea] text-ink">
            <tr>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Date</th>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Leaves Cox’s Bazar</th>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Leaves Saint Martin</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((row) => {
              const isToday = row.date === today
              return (
                <tr key={row.date} hidden={!shown.has(row.date)} className={`border-t border-line-soft ${isToday ? 'bg-[#f1f8f6]' : ''}`}>
                  <td className="px-3 py-3 font-extrabold text-ink sm:px-4">
                    {showDate(row.date)}
                    {isToday && <span className="ml-2 inline-block rounded-full bg-brand-ink px-2 py-0.5 text-[0.7rem] font-extrabold text-white">Today</span>}
                  </td>
                  <td className="px-3 py-3 text-prose sm:px-4">{row.departs}</td>
                  <td className="px-3 py-3 text-prose sm:px-4">{row.returns}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {upcoming.length > FIRST_ROWS && (
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll(!showAll)}
          className="mt-3 inline-flex min-h-11 cursor-pointer items-center text-sm font-extrabold text-brand-ink underline-offset-4 hover:underline"
        >
          {showAll ? 'Show fewer dates' : `Show all ${upcoming.length} dates`}
        </button>
      )}
    </>
  )
}

/** Fixed bar on phones and tablets. Book now leads once online booking is on. */
export function ShipMobileBar({ bookHref, whatsappHref, phoneHref }: { bookHref?: string; whatsappHref: string; phoneHref: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const form = document.getElementById('quick-book')
    if (!form) { setShow(true); return }
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting))
    observer.observe(form)
    return () => observer.disconnect()
  }, [])
  const button = 'flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-extrabold text-white transition active:opacity-85'
  const whatsappLink = (
    <a href={whatsappHref} onClick={() => trackWhatsApp('mobile_cta')} className={`${button} bg-[#0d1b2a]`}>
      <MessageCircle size={16} aria-hidden="true" /> WhatsApp
    </a>
  )

  return (
    <div data-ship-bar inert={!show} className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line-soft bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-bar backdrop-blur transition-transform duration-200 lg:hidden ${show ? '' : 'translate-y-full'}`}>
      {whatsappLink}
      {bookHref ? (
        <BookLink href={bookHref} location="mobile_bar" className={`${button} bg-brand-ink`}>Book now</BookLink>
      ) : (
        <a href={phoneHref} onClick={() => trackPhoneClick('mobile_cta')} className={`${button} bg-brand-ink`}>
          <Phone size={16} aria-hidden="true" /> Call now
        </a>
      )}
    </div>
  )
}

const MAX_PASSENGERS = 20

/**
 * First-screen booking form. With online booking on it opens /booking with the
 * answers filled in. With booking off it opens WhatsApp with the same answers
 * written out, so nobody has to type them again.
 */
export function QuickBook({ shipSlug, shipName, minDate, maxDate, bookingEnabled, hasCabins, whatsappNumber }: {
  shipSlug: string
  shipName: string
  minDate: string
  maxDate: string
  bookingEnabled: boolean
  hasCabins: boolean
  whatsappNumber: string
}) {
  const router = useRouter()
  const [trip, setTrip] = useState<'round_trip' | 'one_way'>('round_trip')
  const [date, setDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(2)
  const [error, setError] = useState('')
  const [earliest, setEarliest] = useState(minDate)

  useEffect(() => {
    const today = dhakaToday()
    if (today > minDate) setEarliest(today)
  }, [minDate])

  const longDate = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!date) return setError('Choose your journey date')
    if (trip === 'round_trip' && !returnDate) return setError('Choose your return date')
    if (trip === 'round_trip' && returnDate < date) return setError('The return date cannot be before the journey date')
    setError('')
    if (bookingEnabled) {
      trackClickCTA('book_now', 'quick_form')
      const params = new URLSearchParams({ ship: shipSlug, trip, date, qty: String(passengers) })
      if (trip === 'round_trip') params.set('ret', returnDate)
      router.push(`/booking?${params}`)
      return
    }
    trackWhatsApp('quick_form', shipName)
    const when = trip === 'round_trip' ? `round trip, ${longDate(date)} to ${longDate(returnDate)}` : `one way on ${longDate(date)}`
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ShipTickets.bd, I want to check ${shipName} tickets: ${when}, ${passengers} passenger${passengers === 1 ? '' : 's'}.`)}`
  }

  const field = 'mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-line bg-white px-2 py-2 text-base text-ink focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/30 sm:px-3 [&::-webkit-calendar-picker-indicator]:m-0 [&::-webkit-calendar-picker-indicator]:p-0'
  const tripButton = (value: 'round_trip' | 'one_way', label: string) => (
    <button
      type="button"
      aria-pressed={trip === value}
      onClick={() => { setTrip(value); setError('') }}
      className={`min-h-11 cursor-pointer rounded-lg text-sm font-extrabold transition duration-200 ${trip === value ? 'bg-white text-ink shadow-card' : 'text-quiet hover:text-ink'}`}
    >
      {label}
    </button>
  )

  return (
    <form id="quick-book" onSubmit={submit} noValidate className="mt-4 rounded-2xl border border-line-soft bg-white p-4 shadow-card">
      <p lang="bn" className="text-base font-bold text-ink">কবে যাবেন?</p>
      <div role="group" aria-label="Trip type" className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-[#e9f0ee] p-1">
        {tripButton('round_trip', 'Round trip')}
        {tripButton('one_way', 'One way')}
      </div>

      <div className={`mt-3 grid gap-3 ${trip === 'round_trip' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <div className="min-w-0">
          <label htmlFor="quick-date" className="text-xs font-bold text-quiet">Journey date</label>
          <input id="quick-date" type="date" value={date} min={earliest} max={maxDate} onChange={(event) => { setDate(event.target.value); setError('') }} className={field} />
        </div>
        {trip === 'round_trip' && (
          <div className="min-w-0">
            <label htmlFor="quick-return" className="text-xs font-bold text-quiet">Return date</label>
            <input id="quick-return" type="date" value={returnDate} min={date || earliest} max={maxDate} onChange={(event) => { setReturnDate(event.target.value); setError('') }} className={field} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p id="quick-passengers" className="text-sm font-bold text-ink">Passengers</p>
        <div role="group" aria-labelledby="quick-passengers" className="inline-flex items-center gap-1">
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
      <p className="t-small mt-2 text-center text-quiet">
        {bookingEnabled ? (
          <>Next, choose your {hasCabins ? 'seat or cabin' : 'seat'}, or <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello ShipTickets.bd, I want to check ${shipName} tickets.`)}`} onClick={() => trackWhatsApp('quick_form', shipName)} className="font-bold text-brand-ink underline underline-offset-2">ask on WhatsApp</a>.</>
        ) : 'We reply with the fare and availability for your date.'}
      </p>
    </form>
  )
}
