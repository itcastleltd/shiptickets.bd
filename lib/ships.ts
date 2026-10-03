import shipsData from '@/content/ships.json'
import siteData from '@/content/site.json'
import reviewsData from '@/content/reviews.json'

export type TicketClass = {
  name: string
  nameBn?: string
  description: string
  oneWayFare: string
  roundTripFare: string
  downFare?: string
  deck?: string
  seatCount?: string
}

export type Cabin = {
  name: string
  nameBn?: string
  description: string
  capacity: string
  oneWayFare?: string
  roundTripFare?: string
}

export type Facility = {
  name: string
  available?: boolean
}

export type ShipStatus = 'verified' | 'needs_confirmation' | 'seasonal_confirmation'

export type ShipSpec = { label: string; value: string }

export type CategoryGuidance = {
  category: string
  bestFor: string
  privacy: string
  outdoor: string
  priceLevel: string
}

export type Ship = {
  slug: string
  name: string
  nameBn: string
  /**
   * Short Bengali summary of the vessel, rendered on the ship page beneath the
   * English Quick Answer. Required rather than optional so a ship can never
   * ship without it and quietly lose its Bangla-language content.
   */
  summaryBn: string
  route: string
  operator: string
  status: ShipStatus
  lastVerified: string
  source: string
  ticketClasses: TicketClass[]
  cabins: Cabin[]
  cabinNote?: string
  facilities: Facility[]
  oneWay: string
  roundTrip: string
  detail: string
  image?: string
  imageAlt?: string
  photoPending?: boolean
  capacity?: string
  journeyDuration?: string
  departure?: string
  jetty?: string
  checkIn?: string
  cancellation?: string
  gallery?: string[]
  specs?: ShipSpec[]
  categoryGuidance?: CategoryGuidance[]
  faq: [string, string][]
}

export type SeasonConfig = {
  label: string
  startDate: string
  startISO: string
  note: string
}

/**
 * A genuine, collected customer review.
 *
 * Only publish reviews that were really collected from a real customer through a
 * real channel (Google, Facebook, post-trip feedback call, WhatsApp survey).
 * Never invent a review, a rating or a review count — Google treats fabricated
 * review markup as structured-data spam, and in Bangladesh publishing invented
 * customer ratings is also a consumer-protection problem.
 *
 * Add entries here as real feedback arrives; the rating UI and Review schema
 * appear automatically once a ship has at least one entry.
 */
export type Review = {
  id: number
  name: string
  location?: string
  rating: number
  review_text: string
  date: string
  shipSlug?: string
}

export type SiteConfig = {
  whatsapp: string
  phone: string
  email: string
  office: string
  supportHours: string
  lastVerified: string
  lastReviewed: string
  updatedAt: string
  travellersAssisted: {
    count: number
    label: string
    period: string
    sources: string[]
  }
  businessRating: {
    ratingValue: number | null
    reviewCount: number | null
  }
  season: SeasonConfig
}

export const STATUS_LABELS: Record<ShipStatus, string> = {
  verified: 'Verified',
  needs_confirmation: 'Check latest schedule',
  seasonal_confirmation: 'Seasonal confirmation',
}

export const CONFIDENCE_LABELS = {
  verified: 'Operator-published',
  reference: 'Reference fare',
  seasonal: 'Seasonal confirmation',
  confirm: 'Confirm before booking',
} as const

const SHIP_STATUSES: ShipStatus[] = ['verified', 'needs_confirmation', 'seasonal_confirmation']
const REQUIRED_SHIP_FIELDS: (keyof Ship)[] = ['slug', 'name', 'nameBn', 'summaryBn', 'route', 'operator', 'status', 'lastVerified', 'source', 'detail', 'ticketClasses', 'facilities', 'faq']

const toAmount = (fare: string) => Number(fare.replace(/[^0-9]/g, ''))
const formatFare = (amount: number) => `৳${amount.toLocaleString('en-US')}`

