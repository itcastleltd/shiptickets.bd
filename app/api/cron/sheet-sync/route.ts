import { NextResponse } from 'next/server'
import { processSheetQueue } from '@/lib/sheets/sync'

/** Retries bookings whose copy to the Sheet failed. Requires CRON_SECRET. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await processSheetQueue(25))
}
