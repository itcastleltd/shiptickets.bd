import Link from 'next/link'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER, type Ship } from '@/lib/ships'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=`

export function SeoPage({ eyebrow, title, intro, updated = '21 September 2026', children }: { eyebrow: string; title: string; intro: string; updated?: string; children: React.ReactNode }) {
  const pageUrl = `https://www.shiptickets.bd${typeof window === 'undefined' ? '' : window.location.pathname}`
  const pageSchema = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: intro, url: pageUrl, isPartOf: { '@id': 'https://www.shiptickets.bd/#website' }, publisher: { '@id': 'https://www.shiptickets.bd/#organization' }, about: { '@type': 'Place', name: "Saint Martin's Island, Bangladesh" } }
  return <main className="min-h-screen bg-white text-[#0d1b2a]">
    <Schema data={pageSchema} />
    <div className="bg-[#0d1b2a] px-5 py-2 text-center text-xs font-semibold text-white/80">Saint Martin Island, Bangladesh · <span className="text-[#ef9f27]">Seasonal information is verified before booking</span></div>
    <Header />
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:pb-16 md:pt-20"><p className="mb-4 text-xs font-extrabold uppercase tracking-[.2em] text-[#1d9e75]">{eyebrow}</p><h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-[-.04em] md:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f5e5a]">{intro}</p><p className="mt-5 text-xs font-bold text-[#888780]">Information last reviewed: {updated}</p></section>
    <div className="mx-auto max-w-6xl px-5 pb-20"><div className="grid gap-10 lg:grid-cols-[1fr_280px]"><article className="min-w-0">{children}</article><aside className="h-fit rounded-3xl border border-[#dedcd3] bg-white p-6 lg:sticky lg:top-6"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1d9e75]">Need help?</p><h2 className="mt-3 text-xl font-extrabold">Get the latest answer before you travel.</h2><p className="mt-3 text-sm leading-6 text-[#5f5e5a]">Share your date and passenger count. Our team can confirm current ship status and ticket guidance.</p><a href={`${whatsapp}Hello ShipTickets.bd, please help me with Saint Martin ship tickets.`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-4 py-3 text-sm font-extrabold text-white"><MessageCircle size={16}/> Ask on WhatsApp</a><Link href="/" className="mt-4 flex items-center gap-2 text-sm font-extrabold text-[#0d1b2a]">Back to homepage <ArrowRight size={15}/></Link></aside></div></div>
    <Footer />
  </main>
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8"><h2 className="text-2xl font-extrabold tracking-tight">{title}</h2><div className="mt-4 space-y-4 text-[15px] leading-7 text-[#5f5e5a]">{children}</div></section> }
export function Bullet({ children }: { children: React.ReactNode }) { return <li className="flex gap-3"><Check className="mt-1 shrink-0 text-[#1d9e75]" size={17}/><span>{children}</span></li> }
export function Pill({ children }: { children: React.ReactNode }) { return <span className="inline-flex rounded-full bg-[#e1f5ee] px-3 py-1 text-xs font-extrabold text-[#0f6e56]">{children}</span> }
export function Schema({ data }: { data: object }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} /> }

export const faqSchema = (items: [string, string][]) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) })

export const siteSchema = { '@context': 'https://schema.org', '@type': 'Organization', '@id': 'https://www.shiptickets.bd/#organization', name: 'ShipTickets.bd', url: 'https://www.shiptickets.bd', areaServed: 'Bangladesh', description: 'Saint Martin ship ticket information, comparison and booking support.' }

export const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': 'https://www.shiptickets.bd/#website', url: 'https://www.shiptickets.bd/', name: 'ShipTickets.bd', publisher: { '@id': 'https://www.shiptickets.bd/#organization' } }

export const breadcrumbSchema = (items: { name: string; url?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    ...(item.url ? { item: `https://www.shiptickets.bd${item.url}` } : {}),
  })),
})

export const productSchema = (ship: Ship) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${ship.name} Saint Martin ship ticket`,
  description: ship.detail,
  image: ship.image ? `https://www.shiptickets.bd${ship.image}` : undefined,
  brand: { '@type': 'Brand', name: ship.name },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'BDT',
    offerCount: ship.ticketClasses.length,
    lowPrice: ship.ticketClasses.reduce((min, cls) => {
      const oneWayNum = Number(cls.oneWayFare.replace(/[^0-9]/g, ''))
      return oneWayNum < min ? oneWayNum : min
    }, Infinity).toString(),
    highPrice: ship.ticketClasses.reduce((max, cls) => {
      const oneWayNum = Number(cls.oneWayFare.replace(/[^0-9]/g, ''))
      return oneWayNum > max ? oneWayNum : max
    }, 0).toString(),
    availability: ship.status === 'verified' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
    url: `https://www.shiptickets.bd/saint-martin-ship/${ship.slug}`,
    seller: { '@id': 'https://www.shiptickets.bd/#organization' },
  },
})

export { whatsapp }

export default function Empty() { return null }

export function Status({ children }: { children: React.ReactNode }) { return <Pill>{children}</Pill> }

export function LinkCard({ href, title, text }: { href: string; title: string; text: string }) { return <Link href={href} className="group rounded-2xl border border-[#dedcd3] bg-white p-5 transition hover:-translate-y-1 hover:border-[#1d9e75]"><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5f5e5a]">{text}</p><ArrowRight className="mt-4 text-[#1d9e75] transition group-hover:translate-x-1" size={17}/></Link> }
