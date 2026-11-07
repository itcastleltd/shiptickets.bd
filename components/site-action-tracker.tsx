'use client'

import { useEffect } from 'react'
import { takeContactTracked, trackEvent, trackPhoneClick, trackWhatsApp } from '@/lib/gtm-events'

/** Where on the page a click happened: a named section, or the part of the layout. */
function sectionOf(element: Element): string {
  if (element.closest('[data-ship-bar]')) return 'bottom_bar'
  const named = element.closest('section[id]')
  if (named) return named.id
  const area = element.closest('header, footer, nav, aside, form')
  return area ? area.tagName.toLowerCase() : 'main'
}

const labelOf = (element: Element) => (element.getAttribute('aria-label') || element.textContent?.trim() || element.querySelector('img')?.getAttribute('alt') || '').replace(/\s+/g, ' ').trim()

/**
 * Records clicks on the site's own links and buttons with one listener, so each
 * new page or button is covered without extra code. It reads only link addresses
 * and the fixed wording on buttons, never anything a visitor has typed.
 *
 * GA4 records other websites' links itself. WhatsApp and phone links without their
 * own tracking are caught here, after any handler on the link has run, so each
 * click counts once. A link that shares a page on WhatsApp is not a contact.
 */
export function SiteActionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const element = target.closest('a[href], button')
      if (!element || (element instanceof HTMLButtonElement && element.disabled)) return

      if (element instanceof HTMLAnchorElement) {
        const href = element.getAttribute('href') ?? ''
        if (!href.startsWith('/') && !href.startsWith('#')) return
        trackEvent('link_click', { link_path: href.split('?')[0], link_label: labelOf(element), link_section: sectionOf(element) })
        return
      }
      trackEvent('button_click', { button_label: labelOf(element), link_section: sectionOf(element) })
    }
    const onContactClick = (event: MouseEvent) => {
      const tracked = takeContactTracked()
      const target = event.target
      if (tracked || !(target instanceof Element)) return
      const link = target.closest<HTMLAnchorElement>('a[href*="wa.me"], a[href^="tel:"]')
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) trackPhoneClick(sectionOf(link))
      else if (/wa\.me\/\d/.test(href)) trackWhatsApp(sectionOf(link))
      else trackEvent('share', { event_label: 'whatsapp', link_section: sectionOf(link) })
      takeContactTracked()
    }
    document.addEventListener('click', onClick, true)
    // Runs on window so it comes after the link's own handler, which React runs at the document.
    window.addEventListener('click', onContactClick)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('click', onContactClick)
    }
  }, [])

  return null
}

/** Records which missing address a visitor reached, to find broken links. */
export function PageNotFoundTracker() {
  useEffect(() => {
    trackEvent('page_not_found', { link_path: window.location.pathname })
  }, [])

  return null
}
