/**
 * Shared archive domain unions and pipeline status types.
 */

export type ArchiveRole = 'anon' | 'authenticated' | 'archive_admin';

export type PipelineStage =
  | 'upload'
  | 'storage'
  | 'ocr'
  | 'htr'
  | 'extracted_text'
  | 'metadata'
  | 'chunks'
  | 'embeddings'
  | 'vector_search'
  | 'rag'
  | 'gemini'
  | 'answer'
  | 'citations';

export type ServiceAvailability =
  | 'ready'
  | 'not_configured'
  | 'not_implemented';

export interface ServiceStatus {
  service: string;
  status: ServiceAvailability;
  message?: string;
}

export interface ArchiveErrorShape {
  code: string;
  message: string;
  service?: string;
  cause?: unknown;
}

export const HERITAGE_STORAGE_BUCKET = 'heritage-files' as const;

export const SUPPORTED_UPLOAD_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'video/mp4',
  'video/quicktime',
] as const;

export const SUPPORTED_UPLOAD_EXTENSIONS = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.mp3',
  '.wav',
  '.mp4',
  '.mov',
] as const;

/** Default max upload size: 100 MB */
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
