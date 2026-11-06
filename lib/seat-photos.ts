import { existsSync } from 'node:fs'
import path from 'node:path'

const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png']

/** "Lavender Economy Seat" becomes "lavender-economy-seat". */
export function seatPhotoName(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Finds a category's photo at public/ship/<ship slug>/<category name>.<extension>.
 * Returns null when no photo has been added, so the card renders without one.
 * Server only: pages check the folder when they are built.
 */
export function seatPhotoSrc(shipSlug: string, categoryName: string): string | null {
  const name = seatPhotoName(categoryName)
  for (const extension of EXTENSIONS) {
    const file = path.join(process.cwd(), 'public', 'ship', shipSlug, `${name}.${extension}`)
    if (existsSync(file)) return `/ship/${shipSlug}/${name}.${extension}`
  }
  return null
}

/** Shown when a seat, cabin or post has no photo yet. Never use it in schema or share images. */
export const NO_IMAGE = '/no-image.jpg'

/** What each photo shows, for image search and screen readers. */
const PHOTO_ALT: Record<string, string> = {
  'karnafuly-express/gladiolus-business-seat': 'Gladiolus business seats on MV Karnafuly Express, orange and cream reclining chairs in rows',
  'karnafuly-express/lavender-economy-seat': 'Lavender economy seats on MV Karnafuly Express, rows of red seats in the indoor cabin',
  'karnafuly-express/lilac-lounge': 'Lilac Lounge on MV Karnafuly Express, curved tan sofas under skylight windows',
  'karnafuly-express/marigold-economy-seat': 'Marigold economy seats on MV Karnafuly Express, rows of blue and red seats',
  'karnafuly-express/open-deck': 'Open Deck on MV Karnafuly Express, red seats along the side of the ship under open sky',
  'karnafuly-express/single-cabin': 'Single cabin on MV Karnafuly Express with one bed and large windows',
  'karnafuly-express/twin-cabin': 'Twin cabin on MV Karnafuly Express with two single beds and window blinds',
  'karnafuly-express/vip-cabin': 'VIP cabin on MV Karnafuly Express with a double bed and padded headboard',
  'karnafuly-express/vvip-cabin': 'VVIP cabin on MV Karnafuly Express with a double bed, sofa and lit ceiling',
  'baro-awlia/bunker-bed': 'Bunker bed on MV Baro Awlia, upper and lower berths with purple bedding and a ladder',
  'baro-awlia/deluxe-cabin': 'Deluxe cabin on MV Baro Awlia with two single beds and a desk',
  'baro-awlia/family-bunker-cabin': 'Family bunker cabin on MV Baro Awlia with bunk beds, chairs and a small table',
  'baro-awlia/main-deck-seat': 'Main deck seats on MV Baro Awlia, rows of red seats',
  'baro-awlia/mozarat-chair': 'Mozarat seating on MV Baro Awlia, long cream padded seats in rows',
  'baro-awlia/panorama-business-chair': 'Panorama business chairs on MV Baro Awlia, rows of cream padded seats',
  'baro-awlia/riviera-business-chair': 'Riviera business chairs on MV Baro Awlia, cream reclining seats with armrests',
  'baro-awlia/sun-deck-seat': 'Sun deck seats on MV Baro Awlia, rows of red seats under a red ceiling',
  'baro-awlia/vip-cabin': 'VIP cabin on MV Baro Awlia with a double bed and wall fan',
  'baro-awlia/vvip-cabin': 'VVIP cabin on MV Baro Awlia with a double bed, side table and air conditioner',
  'mv-teknaf/coral-deck': 'Coral Deck on MV Teknaf, rows of cream reclining seats in a wood-panelled cabin',
  'mv-teknaf/coral-lounge': 'Coral Lounge on MV Teknaf, tan seats facing tables beside the windows',
  'mv-teknaf/deluxe-cabin': 'Deluxe cabin on MV Teknaf with a bed, desk and wood-panelled walls',
  'mv-teknaf/main-deck': 'Main Deck on MV Teknaf, orange, red and blue seats around tables',
  'mv-teknaf/ocean-deck': 'Ocean Deck on MV Teknaf, rows of tan seats with black backs',
  'mv-teknaf/royal-cabin': 'Royal Cabin on MV Teknaf with a bed, desk, armchair and red carpet',
  'mv-teknaf/sky-dine': 'Sky Dine on MV Teknaf, tan seats facing dining tables',
  'mv-teknaf/vip-cabin': 'VIP cabin on MV Teknaf with a bed, desk and wood-panelled walls',
  'mv-teknaf/vip-chair': 'VIP chairs on MV Teknaf, tan leather reclining seats',
  'keari-cruise-dine/coral-lounge': 'Coral Lounge on Keari Cruise & Dine, rows of pale green padded seats with armrests beside a green floor',
  'keari-cruise-dine/pearl-lounge': 'Pearl Lounge on Keari Cruise & Dine, cream sofas around glass tables in a wood-panelled room',
  'keari-sindbad/bridge-deck': 'Bridge Deck on Keari Sindbad, rows of blue padded seats with headrests',
  'keari-sindbad/main-deck': 'Main Deck on Keari Sindbad, rows of grey-blue covered seats beside the windows',
  'keari-sindbad/open-deck': 'Open Deck on Keari Sindbad, rows of grey-blue covered seats either side of a green aisle',
}

export function seatPhotoAlt(shipSlug: string, categoryName: string, shipName: string): string {
  return PHOTO_ALT[`${shipSlug}/${seatPhotoName(categoryName)}`] ?? `${categoryName} on ${shipName}, Saint Martin ship`
}
