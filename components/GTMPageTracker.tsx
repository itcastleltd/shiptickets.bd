'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/gtm-events'

export function GTMPageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.dataLayer) return
    trackEvent('page_view', {
      page_path: pathname,
      page_location: window.location.href,
    })
  }, [pathname])

  return null
}
