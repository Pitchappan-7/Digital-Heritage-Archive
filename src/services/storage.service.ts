import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { HERITAGE_STORAGE_BUCKET } from '../types/archive';
import type { DocumentFile } from '../types/document';
import { validateUploadFile } from '../utils/fileValidation';

function ensureConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      '[storage] Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}

function buildStoragePath(documentId: string, fileName: string): string {
  const safeName = fileName.replace(/[^\w.\-]+/g, '_');
  return `${documentId}/${Date.now()}-${safeName}`;
}

/**
 * Supabase Storage service for the heritage-files bucket.
 * Private files use signed URLs — never assumes public access.
 */
export const storageService = {
  bucket: HERITAGE_STORAGE_BUCKET,

  async uploadDocument(documentId: string, file: File): Promise<DocumentFile> {
    ensureConfigured();
    const validation = validateUploadFile(file);
    if (!validation.valid) {
      throw new Error(`[storage] Upload validation error: ${validation.errors.join(' ')}`);
    }

    const storagePath = buildStoragePath(documentId, file.name);
    const { error: uploadError } = await supabase.storage
      .from(HERITAGE_STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw new Error(`[storage] Upload error: ${uploadError.message}`);
    }

    const { data, error } = await supabase
      .from('document_files')
      .insert({
        document_id: documentId,
        storage_bucket: HERITAGE_STORAGE_BUCKET,
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type || null,
        file_size: file.size,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(`[storage] Database error after upload: ${error.message}`);
    }

    return data as DocumentFile;
  },

  async deleteDocument(file: Pick<DocumentFile, 'id' | 'storage_bucket' | 'storage_path'>): Promise<void> {
    ensureConfigured();
    const { error: storageError } = await supabase.storage
      .from(file.storage_bucket)
      .remove([file.storage_path]);

    if (storageError) {
      throw new Error(`[storage] Delete error: ${storageError.message}`);
    }

    const { error } = await supabase.from('document_files').delete().eq('id', file.id);
    if (error) {
      throw new Error(`[storage] Database error: ${error.message}`);
    }
  },

  /**
   * Returns a public URL only if the object is publicly readable.
   * Prefer createSignedUrl for private heritage-files objects.
   */
  getDocumentUrl(storagePath: string, bucket = HERITAGE_STORAGE_BUCKET): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return data.publicUrl;
  },

  async createSignedUrl(
    storagePath: string,
    expiresInSeconds = 3600,
    bucket = HERITAGE_STORAGE_BUCKET
  ): Promise<string> {
    ensureConfigured();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(`[storage] Signed URL error: ${error?.message ?? 'No URL returned'}`);
    }
    return data.signedUrl;
  },

  async listFilesForDocument(documentId: string): Promise<DocumentFile[]> {
    ensureConfigured();
    const { data, error } = await supabase
      .from('document_files')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`[storage] Database error: ${error.message}`);
    }
    return (data ?? []) as DocumentFile[];
  },
};
