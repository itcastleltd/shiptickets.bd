import { ExternalLink } from 'lucide-react'

/**
 * Tripzic is our sister travel brand. These are genuinely related guides, so
 * they are linked as ordinary editorial recommendations with plain anchors.
 *
 * They are deliberately NOT added to Organization `sameAs`: `sameAs` asserts
 * that the profiles are alternate identities for the same organization, which
 * is not true of a separate brand that merely shares a parent company. Putting
 * them there would be a misleading structured-data claim.
 */
const TRIPZIC_GUIDES = [
  {
    href: 'https://www.tripzic.com/destinations/saint-martin-island',
    title: 'Saint Martin Island destination guide',
    text: 'What to expect on the island, beaches, water sports and how to reach them once you land.',
  },
  {
    href: 'https://www.tripzic.com/blog/saint-martin-travel-guide',
    title: 'Saint Martin travel guide',
    text: 'Planning advice for a Saint Martin trip, including what to carry and how long to allow.',
  },
  {
    href: 'https://www.tripzic.com/visit-bangladesh/saint-martins-island',
    title: 'Visiting Bangladesh: Saint Martin’s Island',
    text: 'Broader Bangladesh travel context for combining Saint Martin with other destinations.',
  },
]

export function RelatedGuides({
  title = 'Related travel guides',
  intro = 'These guides sit outside our ticketing pages and cover what to do once you arrive.',
}: { title?: string; intro?: string }) {
  return (
    <section className="mb-10 rounded-3xl border border-[#dedcd3] bg-white p-6 md:p-8">
      <h2 className="t-title">{title}</h2>
      <p className="t-body mt-2 text-[#4a5a5c]">{intro}</p>
      <ul className="mt-5 grid gap-3 md:grid-cols-3">
        {TRIPZIC_GUIDES.map((guide) => (
          <li key={guide.href}>
            <a
              href={guide.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex h-full flex-col rounded-2xl border border-[#e7f0ee] bg-[#f7fbfa] p-4 transition hover:border-[#1d9e75]"
            >
              <span className="flex items-start gap-2 font-extrabold text-[#0d1b2a]">
                {guide.title}
                <ExternalLink size={14} className="mt-1 shrink-0 text-[#1d9e75]" aria-hidden="true" />
              </span>
              <span className="t-small mt-2 text-[#4a5a5c]">{guide.text}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="t-small mt-4 text-[#6f8a8e]">
        Tripzic is our sister travel brand. It publishes destination and planning guides rather than ticket
        availability.
      </p>
    </section>
  )
}