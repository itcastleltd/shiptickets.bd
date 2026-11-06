import { getShipBySlug, ships } from '@/lib/ships'
import { shipFareMetadata } from '@/components/ship-page'
import { ShipBookingPage } from '@/components/ship-booking-page'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const ship = getShipBySlug('keari-sindbad')!

export const metadata = shipFareMetadata(ship)

const quickAnswer: [string, string][] = [
  ['How much is a Keari Sindbad ticket?', `Published verified fares list Main Deck at ${ship.ticketClasses[0].oneWayFare} one way, Open Deck at ${ship.ticketClasses[1].oneWayFare} and Bridge Deck at ${ship.ticketClasses[2].oneWayFare}. Round-trip fares start from ${ship.roundTrip}. Confirm the applicable fare for your travel date before payment.`],
  ['Where does Keari Sindbad depart from?', "Published information identifies the Nuniarchhara BIWTA Jetty area in Cox's Bazar. Boarding arrangements can change between seasons, so confirm the jetty and reporting time printed on your ticket."],
  ['How long does Keari Sindbad take?', 'The crossing generally takes about 6 to 7 hours. Sailing time varies by date, weather, sea conditions and tide, so use the schedule issued for your sailing date.'],
  ['Does Keari Sindbad have cabins?', 'No private cabin inventory is published for this vessel. KEARI Sindbad publishes Main Deck, Open Deck and Bridge Deck seating. If you need private accommodation, confirm availability with the operator before booking.'],
  ['কেয়ারি সিন্দবাদ জাহাজের টিকেটের দাম কত?', 'মেইন ডেকে জনপ্রতি একমুখী প্রকাশিত ভাড়া ৳২,০০০ এবং যাওয়া-আসা ৳৩,৭০০। ওপেন ডেকে যাওয়া-আসা ৳৪,২০০, আর ব্রিজ ডেকে ৳৪,৫০০। আপনার তারিখের ছাড়ার সময়, টিকেট কাটার আগে ShipTickets.bd থেকে জেনে নিন।'],
]

export default function KeariSindbadPage() {
  return (
    <ShipBookingPage
      ship={ship}
      title="Keari Sindbad Ticket Price, Schedule & Booking"
      quickAnswer={quickAnswer}
      checklist={[
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