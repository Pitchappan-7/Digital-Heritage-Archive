/**
 * Consistent archive API error shapes.
 */

export type ArchiveErrorCode =
  | 'SUPABASE_CONNECTION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'UPLOAD_ERROR'
  | 'DATABASE_ERROR'
  | 'OCR_ERROR'
  | 'OCR_NOT_CONFIGURED'
  | 'EMBEDDING_ERROR'
  | 'EMBEDDING_NOT_CONFIGURED'
  | 'GEMINI_ERROR'
  | 'GEMINI_NOT_CONFIGURED'
  | 'RAG_ERROR'
  | 'RAG_NOT_CONFIGURED'
  | 'VALIDATION_ERROR'
  | 'NOT_IMPLEMENTED'
  | 'INTERNAL_ERROR';

export class ArchiveError extends Error {
  readonly code: ArchiveErrorCode;
  readonly status: number;
  readonly service?: string;
  readonly details?: unknown;

  constructor(
    code: ArchiveErrorCode,
    message: string,
    options?: { status?: number; service?: string; details?: unknown; cause?: unknown }
  ) {
    super(message);
    this.name = 'ArchiveError';
    this.code = code;
    this.status = options?.status ?? statusForCode(code);
    this.service = options?.service;
    this.details = options?.details;
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      service: this.service,
      details: this.details,
    };
  }
}

function statusForCode(code: ArchiveErrorCode): number {
  switch (code) {
    case 'VALIDATION_ERROR':
      return 400;
    case 'AUTHENTICATION_ERROR':
      return 401;
    case 'GEMINI_NOT_CONFIGURED':
    case 'OCR_NOT_CONFIGURED':
    case 'EMBEDDING_NOT_CONFIGURED':
    case 'RAG_NOT_CONFIGURED':
      return 503;
    case 'NOT_IMPLEMENTED':
      return 501;
    default:
      return 500;
  }
}

export function toArchiveError(err: unknown, fallbackCode: ArchiveErrorCode = 'INTERNAL_ERROR'): ArchiveError {
  if (err instanceof ArchiveError) return err;
  const message = err instanceof Error ? err.message : 'Unexpected server error';
  return new ArchiveError(fallbackCode, message, { details: err });
}
