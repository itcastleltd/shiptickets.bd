import { z } from 'zod'

/** Accepts 01XXXXXXXXX, with an optional +88 prefix, spaces or dashes. */
export function normalizeMobile(value: string): string {
  return value.replace(/[\s-]/g, '').replace(/^\+?88(?=01)/, '')
}

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date')
const personName = z.string().trim().min(2, 'Enter the full name').max(100, 'This name is too long')

/** How the customer gets the printed ticket. The courier cost is paid with the payment. The server takes the charge from the database. */
export const TICKET_OPTIONS = {
  office: { label: 'Office pickup', labelBn: 'অফিস থেকে নেব', detail: 'Kawran Bazar, Dhaka. No courier cost.', charge: 0 },
  courier_dhaka: { label: 'Home delivery, inside Dhaka', labelBn: 'হোম ডেলিভারি, ঢাকার ভেতরে', detail: '৳80, next day', charge: 80 },
  courier_outside: { label: 'Home delivery, outside Dhaka', labelBn: 'হোম ডেলিভারি, ঢাকার বাইরে', detail: '৳130, 3 days', charge: 130 },
} as const
export type TicketDelivery = keyof typeof TICKET_OPTIONS

/** Delivery outside Dhaka needs the full fare online. Pre-bookings stay on the advance until the schedule is published. */
export const mustPayInFull = (delivery: string | undefined, preBooking: boolean | undefined) => delivery === 'courier_outside' && !preBooking

export const bookingSchema = z
  .object({
    clientRequestId: z.string().uuid(),
    shipSlug: z.string().min(1, 'Choose a ship').max(80),
    categoryCode: z.string().min(1, 'Choose a seat or cabin').max(80),
    tripType: z.enum(['one_way', 'round_trip']),
    travelDate: date,
    returnDate: z.string().optional().nullable(),
    quantity: z.number().int().min(1, 'Choose at least 1').max(20, 'For more than 20, contact us on WhatsApp'),
    seatPreference: z.string().trim().max(200, 'Keep this under 200 characters').optional().default(''),
    fullName: personName,
    mobileNumber: z
      .string()
      .transform(normalizeMobile)
      .refine((value) => /^01[3-9]\d{8}$/.test(value), 'Enter a Bangladeshi mobile number, such as 01712345678'),
    email: z.string({ required_error: 'Enter your email address' }).trim().min(1, 'Enter your email address').email('Enter a valid email address').max(200),
    // A cabin is counted per cabin, not per person, so the number of names is only known for seats.
    isCabin: z.boolean().optional().default(false),
    coPassengers: z.array(personName).max(19).optional().default([]),
    ticketDelivery: z.enum(['office', 'courier_dhaka', 'courier_outside'], { errorMap: () => ({ message: 'Choose how you will get your ticket' }) }),
    deliveryAddress: z.string().trim().max(500, 'Keep the address under 500 characters').optional().default(''),
    paymentMethodType: z.enum(['bkash_merchant', 'bank_transfer']),
    payInFull: z.boolean().optional().default(false),
    transactionId: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9][A-Z0-9/-]{5,39}$/, 'Enter the Transaction ID from your payment'),
    acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'Please accept this to continue' }) }),
  })
  .superRefine((value, context) => {
    if (!value.isCabin && value.coPassengers.length < value.quantity - 1) {
      context.addIssue({ code: 'custom', path: ['coPassengers'], message: 'Enter a full name for each passenger' })
    }
    if (value.ticketDelivery !== 'office' && value.deliveryAddress.length < 10) {
      context.addIssue({ code: 'custom', path: ['deliveryAddress'], message: 'Enter your full delivery address' })
    }
    if (value.tripType !== 'round_trip') return
    if (!value.returnDate || !/^\d{4}-\d{2}-\d{2}$/.test(value.returnDate)) {
      context.addIssue({ code: 'custom', path: ['returnDate'], message: 'Choose a return date' })
    } else if (value.returnDate < value.travelDate) {
      context.addIssue({ code: 'custom', path: ['returnDate'], message: 'The return date cannot be before the journey date' })
    }
  })

export type BookingInput = z.input<typeof bookingSchema>

export type BookingResult = {
  reference: string
  total: number
  advance: number
  balance: number
  advancePercentage: number
  courierCharge?: number
}

/** Today's date in Bangladesh, as YYYY-MM-DD. */
export function todayInDhaka(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
}

export const BOOKING_ENABLED = process.env.NEXT_PUBLIC_BOOKING_ENABLED === 'true'
