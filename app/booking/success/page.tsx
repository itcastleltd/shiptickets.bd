import type { Metadata } from 'next'
import { BookingSuccess } from '@/components/booking/booking-outcome'

export const metadata: Metadata = {
  title: 'Booking Received',
  description: 'Your Saint Martin ship ticket booking has been received.',
  robots: { index: false, follow: false },
}

export default function BookingSuccessPage() {
  return <BookingSuccess />
}
