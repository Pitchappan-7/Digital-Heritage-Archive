import { useCallback, useState } from 'react';
import { searchService } from '../services/search.service';
import { isSupabaseConfigured } from '../lib/supabase';
import type { SearchMode, SearchResult } from '../types/search';

export interface UseSearchState {
  result: SearchResult | null;
  loading: boolean;
  error: string | null;
  configured: boolean;
  search: (query: string, mode?: SearchMode) => Promise<void>;
  clear: () => void;
}

/**
 * Keyword / semantic search hook. Never returns fabricated hits.
 */
export function useSearch(): UseSearchState {
  const configured = isSupabaseConfigured();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, mode: SearchMode = 'keyword') => {
    if (!query.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    if (!isSupabaseConfigured()) {
      setResult(null);
      setError(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const next = await searchService.search({ query, mode });
      setResult(next);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed.';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, configured, search, clear };
}
