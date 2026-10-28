import { getShipBySlug, ships } from '@/lib/ships'
import { ShipPage, shipMetadata } from '@/components/ship-page'

const ship = getShipBySlug('mv-teknaf')!

export const metadata = shipMetadata(
  ship,
  'MV Teknaf Ticket Price, Seats & Cabins',
  'Check MV Teknaf ticket prices by class and cabin, schedule, boarding point and booking details for the Cox’s Bazar to Saint Martin route.',
)

const quickAnswer: [string, string][] = [
  ['What is MV Teknaf?', 'MV Teknaf is a passenger vessel listed for tourist travel between Cox’s Bazar and Saint Martin Island. It is associated with Parapaar Cruise Line PCL. Confirm its current operating authorization and sailing schedule before planning a trip.'],
  ['How much is an MV Teknaf ticket?', 'The supplied verified fares range from ৳3,600 for Main Deck seating to ৳5,000 for Sky Dine and VIP Chair. The listed cabin fares range from ৳12,000 to ৳25,000. Confirm whether these prices are one-way or round-trip and whether cabin fares apply per cabin or per passenger.'],
  ['What seating categories are available on MV Teknaf?', 'The supplied fare sheet lists Main Deck, Ocean Deck, Coral Lounge, Coral Deck, Sky Dine and VIP Chair. Actual availability depends on the sailing date.'],
  ['What cabin types are available on MV Teknaf?', 'The supplied fare sheet lists Deluxe Cabin, VIP Cabin and Royal Cabin. Confirm cabin capacity, occupancy rules, amenities and final price before booking.'],
  ['Where does MV Teknaf depart from?', 'The listed Cox’s Bazar boarding location is BIWTA Jetty in Nunia Chara, Airport Road. Confirm the actual boarding point and reporting instructions for your travel date.'],
  ['How long does MV Teknaf take to reach Saint Martin?', 'A verified journey duration has not been established. Sailing time can depend on the vessel, weather, sea conditions and operational instructions. Confirm the expected duration with the operator.'],
  ['What time does MV Teknaf depart?', 'The departure time must be confirmed for the selected travel date. Seasonal schedules and tide conditions can affect sailing arrangements.'],
  ['How early should passengers check in?', 'Arriving at least one hour before departure is a useful planning recommendation, but the operator\'s reporting time and check-in deadline should be confirmed before travel.'],
  ['Are MV Teknaf tickets refundable?', 'The applicable cancellation and refund policy has not been verified. Ask the operator or ShipTickets.bd support to explain the ticket terms before payment.'],
  ['Is MV Teknaf currently operating?', 'Operation depends on seasonal authorization and the approved sailing schedule. Contact ShipTickets.bd support to verify whether MV Teknaf is authorized and available for your travel date.'],
  ['Does MV Teknaf offer dining facilities?', 'Sky Dine is listed as a seating category. However, dining availability, food service and meal inclusions should be confirmed with the operator.'],
  ['How can I check MV Teknaf ticket availability?', 'Contact ShipTickets.bd with your travel date, passenger count and preferred seat or cabin category. The support team can help you verify the applicable fare, sailing schedule and availability.'],
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
