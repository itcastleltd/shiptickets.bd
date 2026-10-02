import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('keari-cruise-dine')!

export const metadata = shipMetadata(
  ship,
  'Keari Cruise & Dine Ticket Price & Schedule',
  'Check Keari Cruise & Dine ticket prices, Exclusive, Coral and Pearl lounge categories, dining options, schedule, boarding point and booking information for Cox’s Bazar to Saint Martin.',
)

const quickAnswer: [string, string][] = [
  ['How much is a Keari Cruise & Dine ticket?', `Published reference fares list approximately ${ship.ticketClasses[0].oneWayFare} for Exclusive Lounge one way, ${ship.ticketClasses[1].oneWayFare} for Coral Lounge and ${ship.ticketClasses[2].oneWayFare} for Pearl Lounge. Round-trip reference fares start from ${ship.roundTrip}. Confirm current fares for your travel date before booking.`],
  ['Does Keari Cruise & Dine include food?', 'The vessel has a floating restaurant and dining facilities, but food inclusion depends on the selected ticket or package and current operator terms. Never assume that every ticket automatically includes a meal.'],
  ['Where does Keari Cruise & Dine depart from?', 'Published Keari information identifies the Cox’s Bazar / Nuniachhara BIWTA jetty area. Confirm the exact boarding point and reporting time for your specific sailing.'],
  ['How long does Keari Cruise & Dine take?', 'Sailing time varies by route, weather, tide and operating conditions. Use the date-specific schedule provided with your ticket rather than relying on a fixed duration.'],
  ['কেয়ারি ক্রুজের টিকিট কত টাকা?', 'প্রকাশিত রেফারেন্স ভাড়া অনুযায়ী Exclusive Lounge একমুখী প্রায় ৳২,০৭৫, Coral Lounge ৳২,৩২৫ এবং Pearl Lounge ৳২,৫৭৫। বর্তমান মূল্য ভ্রমণের তারিখ অনুযায়ী নিশ্চিত করতে হবে।'],
]

export default function KeariCruiseDinePage() {
  return (
    <ShipPage
      ship={ship}
      title="Keari Cruise & Dine Ticket Price, Schedule & Booking"
      description="Three air-conditioned lounge categories, a floating restaurant, sky deck and full vessel specifications, with directional fares and seasonal sailing guidance."
      quickAnswer={quickAnswer}
      beforeYouPay={[
        'Travel date and one-way or round trip',
        'Preferred lounge: Exclusive, Coral or Pearl',
        'Number of passengers',
        'Exact fare and direction of travel',
        'Whether meals or a dining package are included',
        'Reporting time and departure time',
        'Boarding jetty printed on your ticket',
        'Travel Pass and QR ticket requirements',
        'Cancellation and rescheduling policy',
      ]}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}