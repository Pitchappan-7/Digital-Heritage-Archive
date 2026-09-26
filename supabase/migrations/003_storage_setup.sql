-- Digital Heritage Archive — Supabase Storage setup
-- Migration: 003_storage_setup.sql
--
-- Creates the private heritage-files bucket and storage RLS policies.
-- Private objects are accessed via signed URLs from the application layer.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'heritage-files',
  'heritage-files',
  false,
  104857600,
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'video/mp4',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Admins can upload / update / delete objects in heritage-files
DROP POLICY IF EXISTS heritage_files_admin_insert ON storage.objects;
CREATE POLICY heritage_files_admin_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'heritage-files'
    AND public.is_archive_admin()
  );

DROP POLICY IF EXISTS heritage_files_admin_update ON storage.objects;
CREATE POLICY heritage_files_admin_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'heritage-files'
    AND public.is_archive_admin()
  )
  WITH CHECK (
    bucket_id = 'heritage-files'
    AND public.is_archive_admin()
  );

DROP POLICY IF EXISTS heritage_files_admin_delete ON storage.objects;
CREATE POLICY heritage_files_admin_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'heritage-files'
    AND public.is_archive_admin()
  );

-- Authenticated admins may read objects; anon has no direct storage SELECT.
-- Application issues signed URLs for controlled access to private files.
DROP POLICY IF EXISTS heritage_files_admin_select ON storage.objects;
CREATE POLICY heritage_files_admin_select
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'heritage-files'
    AND public.is_archive_admin()
  );
