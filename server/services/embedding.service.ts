import { ArchiveError } from '../utils/errors';

/**
 * Embedding service boundary.
 * Does not generate fake vectors — configure a model before use.
 */
export const embeddingService = {
  isConfigured(): boolean {
    return false;
  },

  async generateEmbedding(_text: string): Promise<number[]> {
    throw new ArchiveError(
      'EMBEDDING_NOT_CONFIGURED',
      'Embedding model is not configured. Select a model before generating embeddings.',
      { service: 'embedding' }
    );
  },
};
