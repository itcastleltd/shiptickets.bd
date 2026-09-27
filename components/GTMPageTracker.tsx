'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GTMPageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!(window as any).dataLayer) {
      console.warn('[GTM] dataLayer not found - GTM script may not have loaded')
      return
    }
    ;(window as any).dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
    })
  }, [pathname])

  return null
}
