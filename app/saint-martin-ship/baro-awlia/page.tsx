import { getShipBySlug, ships } from '@/lib/ships'
import { shipFareMetadata } from '@/components/ship-page'
import { ShipBookingPage } from '@/components/ship-booking-page'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const ship = getShipBySlug('baro-awlia')!

export const metadata = shipFareMetadata(ship)

const quickAnswer: [string, string][] = [
  ['How much is a Baro Awlia ticket?', `Published operator fares start from ${ship.ticketClasses[0].oneWayFare} one way and ${ship.ticketClasses[0].roundTripFare} round trip for Main Deck and Sun Deck seating. Premium business seating and private cabins cost more. One-way cabin fares range from ৳6,000 for a Bunker Bed to ৳11,000 for a Family Bunker Cabin.`],
  ['Where does Baro Awlia depart from?', 'Published information identifies the Nuniarchhara BIWTA Jetty area in Cox’s Bazar. Some published material also refers to Inani in the route description, so confirm the boarding point printed on your ticket before travelling.'],
  ['Does Baro Awlia have cabins?', 'Yes. Published categories include Bunker Bed, Deluxe Cabin, Family Bunker Cabin, VIP Cabin and VVIP Cabin. Capacity, washroom arrangement and facilities vary by category.'],
  ['Is Baro Awlia available all year?', 'Saint Martin ship operations are seasonal. The 2026-2027 season runs from 1 November 2026 to 15 March 2027, and sailing dates, departure times and availability can change with government regulations, weather, tides and operator decisions.'],
  ['বার আউলিয়া জাহাজের টিকেটের দাম কত?', 'মেইন ডেক ও সান ডেকে জনপ্রতি একমুখী ভাড়া ৳২,২০০ এবং যাওয়া-আসা ৳৪,২০০। এসি বিজনেস চেয়ার ৳২,৩০০ থেকে, আর কেবিন ৳৬,০০০ থেকে শুরু। আপনার তারিখের ভাড়া ও সিট আছে কি না, টিকেট কাটার আগে ShipTickets.bd থেকে জেনে নিন।'],
]

export default function BaroAwliaPage() {
  return (
    <ShipBookingPage
      ship={ship}
      title="MV Baro Awlia Ticket Price, Schedule & Booking"
      quickAnswer={quickAnswer}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}