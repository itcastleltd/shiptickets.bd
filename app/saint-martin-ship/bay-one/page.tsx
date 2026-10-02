import { permanentRedirect } from 'next/navigation'

/**
 * MV Bay One is not operating this season. Karnafuly Express runs the same
 * Cox's Bazar to Saint Martin service, so it is the closest thing this URL can
 * still be useful for. The redirect is permanent because the old ship is no
 * longer in the fleet.
 */
export default function BayOneRedirect() {
  permanentRedirect('/saint-martin-ship/karnafuly-express')
}