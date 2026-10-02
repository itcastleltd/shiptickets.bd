import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('baro-awlia')!

export const metadata = shipMetadata(
  ship,
  'MV Baro Awlia Ticket Price & Schedule',
  'Check MV Baro Awlia ticket prices, seating classes, cabins, one-way and round-trip fares, schedule, boarding point and booking information for Cox’s Bazar to Saint Martin.',
)

const quickAnswer: [string, string][] = [
  ['How much is a Baro Awlia ticket?', `Published reference fares start from ${ship.ticketClasses[0].oneWayFare} one way and ${ship.ticketClasses[0].roundTripFare} round trip for Main Deck and Sun Deck seating. Premium business seating and private cabins cost more. Cabin fares range from about ${ship.cabins[0].oneWayFare} for a Bunker Bed to ${ship.cabins[ship.cabins.length - 1].oneWayFare} for a VVIP Cabin one way.`],
  ['Where does Baro Awlia depart from?', 'Published information identifies the Nuniachhara BIWTA Jetty area in Cox’s Bazar. Some published material also refers to Inani in the route description, so confirm the boarding point printed on your ticket before travelling.'],
  ['Does Baro Awlia have cabins?', 'Yes. Published categories include Bunker Bed, Deluxe Cabin, Family Bunker Cabin, VIP Cabin and VVIP Cabin. Capacity, washroom arrangement and facilities vary by category.'],
  ['Is Baro Awlia available all year?', 'Saint Martin ship operations are seasonal. The 2026-2027 season opens on 1 November 2026, and sailing dates, departure times and availability can change with government regulations, weather, tides and operator decisions.'],
  ['বারো আওলিয়া টিকিটের দাম কত?', 'প্রকাশিত রেফারেন্স ভাড়া অনুযায়ী মেইন ডেক ও সান ডেক ক্যাটাগরি থেকে একমুখী ৳১,৮০০ এবং রাউন্ড ট্রিপ ৳৩,৫০০। বিজনেস ক্লাস চেয়ার ও কেবিনের ভাড়া বেশি।'],
]

export default function BaroAwliaPage() {
  return (
    <ShipPage
      ship={ship}
      title="MV Baro Awlia Ticket Price, Schedule & Booking"
      description="Main Deck, Sun Deck, Panorama and Riviera business chairs, Mozarat seating and five cabin categories, with fares, seat counts and date-dependent schedules."
      quickAnswer={quickAnswer}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}