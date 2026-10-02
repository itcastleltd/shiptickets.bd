import { season } from '@/lib/ships'

/**
 * The single top banner, shown above the header on every page.
 *
 * This replaces two separate bars that had drifted apart: the homepage said
 * "Information-first ticket support for Saint Martin Island, Bangladesh" while
 * SeoPage pages said only "Saint Martin Island, Bangladesh", and neither
 * carried the season date. The season message used to sit further down the
 * homepage in a SeasonNotice block that repeated itself twice.
 *
 * Reading season.label and season.startDate from lib/ships means this can never
 * disagree with content/site.json.
 */
export function SeasonBar() {
  return (
    <div className="bg-[#0d1b2a] px-5 py-2 text-center text-xs font-semibold text-white/80">
      Saint Martin season {season.label} opens on{' '}
      <span className="text-[#ef9f27]">{season.startDate}</span>
      <span className="mx-2 text-white/40" aria-hidden="true">
        ·
      </span>
      <span className="text-[#ef9f27]">shiptickets.bd is an authorized ship ticket reseller</span>
    </div>
  )
}