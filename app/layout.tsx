import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shiptickets.bd'),
  title: { default: 'Saint Martin Ship Ticket Bangladesh | Price, Schedule & Booking', template: '%s | ShipTickets.bd' },
  description: "Compare Saint Martin ship tickets, prices, schedules, cabins and facilities from Cox's Bazar. Check the latest verified information before booking.",
  keywords: ['Saint Martin ship ticket', 'Saint Martin ship ticket price', 'Cox’s Bazar to Saint Martin ship', 'সেন্টমার্টিন জাহাজের টিকিট'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: 'https://www.shiptickets.bd/', siteName: 'ShipTickets.bd', title: 'Saint Martin ship tickets, made simple.', description: 'Compare ships, check fares and book your Saint Martin journey with confidence.', images: [{ url: '/saint-martin-hero.png', width: 1100, height: 730, alt: "Passenger ship near Saint Martin's Island" }] },
  twitter: { card: 'summary_large_image', title: 'Saint Martin ship tickets, made simple.', description: 'Compare ships, check fares and book with confidence.', images: ['/saint-martin-hero.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  category: 'Travel information',
  authors: [{ name: 'ShipTickets.bd editorial team', url: 'https://www.shiptickets.bd' }],
  creator: 'ShipTickets.bd',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f7fbfb', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
