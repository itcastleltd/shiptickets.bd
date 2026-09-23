import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { GTMPageTracker } from '@/components/GTMPageTracker'

const gtmId = process.env.NEXT_PUBLIC_GTM_ID

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shiptickets.bd'),
  title: { default: 'Saint Martin Ship Tickets Bangladesh', template: '%s | ShipTickets.bd' },
  description: "Compare Saint Martin ship tickets, prices, schedules, cabins and facilities from Cox's Bazar. shiptickets.bd is an authorized ship ticket reseller. Check the latest verified information before booking.",
  keywords: ['Saint Martin ship ticket', 'Saint Martin ship ticket price', 'Cox’s Bazar to Saint Martin ship', 'সেন্টমার্টিন জাহাজের টিকিট'],
  alternates: { canonical: '/', languages: { 'en': 'https://www.shiptickets.bd/', 'bn': 'https://www.shiptickets.bd/' } },
  icons: {
    icon: [{ url: '/Icon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: '/apple-icon.png',
    shortcut: '/Icon.svg',
  },
  openGraph: { type: 'website', url: 'https://www.shiptickets.bd/', siteName: 'ShipTickets.bd', title: 'Saint Martin ship tickets, made simple.', description: 'Compare ships, check fares and book your Saint Martin journey with confidence. shiptickets.bd is an authorized ship ticket reseller.', images: [{ url: '/saint-martin-hero.jpg', width: 1100, height: 730, alt: "Passenger ship near Saint Martin's Island in Bangladesh" }] },
  twitter: { card: 'summary_large_image', title: 'Saint Martin ship tickets, made simple.', description: 'Compare ships, check fares and book with confidence. shiptickets.bd is an authorized ship ticket reseller.', images: ['/saint-martin-hero.jpg'] },
  category: 'Travel information',
  authors: [{ name: 'ShipTickets.bd editorial team', url: 'https://www.shiptickets.bd' }],
  creator: 'ShipTickets.bd',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f7fbfb', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
      </head>
      <body className="antialiased">
        {gtmId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <GTMPageTracker />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
