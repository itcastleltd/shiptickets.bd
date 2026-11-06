'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Reports moves between pages to the Meta Pixel. The first page view comes from
 * the pixel snippet in the layout.
 *
 * GA4 is not sent page_view here: the Google tag already records page views,
 * including moves between pages, so a second one would double the count.
 */
export function GTMPageTracker() {
  const pathname = usePathname()
  const lastPath = useRef(pathname)

  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView')
  }, [pathname])

  return null
}
