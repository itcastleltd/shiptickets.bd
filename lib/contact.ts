import siteData from '@/content/site.json'

/**
 * Contact numbers for browser components. This file stays separate from
 * lib/ships.ts so the header and call bar don't send all ship data to every visitor.
 */
export const WHATSAPP_NUMBER: string = siteData.whatsapp
export const PHONE_NUMBER: string = siteData.phone
export const COURIER_NOTE = 'Courier costs ৳80 in Dhaka (next day) or ৳130 outside Dhaka (3 days).'
