import { getShipBySlug, ships } from '@/lib/ships'
import { shipFareMetadata } from '@/components/ship-page'
import { ShipBookingPage } from '@/components/ship-booking-page'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const ship = getShipBySlug('keari-cruise-dine')!

export const metadata = shipFareMetadata(ship)

const quickAnswer: [string, string][] = [
  ['How much is a Keari Cruise & Dine ticket?', `Published verified fares list approximately ${ship.ticketClasses[0].oneWayFare} for Exclusive Lounge one way, ${ship.ticketClasses[1].oneWayFare} for Coral Lounge and ${ship.ticketClasses[2].oneWayFare} for Pearl Lounge. Round-trip verified fares start from ${ship.roundTrip}. Confirm current fares for your travel date before booking.`],
  ['Does Keari Cruise & Dine include food?', 'The vessel has a floating restaurant and dining facilities, but food inclusion depends on the selected ticket or package and current operator terms. Never assume that every ticket automatically includes a meal.'],
  ['Where does Keari Cruise & Dine depart from?', 'Published Keari information identifies the Cox’s Bazar / Nuniarchhara BIWTA jetty area. Confirm the exact boarding point and reporting time for your specific sailing.'],
  ['How long does Keari Cruise & Dine take?', 'The crossing generally takes about 6 to 7 hours. Sailing time varies with weather, tide and operating conditions, so use the date-specific schedule provided with your ticket.'],
  ['কেয়ারি ক্রুজের টিকেটের দাম কত?', 'এক্সক্লুসিভ লাউঞ্জে জনপ্রতি একমুখী প্রকাশিত ভাড়া ৳২,২০০ এবং যাওয়া-আসা ৳৪,২০০। কোরাল লাউঞ্জে যাওয়া-আসা ৳৪,৭০০, আর পার্ল লাউঞ্জে ৳৫,২০০। আপনার তারিখের ছাড়ার সময়, টিকেট কাটার আগে ShipTickets.bd থেকে জেনে নিন।'],
]

export default function KeariCruiseDinePage() {
  return (
    <ShipBookingPage
      ship={ship}
      title="Keari Cruise & Dine Ticket Price, Schedule & Booking"
      quickAnswer={quickAnswer}
      checklist={[
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