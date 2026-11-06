/**
 * What the success and failed pages show. Kept in this browser tab only, so the
 * URL never holds a booking reference or customer details. Names, mobile numbers
 * and Transaction IDs are never stored here.
 */
export type BookingOutcome = {
  savedAt: number
  reference: string
  total: number
  advance: number
  balance: number
  advancePercentage: number
  shipName: string
  categoryName: string
  isCabin: boolean
  quantity: number
  tripType: 'one_way' | 'round_trip'
  travelDate: string
  returnDate: string
  departs?: string
  returns?: string
  paymentMethod: string
}

export type BookingFailure = { savedAt: number; code: string; shipName: string; travelDate: string }

const RESULT_KEY = 'shiptickets-booking-result'
const FAILURE_KEY = 'shiptickets-booking-failure'
const RESUME_KEY = 'shiptickets-booking-resume'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

function save(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Storage can be blocked. The pages then show their general message.
  }
}

function read<T extends { savedAt: number }>(key: string): T | null {
  try {
    const saved = window.sessionStorage.getItem(key)
    const value = saved ? (JSON.parse(saved) as T) : null
    if (!value) return null
    if (Date.now() - value.savedAt < MAX_AGE_MS) return value
    window.sessionStorage.removeItem(key)
  } catch {
    // Treated the same as nothing saved.
  }
  return null
}

export const saveBookingOutcome = (outcome: Omit<BookingOutcome, 'savedAt'>) => save(RESULT_KEY, JSON.stringify({ ...outcome, savedAt: Date.now() }))
export const readBookingOutcome = () => read<BookingOutcome>(RESULT_KEY)
export const readBookingFailure = () => read<BookingFailure>(FAILURE_KEY)

/** Also asks the form to reopen on the payment step, with the customer's answers. */
export function saveBookingFailure(failure: Omit<BookingFailure, 'savedAt'>) {
  save(FAILURE_KEY, JSON.stringify({ ...failure, savedAt: Date.now() }))
  save(RESUME_KEY, '1')
}

/** True once after a failed submit. */
export function takeBookingResume(): boolean {
  try {
    const resume = window.sessionStorage.getItem(RESUME_KEY) === '1'
    window.sessionStorage.removeItem(RESUME_KEY)
    return resume
  } catch {
    return false
  }
}

export function clearBookingFailure() {
  try {
    window.sessionStorage.removeItem(FAILURE_KEY)
    window.sessionStorage.removeItem(RESUME_KEY)
  } catch {
    // Nothing to clear if storage is blocked.
  }
}
