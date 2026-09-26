import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { ArchiveDocument } from '../types/document';
import type { SearchQuery, SearchResult } from '../types/search';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[search] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

/**
 * Search service — keyword search now; semantic/hybrid are architecture stubs.
 * Never returns fabricated hits.
 */
export const searchService = {
  async search(input: SearchQuery): Promise<SearchResult> {
    const mode = input.mode ?? 'keyword';
    const query = input.query.trim();
    const limit = input.limit ?? 20;

    if (!query) {
      return { query, mode, hits: [], total: 0 };
    }

    if (mode === 'semantic' || mode === 'hybrid') {
      throw new Error(
        `[search] ${mode} search is not configured yet. Embeddings / pgvector must be set up first.`
      );
    }

    return this.keywordSearch(query, limit, input.documentType, input.language);
  },

  async keywordSearch(
    query: string,
    limit = 20,
    documentType?: string,
    language?: string
  ): Promise<SearchResult> {
    ensureConfigured();

    let builder = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .eq('verification_status', 'verified')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (documentType) {
      builder = builder.eq('document_type', documentType);
    }
    if (language) {
      builder = builder.eq('language', language);
    }

    const { data, error, count } = await builder;

    if (error) {
      throw new Error(`[search] Database error: ${error.message}`);
    }

    const docs = (data ?? []) as ArchiveDocument[];
    return {
      query,
      mode: 'keyword',
      hits: docs.map((document) => ({ document })),
      total: count ?? docs.length,
    };
  },
};
