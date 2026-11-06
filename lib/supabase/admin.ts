import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server only. This client bypasses row-level security, so it must never be
 * imported into client code. Returns null when the settings are missing, so
 * callers can fall back to WhatsApp booking.
 */
export function createAdminClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') throw new Error('The admin client is server only')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
