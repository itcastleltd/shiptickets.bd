import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('mv-teknaf')!

export const metadata = shipMetadata(
  ship,
  'MV Teknaf Ticket Price, Seats & Cabins',
  'Check MV Teknaf ticket prices by class and cabin, schedule, boarding point and booking details for the Cox’s Bazar to Saint Martin route.',
)

const quickAnswer: [string, string][] = [
  ['What is MV Teknaf?', 'MV Teknaf is a passenger vessel serving tourist travel between Cox’s Bazar and Saint Martin Island. It is operated by Parapaar Cruise Line PCL and is listed as Sailing 2026–27. Confirm the latest schedule and availability for your travel date.'],
  ['How much is an MV Teknaf ticket?', `MV Teknaf one-way fares start at ${ship.ticketClasses[0].oneWayFare} for Main Deck, ${ship.ticketClasses[1].oneWayFare} for Ocean Deck, ${ship.ticketClasses[2].oneWayFare} for Coral Lounge/Coral Deck, and ${ship.ticketClasses[4].oneWayFare} for Sky Dine/VIP Chair. Round-trip fares range from ${ship.ticketClasses[0].roundTripFare} to ${ship.ticketClasses[5].roundTripFare}. Cabin fares start from ${ship.cabins[0].oneWayFare} (Deluxe). Confirm final fares for your travel date.`],
  ['What seating categories are available on MV Teknaf?', 'Main Deck, Ocean Deck, Coral Lounge, Coral Deck, Sky Dine and VIP Chair are available. Actual availability depends on the sailing date.'],
  ['What cabin types are available on MV Teknaf?', 'Deluxe Cabin, VIP Cabin and Royal Cabin are available. Confirm cabin capacity, occupancy rules, amenities and final price before booking.'],
  ['Where does MV Teknaf depart from?', 'MV Teknaf departs from BIWTA Jetty in Nunia Chara, Airport Road, Cox’s Bazar. Confirm the exact boarding point and reporting instructions for your travel date.'],
  ['How long does MV Teknaf take to reach Saint Martin?', 'Journey time is approximately 6–7 hours, depending on weather, sea conditions and operational instructions. Confirm the expected duration for your sailing.'],
  ['What time does MV Teknaf depart?', 'Morning departures are typical, but exact departure and reporting times vary by date and season. Confirm for your selected travel date.'],
  ['How early should passengers check in?', 'Arrive at least one hour before departure. Follow the reporting time and check-in deadline printed on your ticket.'],
  ['Are MV Teknaf tickets refundable?', 'Cancellation and refund terms depend on the operator and ticket type. Confirm the applicable policy before payment.'],
  ['Is MV Teknaf currently operating?', 'MV Teknaf is listed as Sailing 2026–27. However, operations depend on final approvals and the daily schedule, so confirm availability for your travel date.'],
  ['Does MV Teknaf offer dining facilities?', 'Sky Dine is listed as a seating category. Dining availability, food service and meal inclusions should be confirmed with the operator.'],
  ['How can I check MV Teknaf ticket availability?', 'Contact ShipTickets.bd with your travel date, passenger count and preferred seat or cabin category. We’ll confirm the latest fare, sailing schedule and availability.'],
]

export default function TeknafPage() {
  return (
    <ShipPage
      ship={ship}
      title="MV Teknaf Ticket Price, Schedule & Booking"
      description="Seating categories, cabin types and verified fares for MV Teknaf on the Cox’s Bazar to Saint Martin route."
      quickAnswer={quickAnswer}
      relatedShips={ships.filter((other) => other.slug !== ship.slug)}
    />
  )
}
