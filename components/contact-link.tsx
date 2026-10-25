'use client'

import { trackPhoneClick, trackWhatsApp } from '@/lib/gtm-events'

/**
 * A contact link that reports its own click to GTM.
 *
 * Most pages in this app are Server Components, so they cannot receive an
 * `onClick` handler from a parent. Rather than converting whole pages to the
 * client, this small Client Component owns its own tracking: the server page
 * passes only strings, and the event fires on click.
 *
 * It renders a plain anchor with the same `className` and children it is given,
 * so swapping one in changes no styling and no link target. An explicit
 * `eventLabel` keeps GTM reports readable instead of one generic "click".
 */
export function ContactLink({
  href,
  kind,
  eventLabel,
  className,
  target,
  rel,
  ariaLabel,
  children,
}: {
  href: string
  kind: 'whatsapp' | 'phone'
  eventLabel: string
  className?: string
  target?: string
  rel?: string
  /**
   * Required when the link renders an icon and nothing else. The header's
   * phone button is a bare <Phone> glyph below the `sm` breakpoint, which left
   * it with no accessible name at all — a WCAG 2.4.4 / 4.1.2 failure on every
   * page in the site, since the header is shared.
   */
  ariaLabel?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={() => (kind === 'whatsapp' ? trackWhatsApp(eventLabel) : trackPhoneClick(eventLabel))}
    >
      {children}
    </a>
  )
}