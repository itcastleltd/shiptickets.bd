import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export type Crumb = { name: string; href?: string }

/**
 * Visible breadcrumb trail.
 *
 * This is the on-page half of the breadcrumb trail. The matching
 * BreadcrumbList structured data is emitted separately by `breadcrumbSchema`
 * in components/seo-page.tsx, and both are fed from the same array so the
 * markup and the visible trail can never drift apart.
 */
export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-quiet">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="rounded transition hover:text-brand-ink hover:underline">
                  {index === 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Home size={14} aria-hidden="true" />
                      <span>{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )}
                </Link>
              ) : (
                <span className="font-bold text-ink" aria-current={isLast ? 'page' : undefined}>
                  {item.name}
                </span>
              )}
              {!isLast && <ChevronRight size={14} className="shrink-0 text-[#b6c4c3]" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
