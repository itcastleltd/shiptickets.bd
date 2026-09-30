import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { GTMPageTracker } from '@/components/GTMPageTracker'

const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NXTPXRQK'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shiptickets.bd'),
  title: { default: 'Saint Martin Ship Tickets Bangladesh', template: '%s | ShipTickets.bd' },
  description: "Compare Saint Martin ship tickets, prices, schedules, cabins and facilities from Cox's Bazar. Check verified information and book your Saint Martin trip with ShipTickets.bd.",
  keywords: ['Saint Martin ship ticket', 'Saint Martin ship ticket price', 'Cox’s Bazar to Saint Martin ship', 'সেন্টমার্টিন জাহাজের টিকিট'],
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'ShipTickets.bd', statusBarStyle: 'default' },
  formatDetection: { telephone: false },
  openGraph: { type: 'website', url: 'https://www.shiptickets.bd/', siteName: 'ShipTickets.bd', title: 'Saint Martin ship tickets, made simple.', description: 'Compare ships, check fares and book your Saint Martin journey with confidence. shiptickets.bd is an authorized ship ticket reseller.', images: [{ url: '/og_image.png', width: 1200, height: 630, alt: "ShipTickets.bd - Saint Martin ship tickets" }] },
  twitter: { card: 'summary_large_image', title: 'Saint Martin ship tickets, made simple.', description: 'Compare ships, check fares and book with confidence. shiptickets.bd is an authorized ship ticket reseller.', images: ['/og_image.png'] },
  category: 'Travel information',
  authors: [{ name: 'Al Amin Hosain', url: 'https://www.shiptickets.bd' }],
  creator: 'Al Amin Hosain',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f7fbfb', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://facebook.com" />
        <link rel="dns-prefetch" href="https://instagram.com" />
        <link rel="preload" as="image" href="/og_image.png" />
        <link rel="alternate" type="application/rss+xml" title="ShipTickets.bd RSS" href="/rss.xml" />
        <link rel="mask-icon" href="/Icon.svg" color="#1d9e75" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Dhaka" />
        <meta name="author" content="Al Amin Hosain" />
        {gtmId && (
          <Script
            id="gtm-base"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
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
