import type { Metadata } from 'next'
import { BookingFailed } from '@/components/booking/booking-outcome'

export const metadata: Metadata = {
  title: 'Booking Not Saved',
  description: 'Your Saint Martin ship ticket booking could not be saved.',
  robots: { index: false, follow: false },
}

export default function BookingFailedPage() {
  return <BookingFailed />
}
