import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('keari-sindbad')!

export const metadata = shipMetadata(
  ship,
  'Keari Sindbad Ticket Price & Schedule',
  'Check Keari Sindbad ticket prices, Main Deck, Open Deck and Bridge Deck fares, vessel specifications, schedule, boarding point and booking information for Cox’s Bazar to Saint Martin.',
)

const quickAnswer: [string, string][] = [
  ['How much is a Keari Sindbad ticket?', `Published reference fares list Main Deck at ${ship.ticketClasses[0].oneWayFare} one way, Open Deck at ${ship.ticketClasses[1].oneWayFare} and Bridge Deck at ${ship.ticketClasses[2].oneWayFare}. Round-trip fares start from ${ship.roundTrip}. Confirm the applicable fare for your travel date before payment.`],
  ['Where does Keari Sindbad depart from?', "Published information identifies the Nuniachhara BIWTA Jetty area in Cox's Bazar. Boarding arrangements can change between seasons, so confirm the jetty and reporting time printed on your ticket."],
  ['How long does Keari Sindbad take?', 'Sailing time varies by date, route, weather, sea conditions and tide. No fixed duration is published for this vessel, so use the schedule issued for your sailing date.'],
  ['Does Keari Sindbad have cabins?', 'No private cabin inventory is published for this vessel. KEARI Sindbad publishes Main Deck, Open Deck and Bridge Deck seating. If you need private accommodation, confirm availability with the operator before booking.'],
  ['কেয়ারি সিন্দবাদ টিকিটের দাম কত?', 'প্রকাশিত রেফারেন্স ভাড়া অনুযায়ী মেইন ডেক একমুখী ৳১,৮২৫, ওপেন ডেক ৳২,০৭৫ এবং ব্রিজ ডেক ৳২,৩২৫। রাউন্ড ট্রিপ ভাড়া মেইন ডেক ৳৩,৫০০ থেকে শুরু। আপনার ভ্রমণের তারিখ অনুযায়ী বর্তমান ভাড়া নিশ্চিত করুন।'],
]

export default function KeariSindbadPage() {
  return (
    <ShipPage
      ship={ship}
      title="Keari Sindbad Ticket Price, Schedule & Booking"
      description="Main Deck, Open Deck and Bridge Deck seating on a 346-passenger vessel, with published fares, vessel specifications, facilities and seasonal schedule guidance."
      quickAnswer={quickAnswer}
      beforeYouPay={[
        'Travel date and one-way or round trip',
        'Preferred deck: Main Deck, Open Deck or Bridge Deck',
        'Number of passengers',
        'Exact fare and return leg fare for your date',
        'Whether food is available and whether it is included',
        'Reporting time and departure time',
        'Boarding jetty printed on your ticket',
        'Travel Pass and QR ticket requirements',
        'Cancellation and rescheduling policy',
      ]}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}