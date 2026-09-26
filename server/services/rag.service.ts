import { ArchiveError } from '../utils/errors';
import { embeddingService } from './embedding.service';
import { geminiService } from './gemini.service';

export interface RagSourceCitation {
  documentId: string;
  documentTitle: string;
  chunkId?: string;
  pageNumber?: number | null;
  excerpt?: string;
}

export interface RagResult {
  answer: string | null;
  sources: RagSourceCitation[];
  code?: string;
  message?: string;
}

/**
 * RAG architecture:
 * User Question → Question Embedding → Vector Search → Relevant Chunks
 * → Context → Gemini → Answer + Sources
 *
 * Does not fabricate answers or citations when dependencies are missing.
 */
export const ragService = {
  async ask(question: string): Promise<RagResult> {
    const trimmed = question.trim();
    if (!trimmed) {
      throw new ArchiveError('VALIDATION_ERROR', 'question is required.', { service: 'rag' });
    }

    if (!embeddingService.isConfigured()) {
      return {
        answer: null,
        sources: [],
        code: 'RAG_NOT_CONFIGURED',
        message:
          'RAG requires an embedding model and populated document_embeddings. Keyword search remains available via /api/search.',
      };
    }

    // Future: embedding → match_document_chunks → build context → Gemini
    await embeddingService.generateEmbedding(trimmed);

    if (!geminiService.isConfigured()) {
      throw new ArchiveError(
        'GEMINI_NOT_CONFIGURED',
        'GEMINI_API_KEY is not configured for RAG answers.',
        { service: 'rag' }
      );
    }

    throw new ArchiveError(
      'RAG_NOT_CONFIGURED',
      'Vector retrieval is not fully wired yet. Do not invent sources.',
      { service: 'rag' }
    );
  },
};
