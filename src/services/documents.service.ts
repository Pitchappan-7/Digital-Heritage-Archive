import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { ArchiveDocument, DocumentInsert, DocumentUpdate } from '../types/document';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[documents] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

/**
 * Documents service — PostgreSQL CRUD via Supabase.
 * Public reads are limited by RLS to published + verified rows.
 */
export const documentsService = {
  async listPublished(limit = 50): Promise<ArchiveDocument[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('status', 'published')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`[documents] Database error: ${error.message}`);
    }
    return (data ?? []) as ArchiveDocument[];
  },

  async getById(id: string): Promise<ArchiveDocument | null> {
    ensureConfigured();
    const { data, error } = await supabase.from('documents').select('*').eq('id', id).maybeSingle();

    if (error) {
      throw new Error(`[documents] Database error: ${error.message}`);
    }
    return data as ArchiveDocument | null;
  },

  async create(input: DocumentInsert): Promise<ArchiveDocument> {
    ensureConfigured();
    const { data, error } = await supabase.from('documents').insert(input).select('*').single();

    if (error) {
      throw new Error(`[documents] Database error: ${error.message}`);
    }
    return data as ArchiveDocument;
  },

  async update(id: string, input: DocumentUpdate): Promise<ArchiveDocument> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('documents')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`[documents] Database error: ${error.message}`);
    }
    return data as ArchiveDocument;
  },

  async remove(id: string): Promise<void> {
    ensureConfigured();
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      throw new Error(`[documents] Database error: ${error.message}`);
    }
  },
};
