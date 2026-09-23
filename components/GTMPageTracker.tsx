'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GTMPageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).dataLayer) return
    ;(window as any).dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
    })
  }, [pathname])

  return null
}
