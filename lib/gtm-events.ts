'use client'

declare global {
  interface Window {
    dataLayer?: any[]
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Every detail GA4 receives. Each must also be a variable on the GA4 event tag in
 * Tag Manager and a custom dimension in GA4. Never add names, mobile numbers,
 * emails, NIDs, Transaction IDs or booking references.
 */
type EventDetails = {
  event_label?: string
  event_location?: string
  ship_name?: string
  seat_category?: string
  trip_type?: string
  tickets?: number
  step?: string
  error_code?: string
  payment_type?: string
  item_id?: string
  link_path?: string
  link_label?: string
  link_section?: string
  button_label?: string
}

const NO_DETAILS: Record<keyof EventDetails, undefined> = {
  event_label: undefined, event_location: undefined, ship_name: undefined, seat_category: undefined, trip_type: undefined, tickets: undefined, step: undefined,
  error_code: undefined, payment_type: undefined, item_id: undefined, link_path: undefined, link_label: undefined, link_section: undefined, button_label: undefined,
}

/** GA4 cuts event details at 100 characters. */
const fit = (details: EventDetails = {}) => Object.fromEntries(Object.entries(details).map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 100) : value]))

/**
 * Tag Manager remembers earlier values, so each event first clears them.
 * Otherwise a WhatsApp click could carry the ship from an earlier seat choice.
 */
export function trackEvent(event: string, details?: EventDetails) {
  if (typeof window === 'undefined') return
  // Tag Manager passes each event to GA4 and Meta. Calling fbq here as well would count it twice in Meta.
  if (window.dataLayer) window.dataLayer.push({ ...NO_DETAILS, event, ...fit(details) })
}

/**
 * The Meta and GA4 tags read the amount from eventModel. It is cleared straight
 * after, because Tag Manager would otherwise attach it to later events too.
 */
export function trackBookingSubmitted(booking: { shipName: string; seatCategory: string; tripType: string; tickets: number; value: number }) {
  if (typeof window === 'undefined' || !window.dataLayer) return
  const money = { value: booking.value, currency: 'BDT' }
  window.dataLayer.push({ ...NO_DETAILS, event: 'booking_submitted', ...fit({ ship_name: booking.shipName, seat_category: booking.seatCategory, trip_type: booking.tripType, tickets: booking.tickets }), ...money, eventModel: money })
  window.dataLayer.push({ eventModel: null })
}

let contactTracked = false

/** True once if a WhatsApp or phone event has been sent since the last check. */
export function takeContactTracked() {
  const tracked = contactTracked
  contactTracked = false
  return tracked
}

export function trackWhatsApp(action: string, shipName?: string) {
  contactTracked = true
  trackEvent('whatsapp_click', {
    event_label: action,
    ...(shipName ? { ship_name: shipName } : {}),
  })
}

export function trackPhoneClick(action: string) {
  contactTracked = true
  trackEvent('phone_click', { event_label: action })
}

export function trackShipView(slug: string, name: string) {
  trackEvent('view_item', {
    item_id: slug,
    ship_name: name,
  })
}

export function trackFaqToggle(question: string) {
  trackEvent('faq_toggle', { event_label: question })
}

export function trackClickCTA(label: string, location: string) {
  trackEvent('cta_click', { event_label: label, event_location: location })
}