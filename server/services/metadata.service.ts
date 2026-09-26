import { ArchiveError } from '../utils/errors';

/**
 * Server-side archival metadata enrichment boundary.
 * Client metadata CRUD lives in src/services/metadata.service.ts.
 */
export const metadataService = {
  async enrichFromExtractedText(_documentId: string, _text: string): Promise<{
    suggestedKeys: Record<string, string>;
  }> {
    throw new ArchiveError(
      'NOT_IMPLEMENTED',
      'Server metadata enrichment is not implemented yet.',
      { service: 'metadata', status: 501 }
    );
  },
};
