'use client'

import { useEffect } from 'react'
import { trackShipView } from '@/lib/gtm-events'

export function ShipViewTracker({ slug, name }: { slug: string; name: string }) {
  useEffect(() => {
    trackShipView(slug, name)
  }, [slug, name])
  return null
}