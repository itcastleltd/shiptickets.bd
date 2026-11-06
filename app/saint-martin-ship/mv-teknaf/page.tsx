import { getShipBySlug, ships } from '@/lib/ships'
import { shipFareMetadata } from '@/components/ship-page'
import { ShipBookingPage } from '@/components/ship-booking-page'

/** Refresh hourly, so crawlers without JavaScript get sailing times from today, not the build date. */
export const revalidate = 3600

const ship = getShipBySlug('mv-teknaf')!

export const metadata = shipFareMetadata(ship)

const quickAnswer: [string, string][] = [
  ['What is MV Teknaf?', 'MV Teknaf is a passenger vessel serving tourist travel between Cox’s Bazar and Saint Martin Island. It is operated by Parapaar Cruise Line PCL and is listed as Sailing 2026–27. Confirm the latest schedule and availability for your travel date.'],
  ['How much is an MV Teknaf ticket?', `MV Teknaf one-way fares start at ${ship.ticketClasses[0].oneWayFare} for Main Deck, ${ship.ticketClasses[1].oneWayFare} for Ocean Deck, ${ship.ticketClasses[2].oneWayFare} for Coral Lounge/Coral Deck, and ${ship.ticketClasses[4].oneWayFare} for Sky Dine/VIP Chair. Round-trip fares range from ${ship.ticketClasses[0].roundTripFare} to ${ship.ticketClasses[5].roundTripFare}. Cabin fares start from ${ship.cabins[0].oneWayFare} (Deluxe). Confirm final fares for your travel date.`],
  ['What seating categories are available on MV Teknaf?', 'Main Deck, Ocean Deck, Coral Lounge, Coral Deck, Sky Dine and VIP Chair are available. Actual availability depends on the sailing date.'],
  ['What cabin types are available on MV Teknaf?', 'Deluxe Cabin, VIP Cabin and Royal Cabin are available. Confirm cabin capacity, occupancy rules, amenities and final price before booking.'],
  ['Where does MV Teknaf depart from?', 'MV Teknaf departs from BIWTA Jetty in Nuniarchhara, Airport Road, Cox’s Bazar. Confirm the exact boarding point and reporting instructions for your travel date.'],
  ['How long does MV Teknaf take to reach Saint Martin?', 'Journey time is approximately 6–7 hours, depending on weather, sea conditions and operational instructions. Confirm the expected duration for your sailing.'],
  ['What time does MV Teknaf depart?', 'MV Teknaf leaves Cox’s Bazar at 7:00 AM and Saint Martin at 4:00 PM every day. The updated dated schedule has not been received yet, so follow the time printed on your ticket.'],
  ['How early should passengers check in?', 'Arrive at least one hour before departure. Follow the reporting time and check-in deadline printed on your ticket.'],
  ['Are MV Teknaf tickets refundable?', 'Cancellation and refund terms depend on the operator and ticket type. Confirm the applicable policy before payment.'],
  ['Is MV Teknaf currently operating?', 'Yes. MV Teknaf is sailing in the 2026–27 season and leaves Cox’s Bazar at 7:00 AM every day. Confirm availability for your date before you pay.'],
  ['Does MV Teknaf offer dining facilities?', 'Sky Dine is listed as a seating category. Dining availability, food service and meal inclusions should be confirmed with the operator.'],
  ['এমভি টেকনাফ জাহাজের টিকেটের দাম কত?', 'মেইন ডেকে জনপ্রতি একমুখী ৳১,৯০০ এবং যাওয়া-আসা ৳৩,৬০০। কেবিন ৳৬,১০০ থেকে শুরু। আপনার তারিখের ভাড়া ও সিট আছে কি না, টিকেট কাটার আগে ShipTickets.bd থেকে জেনে নিন।'],
  ['How can I check MV Teknaf ticket availability?', 'Contact ShipTickets.bd with your travel date, passenger count and preferred seat or cabin category. We’ll confirm the latest fare, sailing schedule and availability.'],
]

export default function TeknafPage() {
  return (
    <ShipBookingPage
      ship={ship}
      title="MV Teknaf Ticket Price, Schedule & Booking"
      quickAnswer={quickAnswer}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}
