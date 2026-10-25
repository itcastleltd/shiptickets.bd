'use client'

declare global {
  interface Window {
    dataLayer?: any[]
  }
}

export function trackEvent(
  event: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || !window.dataLayer) return
  window.dataLayer.push({ event, ...params })
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
  trackEvent('click', { event_label: label, event_location: location })
}