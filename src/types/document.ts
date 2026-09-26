export type DocumentStatus = 'draft' | 'published' | 'archived' | 'under_review';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface ArchiveDocument {
  id: string;
  title: string;
  description: string | null;
  document_type: string | null;
  language: string | null;
  date_created: string | null;
  date_digitized: string | null;
  location_id: string | null;
  source_id: string | null;
  status: DocumentStatus | string | null;
  verification_status: VerificationStatus | string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentInsert {
  title: string;
  description?: string | null;
  document_type?: string | null;
  language?: string | null;
  date_created?: string | null;
  date_digitized?: string | null;
  location_id?: string | null;
  source_id?: string | null;
  status?: DocumentStatus | string | null;
  verification_status?: VerificationStatus | string | null;
}

export interface DocumentUpdate {
  title?: string;
  description?: string | null;
  document_type?: string | null;
  language?: string | null;
  date_created?: string | null;
  date_digitized?: string | null;
  location_id?: string | null;
  source_id?: string | null;
  status?: DocumentStatus | string | null;
  verification_status?: VerificationStatus | string | null;
}

export interface DocumentFile {
  id: string;
  document_id: string;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
}

export interface DocumentMetadataRow {
  id: string;
  document_id: string;
  metadata_key: string;
  metadata_value: string | null;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  page_number: number | null;
  chunk_index: number;
  content: string;
  language: string | null;
  created_at: string;
}
