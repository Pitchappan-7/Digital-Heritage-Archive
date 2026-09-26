/**
 * UI / catalog types used by the existing Digital Heritage Archive frontend.
 * Preserved from the original src/types.ts — do not break App or view imports.
 */

export interface CatalogRecord {
  id: string;
  accessionId: string;
  title: string;
  year: number | string;
  dateStr: string;
  documentType: string;
  languages: string[];
  repository: string;
  description: string;
  pagesCount: number | string;
  leafTitle?: string;
  imageUrl: string;
  tags: string[];
  ocrConfidence?: string;
  isVerified?: boolean;
  hasAudio?: boolean;
  audioDuration?: string;
  audioPreviewTime?: string;
  matchScore?: number;
  highlightedQuote?: string;
  isUserGenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleTitle?: string;
}

export type ChatbotRole =
  | 'chief_historian'
  | 'constitutional_scholar'
  | 'paleographic_archivist'
  | 'research_synthesis';

export type GeminiChatModel =
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.1-flash-lite';

export interface GeneratedArchivalImage {
  id: string;
  prompt: string;
  imageUrl: string;
  imageSize: '1K' | '2K' | '4K';
  aspectRatio: string;
  modelUsed: string;
  timestamp: string;
  title: string;
  accessionId: string;
}
