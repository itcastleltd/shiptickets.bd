import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('karnafuly-express')!

export const metadata = shipMetadata(
  ship,
  'MV Karnafuly Express Fares & Schedule',
  'Check MV Karnafuly Express fares by class and cabin, schedule, boarding point and booking details for the Cox\u2019s Bazar to Saint Martin route.',
)

const quickAnswer: [string, string][] = [
  ['How much is a Karnafuly Express ticket?', `Published operator fares start from ${ship.ticketClasses[0].oneWayFare} one way for selected economy categories, with premium lounge and cabin categories costing more. Round-trip operator fares start from ${ship.roundTrip}. Fares change by sailing date and season, so confirm the exact fare for your travel date before booking.`],
  ['Where does Karnafuly Express depart from?', 'Published information identifies the Nuniarchhara / BIWTA jetty area in Cox’s Bazar as the boarding point. Confirm the exact boarding location and check-in time for your sailing date.'],
  ['How long is the Karnafuly Express journey?', 'The Cox’s Bazar to Saint Martin journey is generally around 5 hours, although actual sailing time varies with weather, sea conditions and tide.'],
  ['Does Karnafuly Express have cabins?', 'Yes. Published fare structures include Single Cabin, Twin Cabin, VIP Cabin and VVIP Cabin categories, subject to sailing and operator inventory.'],
  ['কর্ণফুলী এক্সপ্রেস টিকিটের দাম কত?', '২০২৬-২০২৭ সিজনের অপারেটরের ভাড়া অনুযায়ী কর্ণফুলী এক্সপ্রেসের টিকিটের দাম একমুখী জনপ্রতি ৳২,২০০ এবং রাউন্ড ট্রিপ জনপ্রতি ৳৪,২০০ থেকে শুরু, প্রযোজ্য ক্যাটাগরি অনুযায়ী লাউঞ্জ ও কেবিনের ভাড়া আলাদা হতে পারে। ভ্রমণের তারিখ অনুযায়ী সর্বশেষ টিকিটের দাম, প্রাপ্যতা ও জাহাজের সময়সূচি নিশ্চিত করতে ভিজিট করুন ShipTickets.bd'],
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