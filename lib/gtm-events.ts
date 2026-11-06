'use client'

declare global {
  interface Window {
    dataLayer?: any[]
    fbq?: (...args: unknown[]) => void
  }
}

export function trackEvent(
  event: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return
  // Tag Manager passes each event to GA4 and Meta. Calling fbq here as well would count it twice in Meta.
  if (window.dataLayer) window.dataLayer.push({ event, ...params })
}

/**
 * The Meta and GA4 tags read the amount from eventModel. It is cleared straight
 * after, because Tag Manager would otherwise attach it to later events too.
 */
export function trackBookingSubmitted(booking: { shipName: string; category: string; tripType: string; tickets: number; value: number }) {
  if (typeof window === 'undefined' || !window.dataLayer) return
  const money = { value: booking.value, currency: 'BDT' }
  window.dataLayer.push({ event: 'booking_submitted', ship_name: booking.shipName, category: booking.category, trip_type: booking.tripType, tickets: booking.tickets, ...money, eventModel: money })
  window.dataLayer.push({ eventModel: null })
}

export function trackWhatsApp(action: string, shipName?: string) {
  trackEvent('whatsapp_click', {
    event_label: action,
    ...(shipName ? { ship_name: shipName } : {}),
  })
}

export function trackPhoneClick(action: string) {
  trackEvent('phone_click', { event_label: action })
}

export function trackShipView(slug: string, name: string) {
  trackEvent('view_item', {
    item_id: slug,
    item_name: name,
    item_category: 'ship',
  })
}

export function trackFaqToggle(question: string) {
  trackEvent('faq_toggle', { event_label: question })
}

export function trackClickCTA(label: string, location: string) {
  trackEvent('cta_click', { event_label: label, event_location: location })
}