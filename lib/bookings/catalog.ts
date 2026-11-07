import { unstable_cache } from 'next/cache'
import { seatPhotoAlt, seatPhotoSrc } from '@/lib/seat-photos'
import { getShipBySlug } from '@/lib/ships'
import { createAdminClient } from '@/lib/supabase/admin'

export type CatalogCategory = {
  code: string
  name: string
  nameBn: string | null
  type: 'seat' | 'cabin'
  photo: string | null
  photoAlt: string
  bestForBn: string | null
  oneWay: number | null
  roundTrip: number | null
}

export type CatalogShip = { slug: string; name: string; nameBn: string | null; categories: CatalogCategory[]; preBooking?: boolean }

export type CatalogPaymentMethod = {
  type: 'bkash_merchant' | 'bank_transfer'
  name: string
  instructions: string
  instructionsBn: string | null
}

export type BookingCatalog = {
  ships: CatalogShip[]
  advancePercentage: number
  paymentMethods: CatalogPaymentMethod[]
}

/**
 * Everything the booking steps need. Returns null when the database cannot
 * supply a complete catalog, and the page then offers WhatsApp booking.
 */
async function loadBookingCatalog(): Promise<BookingCatalog | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  try {
    const [shipRows, categoryRows, fareRows, setting, methodRows] = await Promise.all([
      supabase.from('ships').select('id, slug, name').eq('is_published', true),
      supabase.from('ship_categories').select('id, ship_id, name, name_bn, code, category_type').eq('is_active', true).order('sort_order'),
      supabase.from('fare_rules').select('category_id, amount, trip_type').eq('is_active', true).eq('fare_type', 'regular').eq('passenger_type', 'adult').not('trip_type', 'is', null),
      supabase.from('system_settings').select('value').eq('key', 'advance_percentage_office').maybeSingle(),
      supabase.from('payment_methods').select('name, type, instructions, instructions_bn').eq('is_active', true).in('type', ['bkash_merchant', 'bank_transfer']).order('sort_order'),
    ])

    if (shipRows.error || categoryRows.error || fareRows.error || setting.error || methodRows.error) {
      console.error('Booking catalog could not be loaded')
      return null
    }

    const advancePercentage = Number(setting.data?.value)
    if (setting.data?.value == null || !Number.isFinite(advancePercentage) || advancePercentage < 0 || advancePercentage > 100) return null

    const orderedSlugs = ['karnafuly-express', 'baro-awlia', 'mv-teknaf', 'keari-cruise-dine', 'keari-sindbad']
    const ships = shipRows.data
      .map((ship): CatalogShip => ({
        slug: ship.slug,
        name: ship.name,
        nameBn: getShipBySlug(ship.slug)?.nameBn ?? null,
        categories: categoryRows.data
          .filter((category) => category.ship_id === ship.id && category.code)
          .map((category): CatalogCategory => {
            const fare = (trip: string) => {
              const row = fareRows.data.find((item) => item.category_id === category.id && item.trip_type === trip)
              return row ? Number(row.amount) : null
            }
            const published = getShipBySlug(ship.slug)
            const details = [...(published?.ticketClasses ?? []), ...(published?.cabins ?? [])].find((item) => item.name === category.name)
            return {
              code: category.code,
              name: category.name,
              nameBn: category.name_bn,
              type: category.category_type === 'cabin' ? 'cabin' : 'seat',
              photo: seatPhotoSrc(ship.slug, category.name),
              photoAlt: seatPhotoAlt(ship.slug, category.name, ship.name),
              bestForBn: details?.bestForBn ?? null,
              oneWay: fare('one_way'),
              roundTrip: fare('round_trip'),
            }
          })
          .filter((category) => category.oneWay || category.roundTrip),
      }))
      .filter((ship) => ship.categories.length > 0)
      .sort((a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug))

    if (ships.length === 0 || methodRows.data.length === 0) return null

    return {
      ships,
      advancePercentage,
      paymentMethods: methodRows.data.map((method) => ({
        type: method.type,
        name: method.name,
        instructions: method.instructions ?? '',
        instructionsBn: method.instructions_bn,
      })),
    }
  } catch {
    console.error('Booking catalog could not be loaded')
    return null
  }
}

// A failure throws here so it is never cached, and the next visitor tries again.
const cachedCatalog = unstable_cache(async () => {
  const catalog = await loadBookingCatalog()
  if (!catalog) throw new Error('Booking catalog unavailable')
  return catalog
}, ['booking-catalog'], { revalidate: 300 })

/** The form's fares can be up to 5 minutes old. create_booking always charges the current database fare. */
export async function getBookingCatalog(): Promise<BookingCatalog | null> {
  try {
    const catalog = await cachedCatalog()
    // Outside the cache, so a change in a ship's approval applies straight away.
    return { ...catalog, ships: catalog.ships.filter((ship) => getShipBySlug(ship.slug)?.status !== 'awaiting_approval').map((ship) => ({ ...ship, preBooking: getShipBySlug(ship.slug)?.status === 'pre_booking' })) }
  } catch {
    return null
  }
}
