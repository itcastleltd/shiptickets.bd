import { z } from 'zod'

/** Accepts 01XXXXXXXXX, with an optional +88 prefix, spaces or dashes. */
export function normalizeMobile(value: string): string {
  return value.replace(/[\s-]/g, '').replace(/^\+?88(?=01)/, '')
}

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date')
const personName = z.string().trim().min(2, 'Enter the full name').max(100, 'This name is too long')

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
    email: z.union([z.literal(''), z.string().trim().email('Enter a valid email address').max(200)]).optional().default(''),
    coPassengers: z.array(personName).max(19).optional().default([]),
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
}

/** Today's date in Bangladesh, as YYYY-MM-DD. */
export function todayInDhaka(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date())
}

export const BOOKING_ENABLED = process.env.NEXT_PUBLIC_BOOKING_ENABLED === 'true'
