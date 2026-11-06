import { after, NextResponse } from 'next/server'
import { BOOKING_ENABLED, bookingSchema, type BookingResult } from '@/lib/bookings/validate'
import { isOverBookingLimit } from '@/lib/bookings/rate-limit'
import { processSheetQueue } from '@/lib/sheets/sync'
import { createAdminClient } from '@/lib/supabase/admin'

const fail = (status: number, code: string, message: string, fields?: Record<string, string>) =>
  NextResponse.json({ error: { code, message, fields } }, { status })

const KNOWN_ERRORS: Record<string, [number, string]> = {
  INVALID_QUANTITY: [400, 'Check the number of tickets.'],
  INVALID_DATE: [400, 'Check your travel dates.'],
  INVALID_DETAILS: [400, 'Check your details.'],
  CATEGORY_NOT_FOUND: [400, 'This seat or cabin is not available to book online. Please contact us on WhatsApp.'],
  FARE_MISSING: [409, 'We could not find a current fare for this option. Please contact us on WhatsApp.'],
  ADVANCE_NOT_SET: [503, 'Online booking is unavailable right now. Please contact us on WhatsApp.'],
  PAYMENT_METHOD_NOT_FOUND: [400, 'Choose a payment method.'],
}

export async function POST(request: Request) {
  if (!BOOKING_ENABLED) return fail(503, 'BOOKING_DISABLED', 'Online booking is not open yet. Please contact us on WhatsApp.')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return fail(400, 'INVALID_JSON', 'The booking could not be read. Please try again.')
  }

  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) fields[String(issue.path[0] ?? 'form')] ??= issue.message
    return fail(400, 'INVALID_INPUT', 'Please check the highlighted details.', fields)
  }

  const supabase = createAdminClient()
  if (!supabase) return fail(503, 'UNAVAILABLE', 'Online booking is unavailable right now. Please contact us on WhatsApp.')

  const input = parsed.data
  if (await isOverBookingLimit(supabase, input.mobileNumber, input.clientRequestId)) {
    return fail(429, 'TOO_MANY_BOOKINGS', 'This mobile number has made several bookings in the last hour. Please contact us on WhatsApp to book more tickets.')
  }

  const callBooking = () =>
    supabase.rpc('create_booking', {
      p_client_request_id: input.clientRequestId,
      p_ship_slug: input.shipSlug,
      p_category_code: input.categoryCode,
      p_trip_type: input.tripType,
      p_travel_date: input.travelDate,
      p_return_date: input.tripType === 'round_trip' ? input.returnDate : null,
      p_quantity: input.quantity,
      p_seat_preference: input.seatPreference,
      p_full_name: input.fullName,
      p_mobile_number: input.mobileNumber,
      p_email: input.email,
      p_co_passengers: input.coPassengers,
      p_payment_method_type: input.paymentMethodType,
      p_transaction_id: input.transactionId,
    })

  let { data, error } = await callBooking()
  // Two identical requests at once: the second now finds and returns the first booking.
  if (error?.code === '23505' && error.message.includes('client_request_id')) {
    ;({ data, error } = await callBooking())
  }

  if (error) {
    if (error.code === '23505' && error.message.includes('uq_payments_method_transaction')) {
      return fail(409, 'TRX_ALREADY_USED', 'This Transaction ID has already been used. Check it, or contact us on WhatsApp if you need help.', {
        transactionId: 'This Transaction ID has already been used',
      })
    }
    const known = KNOWN_ERRORS[error.message]
    if (known) return fail(known[0], error.message, known[1])
    console.error('Booking failed', { code: error.code })
    return fail(500, 'BOOKING_FAILED', 'We could not save your booking. Your details are still here. Please try again, or contact us on WhatsApp.')
  }

  after(async () => {
    try {
      await processSheetQueue()
    } catch {
      console.error('Sheet sync run failed')
    }
  })

  return NextResponse.json(data as BookingResult, { status: 201 })
}
