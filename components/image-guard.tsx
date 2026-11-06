'use client'

import { useEffect } from 'react'

/**
 * Discourages casual image saving: no right-click menu or drag on images.
 * globals.css also sets pointer-events: none on images, so the browser offers no
 * "Save image" even before this runs. Clicks pass through to any parent link.
 *
 * This is a deterrent only. A browser must download an image to show it, so
 * screenshots and developer tools still work, and search engines and social
 * previews still reach the files. Do not block image URLs for that reason.
 */
export function ImageGuard() {
  useEffect(() => {
    const block = (event: Event) => {
      if (event.target instanceof HTMLImageElement) event.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    document.addEventListener('dragstart', block)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('dragstart', block)
    }
  }, [])
  return null
}
