import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { DocumentChunk } from '../types/document';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[chunks] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

/**
 * Document text chunks — populated after OCR/HTR, before embeddings.
 */
export const chunksService = {
  async listForDocument(documentId: string): Promise<DocumentChunk[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('document_chunks')
      .select('*')
      .eq('document_id', documentId)
      .order('chunk_index', { ascending: true });

    if (error) {
      throw new Error(`[chunks] Database error: ${error.message}`);
    }
    return (data ?? []) as DocumentChunk[];
  },

  async createMany(
    documentId: string,
    chunks: Array<{ content: string; page_number?: number | null; language?: string | null }>
  ): Promise<DocumentChunk[]> {
    ensureConfigured();
    if (!chunks.length) {
      return [];
    }

    const rows = chunks.map((chunk, index) => ({
      document_id: documentId,
      chunk_index: index,
      content: chunk.content,
      page_number: chunk.page_number ?? null,
      language: chunk.language ?? null,
    }));

    const { data, error } = await supabase.from('document_chunks').insert(rows).select('*');
    if (error) {
      throw new Error(`[chunks] Database error: ${error.message}`);
    }
    return (data ?? []) as DocumentChunk[];
  },
};
