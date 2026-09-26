import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Source, SourceInsert } from '../types/source';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[sources] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

export const sourcesService = {
  async list(limit = 50): Promise<Source[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('sources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`[sources] Database error: ${error.message}`);
    }
    return (data ?? []) as Source[];
  },

  async create(input: SourceInsert): Promise<Source> {
    ensureConfigured();
    const { data, error } = await supabase.from('sources').insert(input).select('*').single();
    if (error) {
      throw new Error(`[sources] Database error: ${error.message}`);
    }
    return data as Source;
  },

  async getById(id: string): Promise<Source | null> {
    ensureConfigured();
    const { data, error } = await supabase.from('sources').select('*').eq('id', id).maybeSingle();
    if (error) {
      throw new Error(`[sources] Database error: ${error.message}`);
    }
    return data as Source | null;
  },
};
