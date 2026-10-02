import { redirect } from 'next/navigation'

/**
 * This route used to be a second, thinner Karnafuly Express page that
 * duplicated (and slowly drifted from) the canonical ship page. It is now a
 * redirect so any existing link keeps working while there is a single source of
 * truth for this vessel's content.
 */
export default function MVKarnafulyExpressRedirect() {
  redirect('/saint-martin-ship/karnafuly-express')
}