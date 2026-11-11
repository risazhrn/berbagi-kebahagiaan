
BEGIN;

-- =========================================
-- MODUL 2: EVENT POSTER STORAGE
-- Bucket: event-posters
-- =========================================

-- 1. Admin dapat melihat daftar file
CREATE POLICY "Admins can list event posters"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'event-posters'
  AND EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

-- 2. Admin dapat mengunggah poster
CREATE POLICY "Admins can upload event posters"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-posters'
  AND EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

-- 3. Admin dapat mengganti poster
CREATE POLICY "Admins can update event posters"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-posters'
  AND EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
)
WITH CHECK (
  bucket_id = 'event-posters'
  AND EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

-- 4. Admin dapat menghapus poster
CREATE POLICY "Admins can delete event posters"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-posters'
  AND EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

COMMIT;
