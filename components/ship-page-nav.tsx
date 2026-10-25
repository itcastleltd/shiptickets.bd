/**
 * Sticky "On this page" bar for ship detail pages.
 *
 * A ship page is the longest page type on the site — fares, cabins, facilities,
 * schedule, boarding, booking steps and FAQ stacked in one column — so a visitor
 * who arrived from search for a fare had no way to reach the schedule or the FAQ
 * without scrolling the whole page. This gives the sections named anchors and
 * puts them in one row.
 *
 * It sticks directly beneath the site header (`top-(--header-h)`) at a lower
 * z-index, so the header keeps priority and the bar slides under it. On narrow
 * screens the row scrolls horizontally rather than wrapping, because a second
 * sticky row of chips would eat too much of a phone screen.
 */
export function ShipPageNav({ items }: { items: { id: string; label: string }[] }) {
  if (items.length < 2) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-(--header-h) z-30 -mx-5 mb-8 border-y border-line-soft bg-white/95 backdrop-blur"
    >
      <div className="flex items-center gap-1 overflow-x-auto px-5 py-2">
        <span className="t-label hidden shrink-0 pr-3 text-faint sm:block">On this page</span>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-quiet transition hover:bg-[#eaf5f3] hover:text-brand-ink"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
