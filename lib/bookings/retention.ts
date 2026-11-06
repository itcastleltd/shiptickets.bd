import { clearPersonalDataFromSheet } from '@/lib/sheets/client'
import { createAdminClient } from '@/lib/supabase/admin'

export const RETENTION_DAYS = 365
const REMOVED = 'Removed'

type Row = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
const first = (value: Row | Row[] | null | undefined): Row => (Array.isArray(value) ? value[0] : value) ?? {}

/** The date before which a finished journey's personal details are removed, as YYYY-MM-DD. */
export const retentionCutoff = (now = new Date()) => new Date(now.getTime() - RETENTION_DAYS * 86_400_000).toISOString().slice(0, 10)

/**
 * Removes names, contact details and identity details once the last journey on a
 * booking is older than the cutoff. Reference, ship, dates, amounts and TrxID stay
 * for accounts. The Sheet is cleared first, so a Google failure is retried on the next run.
 */
export async function removeExpiredPersonalData(cutoff = retentionCutoff(), limit = 100): Promise<{ removed: number; failed: number }> {
  const supabase = createAdminClient()
  if (!supabase) return { removed: 0, failed: 0 }

  const { data, error } = await supabase
    .from('booking_items')
    .select('booking_id, travel_date, return_date, bookings!inner ( booking_reference, customer_id, customers!inner ( full_name ) )')
    .lt('travel_date', cutoff)
    .neq('bookings.customers.full_name', REMOVED)
    .order('travel_date')
    .limit(limit * 3)
  if (error) throw new Error(`Bookings could not be read (${error.code})`)

  // One row for each booking. A later return date, or any later item, keeps the booking.
  const candidates = new Map<string, { reference: string; customerId: string }>()
  for (const item of (data ?? []) as Row[]) {
    if (item.return_date && item.return_date >= cutoff) continue
    const booking = first(item.bookings)
    candidates.set(item.booking_id, { reference: booking.booking_reference, customerId: booking.customer_id })
  }
  const ids = [...candidates.keys()]
  if (ids.length > 0) {
    const { data: later, error: laterError } = await supabase.from('booking_items').select('booking_id').in('booking_id', ids).or(`travel_date.gte.${cutoff},return_date.gte.${cutoff}`)
    if (laterError) throw new Error(`Bookings could not be read (${laterError.code})`)
    for (const item of (later ?? []) as Row[]) candidates.delete(item.booking_id)
  }

  let removed = 0
  let failed = 0
  for (const [bookingId, { reference, customerId }] of [...candidates].slice(0, limit)) {
    try {
      await clearPersonalDataFromSheet(reference)
      const results = await Promise.all([
        supabase.from('booking_passengers').update({ full_name: REMOVED, mobile_number: null, nid_encrypted: null, date_of_birth: null }).eq('booking_id', bookingId),
        supabase.from('booking_items').update({ seat_preference: null }).eq('booking_id', bookingId),
        supabase.from('deliveries').update({ recipient_name: null, phone: null, address: null }).eq('booking_id', bookingId),
        supabase.from('bookings').update({ customer_note: null }).eq('id', bookingId),
      ])
      const failure = results.find((result) => result.error)
      if (failure?.error) throw new Error(`Booking could not be updated (${failure.error.code})`)
      // Last, because this marks the booking as done.
      const { error: customerError } = await supabase.from('customers').update({ full_name: REMOVED, mobile_number: REMOVED, email: null }).eq('id', customerId)
      if (customerError) throw new Error(`Customer could not be updated (${customerError.code})`)
      removed++
    } catch (caught) {
      console.error('Personal data removal failed', { bookingId, message: caught instanceof Error ? caught.message.slice(0, 200) : 'Unknown error' })
      failed++
    }
  }
  return { removed, failed }
}
