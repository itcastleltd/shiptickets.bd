'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type BoardShip = {
  slug: string
  name: string
  rows?: { date: string; departs: string; returns: string }[]
  usual?: { departs: string; returns: string }
}

const dhakaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
const chipDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

const DAYS_SHOWN = 7
const isVeryEarly = (time: string) => /^[1-5]:\d{2} AM$/.test(time)

/**
 * Every date for a ship, for the schedule page. All rows stay in the server HTML
 * so search engines can read them. Past dates are tucked away in the browser.
 */
export function ScheduleDateTable({ rows, caption, whatsappHref, initialToday }: { rows: { date: string; departs: string; returns: string }[]; caption: string; whatsappHref: string; initialToday?: string }) {
  const [today, setToday] = useState<string | null>(initialToday ?? null)
  const [showPast, setShowPast] = useState(false)

  useEffect(() => setToday(dhakaToday()), [])

  const isPast = (date: string) => today !== null && date < today
  const pastCount = rows.filter((row) => isPast(row.date)).length
  const allPassed = today !== null && pastCount === rows.length

  return (
    <>
      {allPassed && (
        <p className="t-body mb-3 rounded-2xl bg-[#fff8ee] p-4 text-ink">
          These dates have passed and the next schedule has not been added yet. <a href={whatsappHref} className="font-extrabold text-brand-ink underline underline-offset-4">Ask us on WhatsApp</a> for your date.
        </p>
      )}
      <div hidden={allPassed && !showPast} className="overflow-hidden rounded-2xl border border-line-soft bg-white">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
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
                <tr key={row.date} hidden={isPast(row.date) && !showPast} className={`border-t border-line-soft ${isToday ? 'bg-[#f1f8f6]' : ''}`}>
                  <th scope="row" className="px-3 py-3 font-extrabold text-ink sm:px-4">
                    <time dateTime={row.date}>{chipDate(row.date)}</time>
                    {isToday && <span className="mt-1 block w-fit rounded-full bg-brand-ink px-2 py-0.5 text-[0.7rem] font-extrabold text-white sm:ml-2 sm:mt-0 sm:inline-block">Today</span>}
                  </th>
                  <td className="px-3 py-3 text-prose sm:px-4">
                    {row.departs}
                    {isVeryEarly(row.departs) && <span className="mt-0.5 block text-xs font-bold text-[#8a5a00] sm:ml-2 sm:mt-0 sm:inline">Very early</span>}
                  </td>
                  <td className="px-3 py-3 text-prose sm:px-4">{row.returns}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {pastCount > 0 && (
        <button
          type="button"
          aria-expanded={showPast}
          onClick={() => setShowPast(!showPast)}
          className="mt-2 inline-flex min-h-11 cursor-pointer items-center text-sm font-extrabold text-brand-ink underline-offset-4 hover:underline"
        >
          {showPast ? 'Hide past dates' : `Show ${pastCount} past ${pastCount === 1 ? 'date' : 'dates'}`}
        </button>
      )}
    </>
  )
}

/**
 * All ships' sailing times for one date. The first available date is in the
 * server HTML. Past dates are removed in the browser, because pages are static.
 */
export function ShipScheduleBoard({ ships, whatsappHref, initialToday }: { ships: BoardShip[]; whatsappHref: string; initialToday?: string }) {
  const allDates = [...new Set(ships.flatMap((ship) => ship.rows?.map((row) => row.date) ?? []))].sort()
  const [today, setToday] = useState<string | null>(initialToday ?? null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => setToday(dhakaToday()), [])

  const upcoming = allDates.filter((date) => !today || date >= today)
  const dates = upcoming.slice(0, DAYS_SHOWN)
  const active = selected && dates.includes(selected) ? selected : dates[0]

  return (
    <div>
      {dates.length > 0 && (
        <div role="group" aria-label="Choose a sailing date" className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {dates.map((date) => (
            <button
              key={date}
              type="button"
              aria-pressed={date === active}
              onClick={() => setSelected(date)}
              className={`min-h-11 shrink-0 cursor-pointer rounded-xl px-3.5 text-sm font-bold transition duration-200 ${date === active ? 'bg-brand-ink text-white' : 'border border-line-soft bg-white text-prose hover:border-brand-ink hover:text-brand-ink'}`}
            >
              {date === today ? 'Today' : chipDate(date)}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-white">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Saint Martin ship departure and return times{active ? ` for ${chipDate(active)}` : ''}</caption>
          <thead className="bg-[#e3ecea] text-ink">
            <tr>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Ship</th>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Leaves Cox’s Bazar</th>
              <th scope="col" className="px-3 py-3 font-bold sm:px-4">Leaves Saint Martin</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {ships.map((ship) => {
              const row = ship.rows?.find((item) => item.date === active)
              const times = row ?? ship.usual
              return (
                <tr key={ship.slug} className="border-t border-line-soft">
                  <th scope="row" className="px-3 py-3 font-extrabold text-ink sm:px-4">
                    <Link href={`/saint-martin-ship/${ship.slug}`} className="hover:text-brand-ink hover:underline">{ship.name}</Link>
                  </th>
                  {times ? (
                    <>
                      <td className="px-3 py-3 text-prose sm:px-4">{times.departs}{!row && ' *'}</td>
                      <td className="px-3 py-3 text-prose sm:px-4">{times.returns}{!row && ' *'}</td>
                    </>
                  ) : (
                    <td colSpan={2} className="px-3 py-3 text-prose sm:px-4">
                      Schedule not published yet. <a href={whatsappHref} className="font-bold text-brand-ink underline underline-offset-2">Ask for your date</a>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
