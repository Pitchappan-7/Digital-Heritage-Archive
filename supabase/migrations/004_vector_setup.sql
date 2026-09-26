-- Digital Heritage Archive — pgvector setup
-- Migration: 004_vector_setup.sql
--
-- Enables pgvector and adds the embedding column WITHOUT a fixed dimension.
-- After the embedding model is selected, run a follow-up migration, e.g.:
--   ALTER TABLE public.document_embeddings
--     ALTER COLUMN embedding TYPE vector(768);
-- and create an IVFFlat / HNSW index with that dimension.

CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column if missing (dimension deferred — bare vector type).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'document_embeddings'
      AND column_name = 'embedding'
  ) THEN
    ALTER TABLE public.document_embeddings
      ADD COLUMN embedding vector;
  END IF;
END
$$;

-- Similarity search RPC — ready once embeddings exist and dimension is set.
-- Returns empty set safely when no embeddings are stored.
CREATE OR REPLACE FUNCTION public.match_document_chunks(
  query_embedding vector,
  match_count integer DEFAULT 8,
  match_threshold float DEFAULT 0.7
)
RETURNS TABLE (
  chunk_id uuid,
  document_id uuid,
  content text,
  page_number integer,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.id AS chunk_id,
    c.document_id,
    c.content,
    c.page_number,
    (1 - (e.embedding <=> query_embedding))::float AS similarity
  FROM public.document_embeddings e
  INNER JOIN public.document_chunks c ON c.id = e.document_chunk_id
  INNER JOIN public.documents d ON d.id = c.document_id
  WHERE e.embedding IS NOT NULL
    AND d.status = 'published'
    AND d.verification_status = 'verified'
    AND (1 - (e.embedding <=> query_embedding)) >= match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT greatest(match_count, 1);
$$;

COMMENT ON COLUMN public.document_embeddings.embedding IS
  'pgvector embedding; dimension deferred until embedding model is selected.';

COMMENT ON FUNCTION public.match_document_chunks IS
  'Semantic chunk retrieval for RAG. Requires embeddings to be populated.';