function parseShip(entry: Record<string, unknown>, index: number): Ship {
  const slug = String(entry.slug ?? `entry-${index}`)
  const missing = REQUIRED_SHIP_FIELDS.filter((field) => {
    const value = entry[field]
    return value === undefined || value === null || value === ''
  })
  if (missing.length > 0) {
    throw new Error(`content/ships.json: ship "${slug}" is missing required field(s): ${missing.join(', ')}`)
  }
  if (!SHIP_STATUSES.includes(entry.status as ShipStatus)) {
    throw new Error(`content/ships.json: ship "${slug}" has invalid status "${String(entry.status)}". Use one of: ${SHIP_STATUSES.join(', ')}`)
  }
  if (!Array.isArray(entry.ticketClasses) || entry.ticketClasses.length === 0) {
    throw new Error(`content/ships.json: ship "${slug}" needs at least one ticket class with oneWayFare and roundTripFare`)
  }

  const ticketClasses = entry.ticketClasses as TicketClass[]
  ticketClasses.forEach((ticketClass, classIndex) => {
    if (!ticketClass?.name || !ticketClass?.oneWayFare || !ticketClass?.roundTripFare) {
      throw new Error(`content/ships.json: ship "${slug}" ticket class #${classIndex + 1} needs name, oneWayFare and roundTripFare`)
    }
  })

  const oneWayAmounts = ticketClasses.map((ticketClass) => toAmount(ticketClass.oneWayFare))
  const roundTripAmounts = ticketClasses.map((ticketClass) => toAmount(ticketClass.roundTripFare))

  return {
    ...(entry as unknown as Omit<Ship, 'oneWay' | 'roundTrip'>),
    cabins: Array.isArray(entry.cabins) ? (entry.cabins as Cabin[]) : [],
    oneWay: formatFare(Math.min(...oneWayAmounts)),
    roundTrip: formatFare(Math.min(...roundTripAmounts)),
  } as Ship
}

export const site: SiteConfig = siteData as SiteConfig

export const season: SeasonConfig = site.season

export const ships: Ship[] = (shipsData as unknown as Record<string, unknown>[]).map(parseShip)

const shipsBySlug = new Map(ships.map((ship) => [ship.slug, ship]))

if (shipsBySlug.size !== ships.length) {
  const duplicates = ships.filter((ship, index) => ships.findIndex((other) => other.slug === ship.slug) !== index)
  throw new Error(`content/ships.json: duplicate ship slug(s): ${duplicates.map((ship) => ship.slug).join(', ')}`)
}

export function getShipBySlug(slug: string): Ship | undefined {
  return shipsBySlug.get(slug)
}

const reviews = reviewsData as Review[]

reviews.forEach((review, index) => {
  if (typeof review.name !== 'string') {
    throw new Error(`content/reviews.json: entry #${index + 1} missing name`)
  }
  if (typeof review.review_text !== 'string') {
    throw new Error(`content/reviews.json: entry #${index + 1} missing review_text`)
  }
  if (typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
    throw new Error(`content/reviews.json: entry #${index + 1} has rating ${review.rating}, expected 1-5`)
  }
})

export function getReviewsForShip(slug: string): Review[] {
  return reviews.filter((review) => !review.shipSlug || review.shipSlug === slug)
}

export function getAllReviews(): Review[] {
  return reviews
}

export function getTravellersAssisted() {
  return site.travellersAssisted
}

/**
 * Business-level rating, taken from the real Google Business Profile.
 * Returns null while no verified rating is on file, so no rating is ever
 * asserted without a source behind it.
 */
export function getBusinessRating(): { ratingValue: number; reviewCount: number } | null {
  const { ratingValue, reviewCount } = site.businessRating
  if (typeof ratingValue !== 'number' || typeof reviewCount !== 'number') return null
  if (ratingValue < 1 || ratingValue > 5 || reviewCount < 1) return null
  return { ratingValue, reviewCount }
}

export const WHATSAPP_NUMBER = site.whatsapp
export const PHONE_NUMBER = site.phone
export const LAST_VERIFIED = site.lastVerified
export const LAST_REVIEWED = site.lastReviewed
