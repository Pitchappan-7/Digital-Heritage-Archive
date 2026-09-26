import type { ArchiveDocument, DocumentChunk } from './document';
import type { SourceCitation } from './source';

export type SearchMode = 'keyword' | 'semantic' | 'hybrid';

export interface SearchQuery {
  query: string;
  mode?: SearchMode;
  language?: string;
  documentType?: string;
  limit?: number;
  offset?: number;
}

export interface SearchHit {
  document: ArchiveDocument;
  score?: number;
  matchedChunk?: DocumentChunk;
  highlight?: string;
}

export interface SearchResult {
  query: string;
  mode: SearchMode;
  hits: SearchHit[];
  total: number;
}

export interface RagAnswer {
  answer: string;
  sources: SourceCitation[];
  model?: string;
  notConfigured?: boolean;
  message?: string;
}
