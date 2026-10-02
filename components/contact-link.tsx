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
  children,
}: {
  href: string
  kind: 'whatsapp' | 'phone'
  eventLabel: string
  className?: string
  target?: string
  rel?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => (kind === 'whatsapp' ? trackWhatsApp(eventLabel) : trackPhoneClick(eventLabel))}
    >
      {children}
    </a>
  )
}