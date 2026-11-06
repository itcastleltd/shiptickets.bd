'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked. The value stays visible, so it can still be typed.
    }
  }
  return (
    <button type="button" onClick={copy} aria-label={copied ? `${label} copied` : `Copy ${label}`} className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-extrabold text-ink transition-colors hover:border-brand-ink hover:text-brand-ink">
      {copied ? <Check size={14} aria-hidden="true" className="text-brand-ink" /> : <Copy size={14} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
