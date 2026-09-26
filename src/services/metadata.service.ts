import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { DocumentMetadataRow } from '../types/document';
import { validateMetadataEntry } from '../utils/metadataValidation';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[metadata] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

/**
 * Document metadata key/value service.
 */
export const metadataService = {
  async listForDocument(documentId: string): Promise<DocumentMetadataRow[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('document_metadata')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`[metadata] Database error: ${error.message}`);
    }
    return (data ?? []) as DocumentMetadataRow[];
  },

  async upsert(
    documentId: string,
    metadataKey: string,
    metadataValue: string | null
  ): Promise<DocumentMetadataRow> {
    ensureConfigured();
    const validation = validateMetadataEntry(metadataKey, metadataValue);
    if (!validation.valid) {
      throw new Error(`[metadata] Validation error: ${validation.errors.join(' ')}`);
    }

    const { data, error } = await supabase
      .from('document_metadata')
      .insert({
        document_id: documentId,
        metadata_key: metadataKey.trim(),
        metadata_value: metadataValue,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`[metadata] Database error: ${error.message}`);
    }
    return data as DocumentMetadataRow;
  },

  async remove(id: string): Promise<void> {
    ensureConfigured();
    const { error } = await supabase.from('document_metadata').delete().eq('id', id);
    if (error) {
      throw new Error(`[metadata] Database error: ${error.message}`);
    }
  },
};
