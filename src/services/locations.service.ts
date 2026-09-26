import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Location, LocationInsert } from '../types/location';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[locations] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

export const locationsService = {
  async list(limit = 50): Promise<Location[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`[locations] Database error: ${error.message}`);
    }
    return (data ?? []) as Location[];
  },

  async create(input: LocationInsert): Promise<Location> {
    ensureConfigured();
    const { data, error } = await supabase.from('locations').insert(input).select('*').single();
    if (error) {
      throw new Error(`[locations] Database error: ${error.message}`);
    }
    return data as Location;
  },

  async getById(id: string): Promise<Location | null> {
    ensureConfigured();
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).maybeSingle();
    if (error) {
      throw new Error(`[locations] Database error: ${error.message}`);
    }
    return data as Location | null;
  },
};
