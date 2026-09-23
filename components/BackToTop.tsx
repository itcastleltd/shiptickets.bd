'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400)
    toggle()
    window.addEventListener('scroll', toggle, { passive: true })
    return () => window.removeEventListener('scroll', toggle)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-5 z-40 flex size-11 items-center justify-center rounded-full border border-[#cfe1df] bg-white text-[#0d1b2a shadow-[0_8px_25px_rgba(18,60,69,.1)] transition hover:bg-[#1d9e75] hover:text-white sm:bottom-8"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  )
}
