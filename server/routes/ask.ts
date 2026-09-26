import { Router, Request, Response } from 'express';
import { asyncHandler } from './health';
import { ragService } from '../services/rag.service';
import { requireString } from '../utils/validation';

export const askRouter = Router();

/**
 * POST /api/ask
 * RAG ask-the-archive endpoint. Returns null answer + empty sources when not configured.
 */
askRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const question = requireString(req.body?.question ?? req.body?.query, 'question');
    const result = await ragService.ask(question);

    const status = result.answer ? 200 : result.code === 'RAG_NOT_CONFIGURED' ? 501 : 200;
    res.status(status).json(result);
  })
);
