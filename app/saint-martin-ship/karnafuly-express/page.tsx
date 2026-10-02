import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('karnafuly-express')!

export const metadata = shipMetadata(
  ship,
  'MV Karnafuly Express Ticket Price & Schedule',
  'Check MV Karnafuly Express ticket prices, one-way and round-trip fares, cabins, seating classes, schedule, boarding point and booking information for Cox’s Bazar to Saint Martin.',
)

const quickAnswer: [string, string][] = [
  ['How much is a Karnafuly Express ticket?', `Published reference fares start from ${ship.ticketClasses[0].oneWayFare} one way for selected economy categories, with premium lounge and cabin categories costing more. Round-trip reference fares start from ${ship.roundTrip}. Fares change by sailing date and season, so confirm the exact fare for your travel date before booking.`],
  ['Where does Karnafuly Express depart from?', 'Published information identifies the Nuniachhara / BIWTA jetty area in Cox’s Bazar as the boarding point. Confirm the exact boarding location and check-in time for your sailing date.'],
  ['How long is the Karnafuly Express journey?', 'The Cox’s Bazar to Saint Martin journey is generally around 5 hours, although actual sailing time varies with weather, sea conditions and tide.'],
  ['Does Karnafuly Express have cabins?', 'Yes. Published fare structures include Single Cabin, Twin Cabin, VIP Cabin and VVIP Cabin categories, subject to sailing and operator inventory.'],
  ['কর্ণফুলী এক্সপ্রেস টিকিটের দাম কত?', 'প্রকাশিত রেফারেন্স ভাড়া অনুযায়ী কর্ণফুলী এক্সপ্রেসের ইকোনমি ক্যাটাগরি থেকে একমুখী টিকিট প্রায় ৳১,৮০০ থেকে শুরু। লাউঞ্জ ও কেবিনের ভাড়া বেশি। আপনার ভ্রমণের তারিখ অনুযায়ী বর্তমান ভাড়া নিশ্চিত করুন।'],
]

export default function KarnafulyExpressPage() {
  return (
    <ShipPage
      ship={ship}
      title="MV Karnafuly Express Ticket Price, Schedule & Booking"
      description="Economy, open deck, business and lounge categories plus single, twin, VIP and VVIP cabins, with fares, facilities and seasonal boarding guidance."
      quickAnswer={quickAnswer}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}