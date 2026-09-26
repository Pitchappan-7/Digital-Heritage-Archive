import { useCallback, useEffect, useState } from 'react';
import { documentsService } from '../services/documents.service';
import { isSupabaseConfigured } from '../lib/supabase';
import type { ArchiveDocument } from '../types/document';

export interface UseDocumentsState {
  documents: ArchiveDocument[];
  loading: boolean;
  error: string | null;
  configured: boolean;
  refresh: () => Promise<void>;
}

/**
 * Loads published documents from Supabase when configured.
 * Does not invent catalog data — returns empty list when unavailable.
 */
export function useDocuments(): UseDocumentsState {
  const configured = isSupabaseConfigured();
  const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setDocuments([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rows = await documentsService.listPublished();
      setDocuments(rows);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents.';
      setError(message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { documents, loading, error, configured, refresh };
}
