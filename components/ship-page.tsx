import type { Metadata } from 'next'
import { season, type Ship } from '@/lib/ships'

export function shipMetadata(ship: Ship, title: string, description: string): Metadata {
  const canonical = `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`

  return {
    // Long titles drop the site name, so Google is less likely to cut off the fare.
    title: `${title} | ShipTickets.bd`.length > 60 ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'ShipTickets.bd',
      locale: 'en_BD',
      alternateLocale: ['bn_BD'],
      images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: `${ship.name} ticket from ShipTickets.bd` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph.jpg'] },
  }
}

function lowestFare(fares: string[]): number | null {
  const amounts = fares.map((fare) => Number(fare.replace(/[^0-9]/g, ''))).filter((amount) => amount > 0)
  return amounts.length ? Math.min(...amounts) : null
}

const taka = (amount: number) => `৳${amount.toLocaleString('en-US')}`

/**
 * Builds a ship page's title and description from its published fares, so they
 * cannot drift from content/ships.json. Pass roundTripOnly for ships whose lead
 * fare should be the round trip.
 */
export function shipFareMetadata(ship: Ship, { roundTripOnly = false }: { roundTripOnly?: boolean } = {}): Metadata {
  const seasonLabel = season.label.replace('-20', '-')
  const oneWay = roundTripOnly ? null : lowestFare(ship.ticketClasses.map((item) => item.oneWayFare))
  const roundTrip = lowestFare(ship.ticketClasses.map((item) => item.roundTripFare))

  const titleFare = oneWay ? `: From ${taka(oneWay)}` : roundTrip ? `: ${taka(roundTrip)} Round Trip` : ''
  const fareParts = [oneWay && `${taka(oneWay)} one way`, roundTrip && `${taka(roundTrip)} round trip`].filter(Boolean)
  const fareText = fareParts.length ? `from ${fareParts.join(', ')}` : 'fares by class'
  const compare = ship.cabins?.length ? 'seats, cabins' : 'seats'

  return shipMetadata(
    ship,
    `${ship.name} Ticket Price ${seasonLabel}${titleFare}`,
    `${ship.name} (${ship.nameBn}) ticket price ${seasonLabel}: ${fareText}. Compare ${compare} and schedule to Saint Martin.`,
  )
}
