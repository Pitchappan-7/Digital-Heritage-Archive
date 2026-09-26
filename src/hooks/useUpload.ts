import { useCallback, useState } from 'react';
import { storageService } from '../services/storage.service';
import { isSupabaseConfigured } from '../lib/supabase';
import { validateUploadFile } from '../utils/fileValidation';
import type { DocumentFile } from '../types/document';

export interface UseUploadState {
  uploading: boolean;
  error: string | null;
  lastFile: DocumentFile | null;
  configured: boolean;
  upload: (documentId: string, file: File) => Promise<DocumentFile | null>;
  reset: () => void;
}

/**
 * Upload hook for heritage-files storage. Validates locally; does not fake success.
 */
export function useUpload(): UseUploadState {
  const configured = isSupabaseConfigured();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<DocumentFile | null>(null);

  const upload = useCallback(async (documentId: string, file: File) => {
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      setError(validation.errors.join(' '));
      return null;
    }

    if (!isSupabaseConfigured()) {
      setError(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
      );
      return null;
    }

    setUploading(true);
    setError(null);
    try {
      const record = await storageService.uploadDocument(documentId, file);
      setLastFile(record);
      return record;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.';
      setError(message);
      setLastFile(null);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLastFile(null);
  }, []);

  return { uploading, error, lastFile, configured, upload, reset };
}
