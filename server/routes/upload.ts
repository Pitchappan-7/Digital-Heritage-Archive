import { Router, Request, Response } from 'express';
import { asyncHandler } from './health';
import { ArchiveError } from '../utils/errors';
import { isSupabaseServerConfigured } from '../utils/environment';
import { requireString } from '../utils/validation';

export const uploadRouter = Router();

/**
 * POST /api/upload
 * Foundation endpoint for document uploads.
 * Multipart parsing + storage write will be wired with admin auth;
 * validates intent and configuration without fabricating success.
 */
uploadRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const documentId = requireString(req.body?.documentId, 'documentId');

    if (!isSupabaseServerConfigured()) {
      throw new ArchiveError(
        'SUPABASE_CONNECTION_ERROR',
        'Supabase is not configured. Cannot upload to heritage-files.',
        { service: 'upload' }
      );
    }

    // Browser uploads should use src/services/storage.service.ts with the user session.
    // This server route is reserved for authenticated admin/server-side pipelines.
    throw new ArchiveError(
      'NOT_IMPLEMENTED',
      `Server multipart upload for document ${documentId} is not fully wired yet. Use the client storageService.uploadDocument() with an authenticated archive_admin session, or complete the server upload pipeline in a later phase.`,
      { service: 'upload' }
    );
  })
);
