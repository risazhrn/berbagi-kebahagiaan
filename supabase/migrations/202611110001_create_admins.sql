
BEGIN;

-- =========================================
-- MODUL 1: ADMIN AUTHENTICATION
-- =========================================

CREATE TABLE public.admins (
  id UUID PRIMARY KEY
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL
    DEFAULT NOW()
);

ALTER TABLE public.admins
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read own membership"
ON public.admins
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = id
);

GRANT SELECT ON public.admins
TO authenticated;

REVOKE INSERT, UPDATE, DELETE
ON public.admins
FROM anon, authenticated;

REVOKE ALL ON public.admins
FROM anon;

COMMIT;
