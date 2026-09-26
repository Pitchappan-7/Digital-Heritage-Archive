import { ArchiveError } from '../utils/errors';

export interface OcrExtractionResult {
  text: string;
  confidence?: number;
  engine: string;
  pages?: Array<{ pageNumber: number; text: string }>;
}

/**
 * OCR / HTR service boundary.
 * Supports PaddleOCR, Tesseract, or future HTR engines via this interface.
 * Does not fabricate OCR results.
 */
export const ocrService = {
  isConfigured(): boolean {
    return false;
  },

  async extractTextFromDocument(_input: {
    filePath?: string;
    buffer?: Buffer;
    mimeType?: string;
  }): Promise<OcrExtractionResult> {
    throw new ArchiveError(
      'OCR_NOT_CONFIGURED',
      'OCR engine is not configured. Install PaddleOCR or Tesseract and wire ocr.service before use. HTR can plug into the same interface later.',
      { service: 'ocr' }
    );
  },
};
