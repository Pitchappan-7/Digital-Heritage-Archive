import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

/**
 * Returns true when both Vite env vars required for Supabase are present.
 * Does not perform a network check — configuration only.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

if (!isSupabaseConfigured()) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY are not set. ' +
      'Copy .env.example to .env.local and fill in your Supabase project values.'
  );
}

/**
 * Typed Supabase browser client for Digital Heritage Archive.
 * Uses the publishable (anon) key only — never the service role key in the client.
 *
 * When env vars are missing, a non-functional placeholder client is created so
 * the module can load without throwing. Always call isSupabaseConfigured()
 * before issuing real requests.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'public-anon-key-not-configured'
);

export type { Database };
export type TypedSupabaseClient = SupabaseClient<Database>;
