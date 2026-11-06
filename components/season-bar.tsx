import { BOOKING_ENABLED } from '@/lib/bookings/validate'
import { season, site } from '@/lib/ships'

const banglaDigits = (value: number) => String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])

/**
 * The single top banner, shown above the header on every page. It states the
 * advance while online booking is on, and the season dates otherwise.
 *
 * The percentage comes from content/site.json. Pages are pre-built, so it can't
 * read the database: when the advance changes in system_settings, change it there too.
 */
export function SeasonBar() {
  if (!BOOKING_ENABLED) {
    return (
      <div className="bg-[#0d1b2a] px-5 py-2 text-center text-xs font-semibold text-white/80">
        Saint Martin season {season.label}:{' '}
        <span className="text-[#ef9f27]">{season.startDate} to {season.endDate}</span>
      </div>
    )
  }

  const percent = site.advancePercentage
  return (
    <div className="bg-[#0d1b2a] px-3 py-2 text-center text-xs font-semibold leading-relaxed text-white/85">
      <span className="block md:inline">Pay <span className="font-extrabold text-[#ef9f27]">{percent}%</span> now to book, the rest when you get your ticket</span>
      <span className="mx-2 hidden text-white/40 md:inline" aria-hidden="true">·</span>
      <span lang="bn" className="block md:inline">মাত্র <span className="font-extrabold text-[#ef9f27]">{banglaDigits(percent)}%</span> দিয়ে বুকিং, বাকি টাকা টিকেট পাওয়ার সময়</span>
    </div>
  )
}
