import { Router, Request, Response, NextFunction } from 'express';
import { ArchiveError, toArchiveError } from '../utils/errors';
import { getServerEnv, isGeminiConfigured, isSupabaseServerConfigured } from '../utils/environment';
import { geminiService } from '../services/gemini.service';
import { embeddingService } from '../services/embedding.service';
import { ocrService } from '../services/ocr.service';
import { ragService } from '../services/rag.service';
import { translationService } from '../services/translation.service';
import { ttsService } from '../services/tts.service';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  const env = getServerEnv();
  res.json({
    status: 'ok',
    archive: 'Digital Heritage Archive',
    version: '4.8.2',
    hasApiKey: isGeminiConfigured(),
    services: {
      supabase: isSupabaseServerConfigured() ? 'configured' : 'not_configured',
      gemini: geminiService.isConfigured() ? 'configured' : 'not_configured',
      embeddings: embeddingService.isConfigured() ? 'configured' : 'not_configured',
      ocr: ocrService.isConfigured() ? 'configured' : 'not_configured',
      rag: embeddingService.isConfigured() && geminiService.isConfigured()
        ? 'configured'
        : 'not_configured',
      translation: translationService.isConfigured() ? 'configured' : 'not_configured',
      tts: ttsService.isConfigured() ? 'configured' : 'not_configured',
    },
    port: env.port,
  });
});

export function archiveErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const archiveErr = toArchiveError(err);
  console.error(`[${archiveErr.code}]`, archiveErr.message, archiveErr.details ?? '');
  res.status(archiveErr.status).json(archiveErr.toJSON());
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      if (err instanceof ArchiveError) {
        return archiveErrorHandler(err, req, res, next);
      }
      return archiveErrorHandler(toArchiveError(err), req, res, next);
    });
  };
}
