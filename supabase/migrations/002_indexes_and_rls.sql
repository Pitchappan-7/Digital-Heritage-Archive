-- Digital Heritage Archive — indexes and row level security
-- Migration: 002_indexes_and_rls.sql

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents (status);
CREATE INDEX IF NOT EXISTS idx_documents_verification ON public.documents (verification_status);
CREATE INDEX IF NOT EXISTS idx_documents_location_id ON public.documents (location_id);
CREATE INDEX IF NOT EXISTS idx_documents_source_id ON public.documents (source_id);
CREATE INDEX IF NOT EXISTS idx_documents_title_trgm ON public.documents USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents (document_type);
CREATE INDEX IF NOT EXISTS idx_document_metadata_document_id ON public.document_metadata (document_id);
CREATE INDEX IF NOT EXISTS idx_document_files_document_id ON public.document_files (document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON public.document_chunks (document_id);
CREATE INDEX IF NOT EXISTS idx_document_embeddings_chunk_id ON public.document_embeddings (document_chunk_id);
CREATE INDEX IF NOT EXISTS idx_events_location_id ON public.events (location_id);
CREATE INDEX IF NOT EXISTS idx_people_name ON public.people (name);

-- ---------------------------------------------------------------------------
-- Helper: archive admin check via JWT app_metadata.role
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_archive_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'archive_admin',
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- documents policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS documents_public_read ON public.documents;
CREATE POLICY documents_public_read
  ON public.documents
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND verification_status = 'verified');

DROP POLICY IF EXISTS documents_admin_read_all ON public.documents;
CREATE POLICY documents_admin_read_all
  ON public.documents
  FOR SELECT
  TO authenticated
  USING (public.is_archive_admin());

DROP POLICY IF EXISTS documents_admin_insert ON public.documents;
CREATE POLICY documents_admin_insert
  ON public.documents
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_archive_admin());

DROP POLICY IF EXISTS documents_admin_update ON public.documents;
CREATE POLICY documents_admin_update
  ON public.documents
  FOR UPDATE
  TO authenticated
  USING (public.is_archive_admin())
  WITH CHECK (public.is_archive_admin());

DROP POLICY IF EXISTS documents_admin_delete ON public.documents;
CREATE POLICY documents_admin_delete
  ON public.documents
  FOR DELETE
  TO authenticated
  USING (public.is_archive_admin());

-- ---------------------------------------------------------------------------
-- Shared pattern: public read of entities linked to published docs;
-- admin full manage. Reference tables (people, events, locations, sources)
-- are readable by everyone for published archive context; writes admin-only.
-- ---------------------------------------------------------------------------

-- people
DROP POLICY IF EXISTS people_public_read ON public.people;
CREATE POLICY people_public_read
  ON public.people FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS people_admin_insert ON public.people;
CREATE POLICY people_admin_insert
  ON public.people FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
DROP POLICY IF EXISTS people_admin_update ON public.people;
CREATE POLICY people_admin_update
  ON public.people FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
DROP POLICY IF EXISTS people_admin_delete ON public.people;
CREATE POLICY people_admin_delete
  ON public.people FOR DELETE TO authenticated USING (public.is_archive_admin());

-- events
DROP POLICY IF EXISTS events_public_read ON public.events;
CREATE POLICY events_public_read
  ON public.events FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY events_admin_insert
  ON public.events FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY events_admin_update
  ON public.events FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY events_admin_delete
  ON public.events FOR DELETE TO authenticated USING (public.is_archive_admin());

-- locations
CREATE POLICY locations_public_read
  ON public.locations FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY locations_admin_insert
  ON public.locations FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY locations_admin_update
  ON public.locations FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY locations_admin_delete
  ON public.locations FOR DELETE TO authenticated USING (public.is_archive_admin());

-- sources
CREATE POLICY sources_public_read
  ON public.sources FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY sources_admin_insert
  ON public.sources FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY sources_admin_update
  ON public.sources FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY sources_admin_delete
  ON public.sources FOR DELETE TO authenticated USING (public.is_archive_admin());

-- document_people: readable when parent document is published+verified
CREATE POLICY document_people_public_read
  ON public.document_people FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
        AND d.status = 'published'
        AND d.verification_status = 'verified'
    )
    OR public.is_archive_admin()
  );

CREATE POLICY document_people_admin_insert
  ON public.document_people FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY document_people_admin_update
  ON public.document_people FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY document_people_admin_delete
  ON public.document_people FOR DELETE TO authenticated USING (public.is_archive_admin());

-- document_events
CREATE POLICY document_events_public_read
  ON public.document_events FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
        AND d.status = 'published'
        AND d.verification_status = 'verified'
    )
    OR public.is_archive_admin()
  );

CREATE POLICY document_events_admin_insert
  ON public.document_events FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY document_events_admin_update
  ON public.document_events FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY document_events_admin_delete
  ON public.document_events FOR DELETE TO authenticated USING (public.is_archive_admin());

-- document_metadata
CREATE POLICY document_metadata_public_read
  ON public.document_metadata FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
        AND d.status = 'published'
        AND d.verification_status = 'verified'
    )
    OR public.is_archive_admin()
  );

CREATE POLICY document_metadata_admin_insert
  ON public.document_metadata FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY document_metadata_admin_update
  ON public.document_metadata FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY document_metadata_admin_delete
  ON public.document_metadata FOR DELETE TO authenticated USING (public.is_archive_admin());

-- document_files (metadata rows only — storage objects remain private)
CREATE POLICY document_files_public_read
  ON public.document_files FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
        AND d.status = 'published'
        AND d.verification_status = 'verified'
    )
    OR public.is_archive_admin()
  );

CREATE POLICY document_files_admin_insert
  ON public.document_files FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY document_files_admin_update
  ON public.document_files FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY document_files_admin_delete
  ON public.document_files FOR DELETE TO authenticated USING (public.is_archive_admin());

-- document_chunks
CREATE POLICY document_chunks_public_read
  ON public.document_chunks FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
        AND d.status = 'published'
        AND d.verification_status = 'verified'
    )
    OR public.is_archive_admin()
  );

CREATE POLICY document_chunks_admin_insert
  ON public.document_chunks FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY document_chunks_admin_update
  ON public.document_chunks FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY document_chunks_admin_delete
  ON public.document_chunks FOR DELETE TO authenticated USING (public.is_archive_admin());

-- document_embeddings — no public read of raw vectors; admin only
CREATE POLICY document_embeddings_admin_select
  ON public.document_embeddings FOR SELECT TO authenticated USING (public.is_archive_admin());
CREATE POLICY document_embeddings_admin_insert
  ON public.document_embeddings FOR INSERT TO authenticated WITH CHECK (public.is_archive_admin());
CREATE POLICY document_embeddings_admin_update
  ON public.document_embeddings FOR UPDATE TO authenticated
  USING (public.is_archive_admin()) WITH CHECK (public.is_archive_admin());
CREATE POLICY document_embeddings_admin_delete
  ON public.document_embeddings FOR DELETE TO authenticated USING (public.is_archive_admin());
