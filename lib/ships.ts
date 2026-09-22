export type TicketClass = {
  name: string
  nameBn?: string
  description: string
  oneWayFare: string
  roundTripFare: string
}

export type Cabin = {
  name: string
  nameBn?: string
  description: string
  capacity: string
}

export type Facility = {
  name: string
  available?: boolean
}

export type Ship = {
  slug: string
  name: string
  nameBn: string
  route: string
  operator: string
  status: 'verified' | 'needs_confirmation' | 'seasonal_confirmation'
  lastVerified: string
  source: string
  ticketClasses: TicketClass[]
  cabins: Cabin[]
  facilities: Facility[]
  oneWay: string
  roundTrip: string
  detail: string
  image?: string
  capacity?: string
  journeyDuration?: string
  departure?: string
  jetty?: string
  checkIn?: string
  cancellation?: string
  gallery?: string[]
  faq: [string, string][]
}

export const ships: Ship[] = [
  {
    slug: 'keari-sindbad',
    name: 'Keari Sindbad',
    nameBn: 'কেয়ারী সিন্দবাদ',
    operator: 'Keari Group',
    route: "Cox's Bazar → Saint Martin",
    status: 'seasonal_confirmation',
    lastVerified: '21 September 2026',
    source: 'Operator-published reference; confirm for your travel date',
    ticketClasses: [
      { name: 'Open Deck', nameBn: 'ওপেন ডেক', description: 'Outdoor deck seating', oneWayFare: '৳1,500', roundTripFare: '৳3,000' },
      { name: 'Lounge', nameBn: 'লাউঞ্জ', description: 'Indoor comfort seating', oneWayFare: '৳1,800', roundTripFare: '৳3,600' },
    ],
    cabins: [
      { name: 'AC Lounge', description: 'Air-conditioned lounge seating', capacity: 'Per person' },
      { name: 'Family Cabin', nameBn: 'ফ্যামিলি কেবিন', description: 'Private family accommodation', capacity: 'Up to 4 passengers' },
    ],
    facilities: [
      { name: 'Washroom', available: true },
      { name: 'Open deck', available: true },
      { name: 'Reserved seating', available: true },
      { name: 'Food service', available: false },
    ],
    oneWay: '৳1,500',
    roundTrip: '৳3,000',
    image: '/ship/Keari-Sindbad.jpg',
    capacity: 'Approx. 400 passengers',
    journeyDuration: 'Approx. 2 hours',
    departure: '05:00 (seasonal — confirm latest schedule)',
    jetty: 'BIWTA Nuniachhara Jetty, Cox\'s Bazar',
    checkIn: '30 minutes before departure',
    cancellation: 'Subject to operator and season rules; confirm before payment',
    gallery: ['/ship/Keari-Sindbad.jpg'],
    detail: 'Popular passenger vessel with open deck, AC lounge and family-friendly seating.',
    faq: [
      ['Is Keari Sindbad operating today?', 'Operating status is seasonal and should be confirmed for your travel date before booking.'],
      ['What classes does Keari Sindbad offer?', 'Typical classes include open deck and AC lounge. Cabin options may also be available subject to the sailing.'],
      ['How much is a Keari Sindbad ticket?', 'Indicative one-way fare starts at ৳1,500 and round-trip from ৳3,000. Confirm the latest price for your date on WhatsApp.'],
      ['Where does Keari Sindbad depart from?', 'Departs from the BIWTA Nuniachhara jetty in Cox\'s Bazar. Verify the latest departure jetty and check-in time before travel.'],
      ['Does Keari Sindbad have AC seating?', 'Keari Sindbad offers AC lounge seating. Confirm AC availability for your specific sailing date.'],
      ['Can I book a cabin on Keari Sindbad?', 'Family cabins may be available subject to operator inventory. Confirm cabin type, occupancy and included facilities before payment.'],
      ['Do I need a Travel Pass for Keari Sindbad?', 'A Travel Pass and QR-coded ticket are required for Saint Martin entry during the tourist season. Check the latest government rules before travel.'],
      ['What is the cancellation policy for Keari Sindbad?', 'Cancellation depends on the operator and season. Confirm the policy before payment.'],
      ['How long is the journey on Keari Sindbad?', 'The Cox\'s Bazar to Saint Martin crossing takes approximately 2 hours. Sailing time varies with weather and sea conditions.'],
    ],
  },
  {
    slug: 'keari-cruise-dine',
    name: 'Keari Cruise & Dine',
    nameBn: 'কেয়ারী ক্রুজ অ্যান্ড ডাইন',
    operator: 'Keari Group',
    route: "Cox's Bazar → Saint Martin",
    status: 'needs_confirmation',
    lastVerified: '21 September 2026',
    source: 'Operator-published reference; confirm for your travel date',
    ticketClasses: [
      { name: 'Open Deck', nameBn: 'ওপেন ডেক', description: 'Outdoor deck seating', oneWayFare: '৳1,800', roundTripFare: '৳3,600' },
      { name: 'Lounge', nameBn: 'লাউঞ্জ', description: 'Indoor comfort seating', oneWayFare: '৳2,100', roundTripFare: '৳4,000' },
    ],
    cabins: [
      { name: 'Lounge', description: 'Indoor seated accommodation', capacity: 'Per person' },
      { name: 'Cabin', description: 'Private cabin space', capacity: 'Per person or per cabin' },
      { name: 'Dining area', description: 'Meal service area', capacity: 'Per person' },
    ],
    facilities: [
      { name: 'Restaurant/dining', available: true },
      { name: 'Washroom', available: true },
      { name: 'Indoor lounge', available: true },
      { name: 'Open deck', available: true },
    ],
    oneWay: '৳1,800',
    roundTrip: '৳3,600',
    image: '/ship/keari-cruise-dine.jpg',
    capacity: 'Approx. 200 passengers',
    journeyDuration: 'Approx. 2 hours',
    departure: '06:00 (seasonal — confirm latest schedule)',
    jetty: 'BIWTA Nuniachhara Jetty, Cox\'s Bazar',
    checkIn: '30 minutes before departure',
    cancellation: 'Subject to operator and season rules; confirm before payment',
    gallery: ['/ship/keari-cruise-dine.jpg'],
    detail: 'Cruise-style travel with lounge seating and dining options on selected classes.',
    faq: [
      ['Does Keari Cruise & Dine include dining?', 'Dining and inclusions depend on the selected package and current operator terms. Confirm them before booking.'],
      ['What is the route for Keari Cruise & Dine?', 'It operates on the Cox\'s Bazar to Saint Martin passenger route. Confirm the current departure port for your date.'],
      ['How much is a Keari Cruise & Dine ticket?', 'Indicative one-way fare starts at ৳1,800 and round-trip from ৳3,600. Confirm the latest price for your date on WhatsApp.'],
      ['Where does Keari Cruise & Dine depart from?', 'Departs from the BIWTA Nuniachhara jetty in Cox\'s Bazar. Verify the latest departure jetty and check-in time before travel.'],
      ['Does Keari Cruise & Dine have AC seating?', 'Keari Cruise & Dine offers indoor lounge seating with AC. Confirm AC availability for your specific sailing date.'],
      ['Do I need a Travel Pass for Keari Cruise & Dine?', 'A Travel Pass and QR-coded ticket are required for Saint Martin entry during the tourist season. Check the latest government rules before travel.'],
      ['What is the cancellation policy for Keari Cruise & Dine?', 'Cancellation depends on the operator and season. Confirm the policy before payment.'],
      ['How long is the journey on Keari Cruise & Dine?', 'The Cox\'s Bazar to Saint Martin crossing takes approximately 2 hours. Sailing time varies with weather and sea conditions.'],
    ],
  },
  {
    slug: 'bay-cruiser-1',
    name: 'MV Bay Cruiser 1',
    nameBn: 'এমভি বে ক্রুজার ১',
    operator: 'Bay Cruiser Shipping',
    route: "Cox's Bazar → Saint Martin",
    status: 'needs_confirmation',
    lastVerified: '21 September 2026',
    source: 'Operator-published reference; confirm for your travel date',
    ticketClasses: [
      { name: 'Open Deck', nameBn: 'ওপেন ডেক', description: 'Outdoor deck seating', oneWayFare: '৳1,500', roundTripFare: '৳3,000' },
      { name: 'AC Seating', nameBn: 'এসিসিটিং', description: 'Air-conditioned indoor seating', oneWayFare: '৳1,800', roundTripFare: '৳3,600' },
    ],
    cabins: [
      { name: 'Deck', description: 'Open deck seating', capacity: 'Per person' },
      { name: 'AC seating', description: 'Air-conditioned indoor seating', capacity: 'Per person' },
    ],
    facilities: [
      { name: 'Open deck', available: true },
      { name: 'Washroom', available: true },
      { name: 'AC seats', available: true },
      { name: 'Food service', available: false },
    ],
    oneWay: '৳1,500',
    roundTrip: '৳3,000',
    image: '/ship/bay-cruiser-1.jpg',
    capacity: 'Approx. 300 passengers',
    journeyDuration: 'Approx. 2 hours',
    departure: '06:00 (seasonal — confirm latest schedule)',
    jetty: 'BIWTA Nuniachhara Jetty, Cox\'s Bazar',
    checkIn: '30 minutes before departure',
    cancellation: 'Subject to operator and season rules; confirm before payment',
    gallery: ['/ship/bay-cruiser-1.jpg'],
    detail: 'Comfortable coastal vessel with practical deck and air-conditioned seating.',
    faq: [
      ['How can I check MV Bay Cruiser 1 tickets?', 'Share your travel date and passenger count with ShipTickets.bd to confirm current service and ticket guidance.'],
      ['What facilities are on MV Bay Cruiser 1?', 'Open deck, washroom and AC seating are typical. Confirm specific facilities for your sailing date.'],
      ['How much is an MV Bay Cruiser 1 ticket?', 'Indicative one-way fare starts at ৳1,500 and round-trip from ৳3,000. Confirm the latest price for your date on WhatsApp.'],
      ['Where does MV Bay Cruiser 1 depart from?', 'Departs from the BIWTA Nuniachhara jetty in Cox\'s Bazar. Verify the latest departure jetty and check-in time before travel.'],
      ['Does MV Bay Cruiser 1 have AC options?', 'MV Bay Cruiser 1 offers air-conditioned indoor seating. Confirm AC availability for your specific sailing date.'],
      ['Do I need a Travel Pass for MV Bay Cruiser 1?', 'A Travel Pass and QR-coded ticket are required for Saint Martin entry during the tourist season. Check the latest government rules before travel.'],
      ['What is the cancellation policy for MV Bay Cruiser 1?', 'Cancellation depends on the operator and season. Confirm the policy before payment.'],
      ['How long is the journey on MV Bay Cruiser 1?', 'The Cox\'s Bazar to Saint Martin crossing takes approximately 2 hours. Sailing time varies with weather and sea conditions.'],
    ],
  },
  {
    slug: 'karnafuly-express',
    name: 'MV Karnafuly Express',
    nameBn: 'কর্ণফুলী এক্সপ্রেস',
    operator: 'Karnafuly Shipbuilding & Engineering',
    route: "Cox's Bazar → Saint Martin",
    status: 'seasonal_confirmation',
    lastVerified: '21 September 2026',
    source: 'Operator-published reference; confirm for your travel date',
    ticketClasses: [
      { name: 'Open Deck', nameBn: 'ওপেন ডেক', description: 'Simple outdoor seating', oneWayFare: '৳2,000', roundTripFare: '৳4,000' },
      { name: 'Lavender', nameBn: 'লেভেন্ডার', description: 'Premium seat category', oneWayFare: '৳2,200', roundTripFare: '৳4,200' },
      { name: 'Marigold', nameBn: 'ম্যারিগোল্ড', description: 'Comfortable seating', oneWayFare: '৳2,500', roundTripFare: '৳4,800' },
      { name: 'Lilac Lounge', nameBn: 'লাইল্যাক লাউঞ্জ', description: 'Lounge seating', oneWayFare: '৳2,800', roundTripFare: '৳5,400' },
    ],
    cabins: [
      { name: 'Single Cabin', nameBn: 'সিঙ্গেল কেবিন', description: 'Single occupancy private cabin', capacity: '1 passenger' },
      { name: 'Twin Cabin', nameBn: 'টুইন কেবিন', description: 'Two passenger private cabin', capacity: '2 passengers' },
      { name: 'VIP Cabin', nameBn: 'ভিআইপি কেবিন', description: 'Premium private cabin', capacity: 'Per cabin' },
    ],
    facilities: [
      { name: 'Indoor and open-deck seating', available: true },
      { name: 'Premium lounge categories', available: true },
      { name: 'Restaurant/food service', available: true },
      { name: 'Prayer room', available: true },
      { name: 'Washrooms', available: true },
    ],
    oneWay: '৳2,000',
    roundTrip: '৳4,000',
    image: '/ship/karnafuly-express.jpg',
    capacity: 'Approx. 600 passengers',
    journeyDuration: 'Approx. 2 hours',
    departure: '05:00 (seasonal — confirm latest schedule)',
    jetty: 'BIWTA Nuniachhara Jetty, Cox\'s Bazar',
    checkIn: '30 minutes before departure',
    cancellation: 'Subject to operator and season rules; confirm before payment',
    gallery: ['/ship/karnafuly-express.jpg'],
    detail: 'Large passenger ship with multiple seating categories and cabin guidance.',
    faq: [
      ['What route does MV Karnafuly Express serve?', 'MV Karnafuly Express is listed for the Cox\'s Bazar to Saint Martin passenger route. Confirm the current departure port and sailing date before booking.' ],
      ['How much is an MV Karnafuly Express ticket?', 'The current one-way and return fare depends on the season, class and operator release. Share your travel date and passenger count on WhatsApp to verify the latest price.' ],
      ['Does MV Karnafuly Express have cabins?', 'Cabin availability can include single, twin and VIP categories, subject to the sailing and operator inventory. Confirm cabin type, occupancy and included facilities before payment.' ],
    ],
  },
  {
    slug: 'baro-awlia',
    name: 'MV Baro Awlia',
    nameBn: 'বারো আওলিয়া',
    operator: 'Baro Awlia Shipping',
    route: "Cox's Bazar → Saint Martin",
    status: 'seasonal_confirmation',
    lastVerified: '21 September 2026',
    source: 'Operator-published reference; confirm for your travel date',
    ticketClasses: [
      { name: 'Sun Deck', nameBn: 'সান ডেক', description: 'Open deck seating', oneWayFare: '৳1,800', roundTripFare: '৳3,500' },
      { name: 'Main Deck', nameBn: 'মেইন ডেক', description: 'Standard deck seating', oneWayFare: '৳2,100', roundTripFare: '৳4,000' },
      { name: 'Panorama Chair', nameBn: 'প্যানোরামা চেয়ার', description: 'Seaside chair seating', oneWayFare: '৳2,200', roundTripFare: '৳4,200' },
    ],
    cabins: [
      { name: 'Bunker Bed', description: 'Shared berth accommodation', capacity: 'Per person' },
      { name: 'Deluxe Cabin', nameBn: 'ডিলাক্স কেবিন', description: 'Premium cabin space', capacity: 'Per person or per cabin' },
      { name: 'Family Bunker / VIP Cabin', nameBn: 'ফ্যামিলি বাঙ্কার / ভিআইপি কেবিন', description: 'Family or premium private cabin', capacity: 'Up to 4 passengers' },
    ],
    facilities: [
      { name: 'Open deck', available: true },
      { name: 'Washroom', available: true },
      { name: 'Indoor seating', available: true },
      { name: 'Food service', available: false },
    ],
    oneWay: '৳1,800',
    roundTrip: '৳3,600',
    image: '/ship/baro-awlia.jpg',
    capacity: 'Approx. 400 passengers',
    journeyDuration: 'Approx. 2 hours',
    departure: '06:00 (seasonal — confirm latest schedule)',
    jetty: 'BIWTA Nuniachhara Jetty, Cox\'s Bazar',
    checkIn: '30 minutes before departure',
    cancellation: 'Subject to operator and season rules; confirm before payment',
    gallery: ['/ship/baro-awlia.jpg'],
    detail: 'Passenger ship offering deck, lounge and selected cabin options for the route.',
    faq: [
      ['How much is an MV Baro Awlia ticket?', 'The fare varies by season, class and cabin type. Share your travel date on WhatsApp to confirm the latest price.' ],
      ['Does MV Baro Awlia have AC options?', 'Some classes include air-conditioned seating and selected premium options. Confirm availability for your date.' ],
      ['Where does MV Baro Awlia depart from?', 'Departs from the BIWTA Nuniachhara jetty in Cox\'s Bazar. Verify the latest departure jetty and check-in time before travel.' ],
      ['Does MV Baro Awlia have cabins?', 'MV Baro Awlia offers Bunker Bed, Deluxe Cabin and Family Bunker/VIP Cabin options. Confirm cabin type and occupancy before payment.' ],
      ['Do I need a Travel Pass for MV Baro Awlia?', 'A Travel Pass and QR-coded ticket are required for Saint Martin entry during the tourist season. Check the latest government rules before travel.' ],
      ['What is the cancellation policy for MV Baro Awlia?', 'Cancellation depends on the operator and season. Confirm the policy before payment.' ],
      ['How long is the journey on MV Baro Awlia?', 'The Cox\'s Bazar to Saint Martin crossing takes approximately 2 hours. Sailing time varies with weather and sea conditions.' ],
    ],
  },
]

export function getShipBySlug(slug: string): Ship | undefined {
  return ships.find((ship) => ship.slug === slug)
}

export const WHATSAPP_NUMBER = '8801718116799'
export const PHONE_NUMBER = '+880 1718-116799'
export const LAST_VERIFIED = '21 September 2026'
