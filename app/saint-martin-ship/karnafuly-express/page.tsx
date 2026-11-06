import { getShipBySlug, ships } from '@/lib/ships'
import { shipFareMetadata } from '@/components/ship-page'
import { ShipBookingPage } from '@/components/ship-booking-page'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const ship = getShipBySlug('karnafuly-express')!

export const metadata = shipFareMetadata(ship)

const quickAnswer: [string, string][] = [
  ['How much is a Karnafuly Express ticket?', `Published operator fares start from ${ship.ticketClasses[0].oneWayFare} one way for selected economy categories, with premium lounge and cabin categories costing more. Round-trip operator fares start from ${ship.roundTrip}. Fares change by sailing date and season, so confirm the exact fare for your travel date before booking.`],
  ['Where does Karnafuly Express depart from?', 'Published information identifies the Nuniarchhara / BIWTA jetty area in Cox’s Bazar as the boarding point. Confirm the exact boarding location and check-in time for your sailing date.'],
  ['How long is the Karnafuly Express journey?', 'The Cox’s Bazar to Saint Martin journey is generally about 6 to 7 hours, although actual sailing time varies with weather, sea conditions and tide.'],
  ['Does Karnafuly Express have cabins?', 'Yes. Published fare structures include Single Cabin, Twin Cabin, VIP Cabin and VVIP Cabin categories, subject to sailing and operator inventory.'],
  ['কর্ণফুলী এক্সপ্রেস জাহাজের টিকেটের দাম কত?', 'ল্যাভেন্ডার ও ম্যারিগোল্ড ইকোনমি সিটে জনপ্রতি একমুখী ভাড়া ৳২,২০০ এবং যাওয়া-আসা ৳৪,২০০। লাউঞ্জ ৳২,৮০০ থেকে, আর কেবিন ৳৩,৬০০ থেকে শুরু। আপনার তারিখের ভাড়া ও সিট আছে কি না, টিকেট কাটার আগে ShipTickets.bd থেকে জেনে নিন।'],
]

export default function KarnafulyExpressPage() {
  return (
    <ShipBookingPage
      ship={ship}
      title="MV Karnafuly Express Ticket Price, Schedule & Booking"
      quickAnswer={quickAnswer}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}