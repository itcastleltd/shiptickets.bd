import { permanentRedirect } from 'next/navigation'

/**
 * This route used to be a second, thinner Karnafuly Express page that
 * duplicated (and slowly drifted from) the canonical ship page. It is now a
 * redirect so any existing link keeps working while there is a single source of
 * truth for this vessel's content.
 *
 * The move is permanent rather than temporary: the old URL will never hold its
 * own content again. A 308 lets a search engine drop the old URL from its index
 * instead of re-checking it on every crawl.
 */
export default function MVKarnafulyExpressRedirect() {
  permanentRedirect('/saint-martin-ship/karnafuly-express')
}