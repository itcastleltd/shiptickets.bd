import { NextResponse } from 'next/server'
import { removeExpiredPersonalData } from '@/lib/bookings/retention'

/** Removes personal details about a year after travel. Requires CRON_SECRET. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await removeExpiredPersonalData())
}
