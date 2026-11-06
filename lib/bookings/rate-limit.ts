import type { SupabaseClient } from '@supabase/supabase-js'

export const MAX_BOOKINGS_PER_HOUR = 5

/**
 * True when a mobile number has made too many bookings in the last hour. Each
 * booking adds one customer row, so this counts those. A repeat of a booking
 * already saved is allowed, because it only returns that booking. If the count
 * can't be read, the booking goes ahead, so a database hiccup never turns away a
 * paying customer.
 */
export async function isOverBookingLimit(supabase: SupabaseClient, mobileNumber: string, clientRequestId: string): Promise<boolean> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .eq('mobile_number', mobileNumber)
    .gte('created_at', since)
  if (error || (count ?? 0) < MAX_BOOKINGS_PER_HOUR) return false

  const { data: existing } = await supabase.from('bookings').select('id').eq('client_request_id', clientRequestId).maybeSingle()
  return !existing
}
