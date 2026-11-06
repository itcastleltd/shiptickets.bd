import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { ContactLink } from '@/components/contact-link'
import { RatingChip, whatsapp } from '@/components/seo-page'
import { PHONE_NUMBER } from '@/lib/ships'

/** Shared parts for guide pages, designed at 360px first. */

const BASE = 'https://www.shiptickets.bd'
const OG_IMAGE = '/opengraph.jpg'
const SUFFIX = ' | ShipTickets.bd'

export const inlineLink = 'font-bold text-brand-ink underline underline-offset-2'
export const phoneHref = `tel:${PHONE_NUMBER.replace(/[^+\d]/g, '')}`
export const pageUrl = (path: string) => `${BASE}${path}`

/** Complete metadata for a page. The site name is dropped when it would push the title past 60 characters. */
export function pageMeta({ title, description, path, keywords }: { title: string; description: string; path: string; keywords?: string[] }): Metadata {
  const url = pageUrl(path)
  return {
    title: `${title}${SUFFIX}`.length > 60 ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, siteName: 'ShipTickets.bd', locale: 'en_BD', alternateLocale: ['bn_BD'], title, description, images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${title}, from ShipTickets.bd` }] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  }
}

export function GuideHero({ crumbs, h1, lede, bangla, stats, actions, updated, children }: {
  crumbs: Crumb[]
  h1: ReactNode
  lede: ReactNode
  bangla?: string
  stats?: { label: string; value: string; note?: string }[]
  actions?: ReactNode
  updated: string
  children?: ReactNode
}) {
  return (
    <div>
      <Breadcrumbs items={crumbs} />
      <h1 className="t-display mt-4 max-w-4xl text-[clamp(1.85rem,1.25rem+2.5vw,3.1rem)] text-ink">{h1}</h1>
      <p className="t-lede mt-3 max-w-3xl text-prose">{lede}</p>
      {bangla && <p lang="bn" className="mt-2 max-w-3xl font-semibold text-prose">{bangla}</p>}
      {stats && (
        <dl className="mt-5 grid grid-cols-2 gap-y-4 rounded-2xl bg-[#f1f8f6] py-4 sm:grid-cols-4 sm:divide-x sm:divide-[#d9e8e4]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col px-4">
              <dt className="text-xs font-bold text-quiet">{stat.label}</dt>
              <dd className="mt-0.5 text-[1.5rem] font-black leading-tight tabular-nums text-ink sm:text-[1.75rem]">{stat.value}</dd>
              {stat.note && <dd className="mt-0.5 text-xs font-semibold text-quiet">{stat.note}</dd>}
            </div>
          ))}
        </dl>
      )}
      {children}
      {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
      <RatingChip updated={updated} />
    </div>
  )
}

export const primaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 text-sm font-extrabold text-white transition duration-200 hover:bg-brand-ink-hover'
export const secondaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-extrabold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink'

export function KitSection({ id, title, intro, lang, children }: { id?: string; title: string; intro?: ReactNode; lang?: string; children: ReactNode }) {
  return (
    <section id={id} lang={lang} className="mb-12 scroll-mt-24 md:mb-14">
      <h2 className="t-title">{title}</h2>
      {intro && <p className="t-small mt-1.5 max-w-3xl text-prose">{intro}</p>}
      <div className="mt-4 md:mt-5">{children}</div>
    </section>
  )
}

/** Numbered steps: a compact row on phones, a card column from tablet up. */
export function StepRows({ steps, columns = 4 }: { steps: { heading: string; text: ReactNode }[]; columns?: 3 | 4 }) {
  return (
    <ol className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
      {steps.map(({ heading, text }, index) => (
        <li key={heading} className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:block sm:p-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-ink text-sm font-black text-white">{index + 1}</span>
          <div className="min-w-0 sm:mt-3">
            <h3 className="font-extrabold leading-snug text-ink">{heading}</h3>
            <p className="t-small mt-1 text-prose">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Icon cards: icon beside the text on phones. */
export function IconCards({ items, columns = 4 }: { items: { icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean | 'true' }>; heading: string; text: ReactNode }[]; columns?: 2 | 3 | 4 }) {
  const grid = columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'
  return (
    <div className={`grid gap-3 sm:gap-4 ${grid}`}>
      {items.map(({ icon: Icon, heading, text }) => (
        <div key={heading} className="flex gap-3 rounded-2xl border border-line-soft bg-white p-4 shadow-card sm:p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e4f2ee] text-brand-ink"><Icon size={20} aria-hidden="true" /></span>
          <div className="min-w-0">
            <h3 className="font-extrabold leading-snug text-ink">{heading}</h3>
            <p className="t-small mt-1 text-prose">{text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** A tinted box of short facts that read well when quoted alone. */
export function FactBox({ facts, children }: { facts: [string, ReactNode][]; children?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#cfe5de] bg-[#f1f8f6] p-5 md:p-7">
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="text-xs font-bold text-quiet">{term}</dt>
            <dd className="mt-0.5 font-extrabold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  )
}

export function LinkGrid({ links }: { links: [string, string][] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {links.map(([href, label]) => (
        <li key={href}>
          <Link href={href} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line-soft bg-white px-4 py-2.5 text-sm font-bold text-ink transition duration-200 hover:border-brand-ink hover:text-brand-ink">
            {label}
            <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-brand-ink transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function BanglaBox({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} lang="bn" className="mb-12 scroll-mt-24 rounded-3xl border border-line-soft bg-white p-5 shadow-card md:mb-14 md:p-7">
      <h2 className="t-title">{title}</h2>
      <div className="t-body mt-3 space-y-3 text-prose">{children}</div>
    </section>
  )
}

export function CtaBand({ title, text, message, eventLabel }: { title: string; text: string; message: string; eventLabel: string }) {
  return (
    <section className="mb-4 rounded-3xl bg-[#0d1b2a] p-5 text-white md:flex md:items-center md:justify-between md:gap-6 md:p-8">
      <div>
        <h2 className="t-title text-white">{title}</h2>
        <p className="t-small mt-1 text-on-dark">{text}</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 md:mt-0 md:shrink-0">
        <ContactLink href={`${whatsapp}${encodeURIComponent(message)}`} kind="whatsapp" eventLabel={eventLabel} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-5 text-sm font-extrabold transition-colors hover:bg-brand-ink-hover"><MessageCircle size={17} aria-hidden="true" /> WhatsApp</ContactLink>
        <ContactLink href={phoneHref} kind="phone" eventLabel={eventLabel} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 text-sm font-extrabold transition-colors hover:bg-white/10"><Phone size={17} aria-hidden="true" /> {PHONE_NUMBER}</ContactLink>
      </div>
    </section>
  )
}
