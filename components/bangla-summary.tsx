import { whatsapp } from '@/components/seo-page'
import { ContactLink } from '@/components/contact-link'
import { BENGALI_PAGE_SUMMARY } from '@/content/bengali-pages'

/**
 * Bengali summary block for a page that has no Bengali route of its own.
 *
 * The ship pages already carry a `lang="bn"` summary; this gives the remaining
 * pages the same treatment so a Bangla reader arriving from search finds the
 * substance in their own language instead of a single translated word in the
 * eyebrow.
 *
 * Deliberately a summary and not a translation. The block says so, and links
 * to WhatsApp and to the English page, because a page that claims to be Bengali
 * but silently drops half the detail is worse than one that is honest about its
 * own scope. This is also why these pages carry no hreflang: they are not
 * language variants of the English page, they are a summary of it.
 */
export function BanglaSummary({ path }: { path: string }) {
  const entry = BENGALI_PAGE_SUMMARY[path]
  if (!entry) return null

  return (
    <section lang="bn" className="mb-10 border-l-4 border-brand bg-[#f7fbfa] p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="bn t-label text-brand-ink">{entry.heading}</h2>
        <span className="text-xs font-semibold text-quiet">Bangla summary</span>
      </div>
      <p className="bn t-body mt-4 t-measure text-prose">{entry.body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <ContactLink
          href={`${whatsapp}Hello ShipTickets.bd, আমি সেন্টমার্টিন জাহাজের টিকিট সম্পর্কে জানতে চাই।`}
          kind="whatsapp"
          eventLabel="bangla_summary_whatsapp"
          className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#13734f]"
          ariaLabel="WhatsApp-এ বাংলায় জিজ্ঞাসা করুন"
        >
          WhatsApp-এ লিখুন
        </ContactLink>
        <span className="t-small text-quiet">এই পাতার বাকি অংশ ইংরেজিতে।</span>
      </div>
    </section>
  )
}