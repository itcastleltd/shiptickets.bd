import { permanentRedirect } from 'next/navigation'

/**
 * MV Bay Cruiser 1 is not operating this season, so this route exists only to
 * send visitors who arrive on the old URL to the ship directory. The redirect is
 * permanent because the ship is no longer part of the fleet: a temporary redirect
 * would leave the old URL in the index indefinitely and invite re-checking.
 */
export default function BayCruiserOneRedirect() {
  permanentRedirect('/saint-martin-ship')
}