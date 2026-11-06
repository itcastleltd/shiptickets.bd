export type SailingRow = {
  /** Calendar date of the sailing, in YYYY-MM-DD. */
  date: string
  departs: string
  returns: string
}

export type ShipSchedule = {
  title: string
  note: string
  rows: SailingRow[]
}

const sailing = (day: number, departs: string, returns: string): SailingRow => ({
  date: `2026-11-${String(day).padStart(2, '0')}`,
  departs,
  returns,
})

/** Karnafuly Cruise Line's published November 2026 times, shared by its two ships. */
const KARNAFULY_NOVEMBER_2026: SailingRow[] = [
  sailing(5, '7:00 AM', '3:00 PM'),
  sailing(6, '7:00 AM', '3:00 PM'),
  sailing(7, '7:00 AM', '3:00 PM'),
  sailing(8, '8:00 AM', '4:00 PM'),
  sailing(9, '8:00 AM', '4:00 PM'),
  sailing(10, '8:00 AM', '4:00 PM'),
  sailing(11, '9:00 AM', '5:00 PM'),
  sailing(12, '9:00 AM', '5:00 PM'),
  sailing(13, '10:00 AM', '5:00 PM'),
  sailing(14, '10:00 AM', '5:00 PM'),
  sailing(15, '10:00 AM', '5:00 PM'),
  sailing(16, '4:00 AM', '5:00 PM'),
  sailing(17, '4:00 AM', '5:00 PM'),
  sailing(18, '4:00 AM', '5:00 PM'),
  sailing(19, '6:00 AM', '3:00 PM'),
  sailing(20, '6:00 AM', '3:00 PM'),
  sailing(21, '7:00 AM', '4:00 PM'),
  sailing(22, '7:00 AM', '4:00 PM'),
  sailing(23, '7:00 AM', '4:00 PM'),
  sailing(24, '7:00 AM', '4:00 PM'),
  sailing(25, '8:00 AM', '4:00 PM'),
  sailing(26, '9:00 AM', '4:00 PM'),
  sailing(27, '9:00 AM', '4:00 PM'),
  sailing(28, '10:00 AM', '5:00 PM'),
  sailing(29, '10:00 AM', '5:00 PM'),
  sailing(30, '5:00 AM', '3:00 PM'),
]

/** The months the dated table covers. Change this when new months are added. */
export const DATED_SCHEDULE_PERIOD = 'November 2026'

const KARNAFULY_NOTE ='Operator: Karnafuly Cruise Line Ltd. Departure times subject to tide/ebb; confirm before travel.'

const schedules: Record<string, ShipSchedule> = {
  'baro-awlia': { title: 'November 2026 schedule', note: KARNAFULY_NOTE, rows: KARNAFULY_NOVEMBER_2026 },
  'karnafuly-express': { title: 'November 2026 schedule', note: KARNAFULY_NOTE, rows: KARNAFULY_NOVEMBER_2026 },
}

export function getShipSchedule(slug: string): ShipSchedule | undefined {
  return schedules[slug]
}

/** Daily times for ships with no dated table. */
const usualTimes: Record<string, { departs: string; returns: string }> = {
  'mv-teknaf': { departs: '7:00 AM', returns: '4:00 PM' },
}

export function getUsualTimes(slug: string) {
  return usualTimes[slug]
}

export const TEKNAF_TIME_NOTE = 'MV Teknaf leaves Cox’s Bazar at 7:00 AM and Saint Martin at 4:00 PM every day. Its updated dated schedule has not been received yet, so follow the time on your ticket.'

/** Today's date in Bangladesh, as YYYY-MM-DD. */
export const dhakaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
