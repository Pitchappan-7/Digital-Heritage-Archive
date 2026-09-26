/**
 * Client-side embeddings service boundary.
 * Actual embedding generation must run server-side (or via Edge Function)
 * so secret model credentials are never exposed in the browser.
 */
export const embeddingsService = {
  /**
   * @throws Always — browser must not generate embeddings with secret keys.
   */
  async generateEmbedding(_text: string): Promise<number[]> {
    throw new Error(
      '[embeddings] Not implemented in the browser. Call the server /api/ask or Edge Function generate-embedding once an embedding model is configured.'
    );
  },

  isConfigured(): boolean {
    return false;
  },
};
