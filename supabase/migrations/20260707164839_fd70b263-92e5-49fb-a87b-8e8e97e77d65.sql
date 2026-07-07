
DROP POLICY IF EXISTS "Anyone can read activity events (demo)" ON public.activity_events;
DROP POLICY IF EXISTS "Anyone can insert activity events (demo)" ON public.activity_events;

REVOKE ALL ON public.activity_events FROM anon;
REVOKE INSERT ON public.activity_events FROM authenticated;
GRANT SELECT ON public.activity_events TO authenticated;

CREATE POLICY "Authenticated users can read activity events"
  ON public.activity_events FOR SELECT
  TO authenticated
  USING (true);
