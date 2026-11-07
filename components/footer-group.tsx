'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

const DESKTOP = '(min-width: 1024px)'

/**
 * A footer link group that opens by tap on phones and stays open on desktop.
 * The server sends it open, so crawlers and visitors without JavaScript get every
 * link. It closes on phones after loading, far below the first screen.
 */
export function FooterGroup({ heading, children }: { heading: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP)
    const sync = () => {
      if (ref.current) ref.current.open = desktop.matches
    }
    sync()
    desktop.addEventListener('change', sync)
    return () => desktop.removeEventListener('change', sync)
  }, [])

  return (
    <details
      ref={ref}
      open
      onToggle={(event) => {
        // Desktop has no reason to close a group.
        if (window.matchMedia(DESKTOP).matches) event.currentTarget.open = true
      }}
      className="group border-b border-line-soft lg:border-b-0"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-ink marker:content-none focus-visible:outline-2 focus-visible:outline-brand-ink lg:min-h-0 lg:cursor-default [&::-webkit-details-marker]:hidden">
        <h2 className="t-label text-ink">{heading}</h2>
        <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-open:rotate-180 lg:hidden" />
      </summary>
      <div className="pb-3 lg:mt-3 lg:pb-0">{children}</div>
    </details>
  )
}
