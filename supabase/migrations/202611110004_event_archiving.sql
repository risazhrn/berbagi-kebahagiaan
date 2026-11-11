
-- =====================================================
-- BERBAGI KEBAHAGIAAN
-- MIGRASI FITUR ARSIP DAN KEAMANAN PENGHAPUSAN EVENT
-- =====================================================

BEGIN;

-- 1. Menambahkan kolom arsip
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS is_archived
BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Index untuk mempercepat filter arsip
CREATE INDEX IF NOT EXISTS events_archive_created_idx
ON public.events (is_archived, created_at DESC);

-- 3. Mencegah penghapusan event yang memiliki
--    data terkait melalui foreign key

CREATE OR REPLACE FUNCTION
public.prevent_event_delete_with_references()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog
AS $$
DECLARE
    fk RECORD;
    has_reference BOOLEAN;
BEGIN
    FOR fk IN
        SELECT
            c.conrelid::regclass AS referring_table,
            a.attname AS referring_column,
            cardinality(c.conkey) AS columns_count
        FROM pg_constraint c
        JOIN pg_attribute a
          ON a.attrelid = c.conrelid
         AND a.attnum = c.conkey[1]
        WHERE c.contype = 'f'
          AND c.confrelid = 'public.events'::regclass
    LOOP
        IF fk.columns_count <> 1 THEN
            RAISE EXCEPTION
            'Cannot delete event: composite foreign key exists';
        END IF;

        EXECUTE format(
            'SELECT EXISTS (
                SELECT 1 FROM %s WHERE %I = $1
            )',
            fk.referring_table,
            fk.referring_column
        )
        INTO has_reference
        USING OLD.id;

        IF has_reference THEN
            RAISE EXCEPTION
            'Cannot delete event: linked records exist in %',
            fk.referring_table;
        END IF;
    END LOOP;

    RETURN OLD;
END;
$$;

-- 4. Mengaktifkan trigger pengamanan

DROP TRIGGER IF EXISTS
events_prevent_delete_with_references
ON public.events;

CREATE TRIGGER events_prevent_delete_with_references
BEFORE DELETE ON public.events
FOR EACH ROW
EXECUTE FUNCTION
public.prevent_event_delete_with_references();

COMMIT;
