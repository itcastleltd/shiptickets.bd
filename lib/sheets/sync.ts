import { appendBookingRow } from '@/lib/sheets/client'
import { TICKET_OPTIONS, type TicketDelivery } from '@/lib/bookings/validate'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_ATTEMPTS = 10
type Row = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
const first = (value: Row | Row[] | null | undefined): Row => (Array.isArray(value) ? value[0] : value) ?? {}

async function buildRow(supabase: NonNullable<ReturnType<typeof createAdminClient>>, bookingId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      booking_reference, created_at, grand_total, advance_percentage, advance_amount, balance_due,
      customers ( full_name, mobile_number, email ),
      booking_items ( id, quantity, trip_type, travel_date, return_date, seat_preference, ship_categories ( name, ships ( name ) ) ),
      booking_passengers ( full_name, booking_item_id, mobile_number ),
      payments ( transaction_id, status, payment_methods ( name ) ),
      deliveries ( delivery_method, address )
    `)
    .eq('id', bookingId)
    .single()
  if (error || !data) throw new Error('Booking could not be read')

  const customer = first(data.customers)
  const item = first(data.booking_items)
  const category = first(item.ship_categories)
  const payment = first(data.payments)
  const coPassengers = ((data.booking_passengers ?? []) as Row[]).filter((person) => !person.mobile_number).map((person) => person.full_name)
  const delivery = first(data.deliveries)
  const ticketOption = TICKET_OPTIONS[delivery.delivery_method as TicketDelivery]
  const ticketCollection = ticketOption
    ? delivery.delivery_method === 'office' ? ticketOption.label : `${ticketOption.label} (${ticketOption.detail}): ${delivery.address ?? ''}`
    : ''
  const bookedAt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', dateStyle: 'short', timeStyle: 'short' }).format(new Date(data.created_at))

  return [
    data.booking_reference, bookedAt, first(category.ships).name ?? '', category.name ?? '',
    item.trip_type === 'round_trip' ? 'Round trip' : 'One way', item.travel_date ?? '', item.return_date ?? '',
    item.quantity ?? '', item.seat_preference ?? '', customer.full_name ?? '', customer.mobile_number ?? '', customer.email ?? '',
    coPassengers.join(', '), Number(data.grand_total), Number(data.advance_percentage), Number(data.advance_amount),
    Number(data.grand_total) - Number(data.advance_amount), first(payment.payment_methods).name ?? '', payment.transaction_id ?? '', payment.status ?? '',
    // Five blanks keep the staff columns U to Y empty on a new row.
    '', '', '', '', '', ticketCollection,
  ]
}

/**
 * Copies due bookings to the Sheet. The database stays the record, so a Google
 * failure only delays the copy. Errors are logged without customer details.
 */
export async function processSheetQueue(limit = 10): Promise<{ sent: number; failed: number }> {
  const supabase = createAdminClient()
  if (!supabase || !process.env.GOOGLE_SHEETS_ID) return { sent: 0, failed: 0 }

  const now = new Date()
  const { data: due, error } = await supabase
    .from('sheet_sync_queue')
    .select('id, booking_id, attempts, next_attempt_at')
    .eq('status', 'pending')
    .lte('next_attempt_at', now.toISOString())
    .order('created_at')
    .limit(limit)
  if (error || !due) return { sent: 0, failed: 0 }

  let sent = 0
  let failed = 0
  for (const job of due) {
    // Claiming pushes the time forward, so a parallel run skips this job.
    const attempts = job.attempts + 1
    const backoffMinutes = Math.min(2 ** attempts, 60)
    const { data: claimed } = await supabase
      .from('sheet_sync_queue')
      .update({ attempts, next_attempt_at: new Date(now.getTime() + backoffMinutes * 60_000).toISOString() })
      .eq('id', job.id)
      .eq('next_attempt_at', job.next_attempt_at)
      .select('id')
    if (!claimed?.length) continue

    try {
      await appendBookingRow(await buildRow(supabase, job.booking_id))
      await supabase.from('sheet_sync_queue').update({ status: 'sent', sent_at: new Date().toISOString(), last_error: null }).eq('id', job.id)
      sent++
    } catch (caught) {
      const message = caught instanceof Error ? caught.message.slice(0, 200) : 'Unknown error'
      console.error('Sheet sync failed', { job: job.id, attempts, message })
      await supabase
        .from('sheet_sync_queue')
        .update({ last_error: message, ...(attempts >= MAX_ATTEMPTS ? { status: 'failed' } : {}) })
        .eq('id', job.id)
      failed++
    }
  }
  return { sent, failed }
}
