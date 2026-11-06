'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Link2, ListTree } from 'lucide-react'

type Item = { id: string; label: string }

function useActiveHeading(items: Item[]) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  useEffect(() => {
    let frame = 0
    // The last heading above the reading line is the current section, however fast the page moved.
    const update = () => {
      frame = 0
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const heading = document.getElementById(item.id)
        if (heading && heading.getBoundingClientRect().top <= 140) current = item.id
      }
      setActive(current)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])
  return active
}

/** A thin bar at the top of the screen showing how far through the article the reader is. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const target = document.getElementById(targetId)
      if (!target || !bar.current) return
      const box = target.getBoundingClientRect()
      const distance = box.height - window.innerHeight
      const progress = distance > 0 ? Math.min(1, Math.max(0, -box.top / distance)) : 1
      bar.current.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])
  return <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0 bg-brand" />
}

/**
 * Phones and tablets: a slim bar that names the current section and opens the
 * contents. The site header hides while reading down, so the article keeps the screen.
 */
export function BlogReadingNav({ items }: { items: Item[] }) {
  const active = useActiveHeading(items)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const current = items.find((item) => item.id === active) ?? items[0]

  useEffect(() => {
    const root = document.documentElement
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const menuOpen = document.querySelector('header[data-site-header] [aria-expanded="true"]')
      if (menuOpen || y < 300 || y < lastY - 4) root.removeAttribute('data-header-hidden')
      else if (y > lastY + 4) root.setAttribute('data-header-hidden', '')
      lastY = y
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      root.removeAttribute('data-header-hidden')
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    const onPointer = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div ref={box} className="ship-section-nav sticky z-30 -mx-5 mb-5 border-y border-line-soft bg-white/95 backdrop-blur lg:hidden">
      <button type="button" aria-expanded={open} aria-controls="blog-contents" onClick={() => setOpen(!open)} className="flex min-h-12 w-full cursor-pointer items-center gap-2 px-5 text-left">
        <ListTree size={18} aria-hidden="true" className="shrink-0 text-brand-ink" />
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{open ? 'এই লেখায় যা আছে' : current?.label}</span>
        <ChevronDown size={18} aria-hidden="true" className={`shrink-0 text-brand-ink transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <nav id="blog-contents" aria-label="এই লেখায় যা আছে" className="ship-fade max-h-[55vh] overflow-y-auto border-t border-line-soft bg-white px-3 py-2 shadow-raised">
          <ol className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setOpen(false)} aria-current={item.id === active ? 'true' : undefined} className={`flex min-h-11 items-center rounded-lg px-2.5 py-1.5 text-sm font-semibold leading-snug ${item.id === active ? 'bg-[#e4f2ee] text-brand-ink' : 'text-prose'}`}>{item.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  )
}

/** Desktop contents list, which highlights the section being read. */
export function BlogSideToc({ items }: { items: Item[] }) {
  const active = useActiveHeading(items)
  return (
    <nav aria-label="এই লেখায় যা আছে" className="max-h-[52vh] overflow-y-auto rounded-2xl border border-line-soft p-3">
      <p className="px-2 pb-1 text-sm font-extrabold text-ink">এই লেখায় যা আছে</p>
      <ol className="space-y-0.5">
        {items.map((item) => {
          const selected = item.id === active
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={selected ? 'true' : undefined} className={`block rounded-lg border-l-2 px-2.5 py-1.5 text-sm font-semibold leading-snug transition-colors ${selected ? 'border-brand-ink bg-[#f1f8f6] text-brand-ink' : 'border-transparent text-prose hover:bg-[#f7fbfa] hover:text-brand-ink'}`}>{item.label}</a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked. The address bar still has the link.
    }
  }
  return (
    <button type="button" onClick={copy} className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-line px-4 text-sm font-bold text-ink transition-colors hover:border-brand-ink hover:text-brand-ink">
      {copied ? <Check size={15} aria-hidden="true" className="text-brand-ink" /> : <Link2 size={15} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করুন'}</span>
    </button>
  )
}
