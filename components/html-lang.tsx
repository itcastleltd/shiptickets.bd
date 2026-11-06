'use client'

import { useEffect } from 'react'

/**
 * Marks the document as Bangla while a Bangla page is open. The root layout is
 * shared with the English pages, so it sets lang="en" on <html>. The page's own
 * <main lang="bn"> already covers its content; this keeps the document in step.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.lang
    root.lang = lang
    return () => {
      root.lang = previous
    }
  }, [lang])
  return null
}
