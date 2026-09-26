import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from './health';
import { getServerEnv, isSupabaseServerConfigured } from '../utils/environment';
import { ArchiveError } from '../utils/errors';
import { requireString, optionalString, optionalNumber } from '../utils/validation';

export const searchRouter = Router();

searchRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const query = requireString(req.body?.query, 'query');
    const mode = optionalString(req.body?.mode) ?? 'keyword';
    const limit = optionalNumber(req.body?.limit) ?? 20;

    if (mode === 'semantic' || mode === 'hybrid') {
      throw new ArchiveError(
        'NOT_IMPLEMENTED',
        `${mode} search requires embeddings. Use keyword search until the embedding model is configured.`,
        { service: 'search' }
      );
    }

    if (!isSupabaseServerConfigured()) {
      throw new ArchiveError(
        'SUPABASE_CONNECTION_ERROR',
        'Supabase is not configured on the server.',
        { service: 'search' }
      );
    }

    const env = getServerEnv();
    const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey);

    const { data, error, count } = await supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .eq('verification_status', 'verified')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      throw new ArchiveError('DATABASE_ERROR', error.message, { service: 'search' });
    }

    res.json({
      query,
      mode: 'keyword',
      hits: (data ?? []).map((document) => ({ document })),
      total: count ?? data?.length ?? 0,
    });
  })
);
