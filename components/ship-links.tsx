import Link from 'next/link'
import { ships } from '@/lib/ships'

/** A sentence naming every ship, each linked to its own page. */
export function ShipLinks({ lead }: { lead: string }) {
  return (
    <p className="t-body t-measure text-prose">
      {lead}{' '}
      {ships.map((ship, index) => (
        <span key={ship.slug}>
          {index > 0 && (index === ships.length - 1 ? ' and ' : ', ')}
          <Link href={`/saint-martin-ship/${ship.slug}`} className="font-bold text-brand-ink underline underline-offset-2">{ship.name}</Link>
        </span>
      ))}
      .
    </p>
  )
}
