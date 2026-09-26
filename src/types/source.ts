export interface Source {
  id: string;
  institution_name: string | null;
  archive_name: string | null;
  collection_name: string | null;
  catalog_reference: string | null;
  source_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SourceInsert {
  institution_name?: string | null;
  archive_name?: string | null;
  collection_name?: string | null;
  catalog_reference?: string | null;
  source_url?: string | null;
  description?: string | null;
}

export interface SourceCitation {
  documentId: string;
  documentTitle: string;
  chunkId?: string;
  pageNumber?: number | null;
  excerpt?: string;
  catalogReference?: string | null;
  repository?: string | null;
  relevanceScore?: number;
}
