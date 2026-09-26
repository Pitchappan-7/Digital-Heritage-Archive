import { ArchiveError } from '../utils/errors';

/**
 * Translation service boundary (future Gemini / specialized MT).
 */
export const translationService = {
  isConfigured(): boolean {
    return false;
  },

  async translate(_text: string, _targetLanguage: string, _sourceLanguage?: string): Promise<string> {
    throw new ArchiveError(
      'NOT_IMPLEMENTED',
      'Translation service is not configured yet.',
      { service: 'translation', status: 501 }
    );
  },
};
