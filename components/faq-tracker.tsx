'use client'

import { useEffect } from 'react'
import { trackFaqToggle } from '@/lib/gtm-events'

/**
 * Global FAQ toggle tracker.
 *
 * The ship-page FAQ is rendered as native <details>/<summary> inside the
 * FaqAccordion client component. React does not reliably attach synthetic
 * onClick handlers to <summary> during hydration, so this component uses a
 * single document-level click listener in capture phase to catch every
 * summary toggle on the page without depending on React's event system.
 */
export function FaqTracker() {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement
      const summary = target.closest('summary')
      if (!summary) return
      const details = summary.closest('details')
      if (!details) return

      const question = summary.textContent?.trim() || ''
      if (question) trackFaqToggle(question)
    }

    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [])

  return null
}