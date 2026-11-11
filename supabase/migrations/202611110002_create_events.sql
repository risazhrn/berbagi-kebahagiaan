
BEGIN;

-- =========================================
-- MODUL 2: EVENTS MANAGEMENT
-- =========================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  slug TEXT NOT NULL UNIQUE
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  title TEXT NOT NULL
    CHECK (length(trim(title)) BETWEEN 3 AND 200),

  category TEXT NOT NULL
    CHECK (length(trim(category)) > 0),

  description TEXT NOT NULL
    CHECK (length(trim(description)) > 0),

  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,

  registration_open_at TIMESTAMPTZ,
  registration_close_at TIMESTAMPTZ,

  location TEXT NOT NULL
    CHECK (length(trim(location)) > 0),

  address TEXT,
  maps_url TEXT,

  price INTEGER NOT NULL CHECK (price > 0),
  quota INTEGER NOT NULL CHECK (quota > 0),

  poster_path TEXT,

  contact_whatsapp TEXT,
  requirements TEXT,
  what_to_bring TEXT,
  refund_policy TEXT,

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (
      status IN (
        'draft',
        'published',
        'completed',
        'cancelled'
      )
    ),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_event_time
    CHECK (end_at > start_at),

  CONSTRAINT valid_registration_time
    CHECK (
      registration_open_at IS NULL
      OR registration_close_at IS NULL
      OR registration_close_at > registration_open_at
    ),

  CONSTRAINT registration_closes_before_start
    CHECK (
      registration_close_at IS NULL
      OR registration_close_at <= start_at
    )
);

-- =========================================
-- INDEX
-- =========================================

CREATE INDEX idx_events_status_start
ON public.events(status, start_at);

CREATE INDEX idx_events_status_end
ON public.events(status, end_at);

-- =========================================
-- AUTO UPDATE TIMESTAMP
-- =========================================

CREATE FUNCTION public.update_event_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_event_timestamp();

-- =========================================
-- SECURITY
-- =========================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.events FROM anon, authenticated;

GRANT SELECT ON public.events
TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE
ON public.events TO authenticated;

-- Event publik
CREATE POLICY "Public read events"
ON public.events
FOR SELECT
TO anon, authenticated
USING (
  status IN ('published', 'completed')
);

-- Admin dapat membaca semua event
CREATE POLICY "Admin read all events"
ON public.events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

-- Admin dapat membuat event
CREATE POLICY "Admin insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

-- Admin dapat memperbarui event
CREATE POLICY "Admin update events"
ON public.events
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

-- Admin dapat menghapus event
CREATE POLICY "Admin delete events"
ON public.events
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.admins
    WHERE id = (SELECT auth.uid())
  )
);

REVOKE ALL ON FUNCTION public.update_event_timestamp()
FROM PUBLIC, anon, authenticated;

COMMIT;