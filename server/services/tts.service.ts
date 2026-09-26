import { ArchiveError } from '../utils/errors';

/**
 * Text-to-speech service boundary for oral history / accessibility.
 */
export const ttsService = {
  isConfigured(): boolean {
    return false;
  },

  async synthesize(_text: string, _options?: { language?: string; voice?: string }): Promise<{
    audioBase64?: string;
    mimeType?: string;
  }> {
    throw new ArchiveError(
      'NOT_IMPLEMENTED',
      'Text-to-speech service is not configured yet.',
      { service: 'tts', status: 501 }
    );
  },
};
