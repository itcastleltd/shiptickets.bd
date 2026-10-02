'use client'

import { useEffect } from 'react'
import { trackShipView } from '@/lib/gtm-events'
import type { Ship } from '@/lib/ships'

export function ShipViewTracker({ ship }: { ship: Ship }) {
  useEffect(() => {
    trackShipView(ship.slug, ship.name)
  }, [ship.slug, ship.name])
  return null
}