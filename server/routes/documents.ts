import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from './health';
import { getServerEnv, isSupabaseServerConfigured } from '../utils/environment';
import { ArchiveError } from '../utils/errors';
import { requireString, optionalString } from '../utils/validation';

export const documentsRouter = Router();

function getSupabase() {
  if (!isSupabaseServerConfigured()) {
    throw new ArchiveError(
      'SUPABASE_CONNECTION_ERROR',
      'Supabase is not configured on the server.',
      { service: 'documents' }
    );
  }
  const env = getServerEnv();
  return createClient(env.supabaseUrl, env.supabasePublishableKey);
}

documentsRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('status', 'published')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new ArchiveError('DATABASE_ERROR', error.message, { service: 'documents' });
    }

    res.json({ documents: data ?? [] });
  })
);

documentsRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = requireString(req.params.id, 'id');
    const supabase = getSupabase();
    const { data, error } = await supabase.from('documents').select('*').eq('id', id).maybeSingle();

    if (error) {
      throw new ArchiveError('DATABASE_ERROR', error.message, { service: 'documents' });
    }

    if (!data) {
      res.status(404).json({ error: 'Document not found', code: 'NOT_FOUND' });
      return;
    }

    res.json({ document: data });
  })
);

documentsRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const title = requireString(req.body?.title, 'title');
    const supabase = getSupabase();

    const payload = {
      title,
      description: optionalString(req.body?.description) ?? null,
      document_type: optionalString(req.body?.document_type) ?? null,
      language: optionalString(req.body?.language) ?? null,
      status: optionalString(req.body?.status) ?? 'draft',
      verification_status: optionalString(req.body?.verification_status) ?? 'unverified',
    };

    const { data, error } = await supabase.from('documents').insert(payload).select('*').single();

    if (error) {
      throw new ArchiveError('DATABASE_ERROR', error.message, { service: 'documents' });
    }

    res.status(201).json({ document: data });
  })
);
