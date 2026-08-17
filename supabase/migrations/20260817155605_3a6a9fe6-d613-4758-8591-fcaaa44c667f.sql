CREATE TABLE public.dominio_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug text NOT NULL DEFAULT 'prf-2021',
  dia date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Sao_Paulo')::date,
  dominio integer NOT NULL DEFAULT 0,
  acertos_pct integer NOT NULL DEFAULT 0,
  questoes integer NOT NULL DEFAULT 0,
  tempo_segundos integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_slug, dia)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dominio_snapshots TO authenticated;
GRANT ALL ON public.dominio_snapshots TO service_role;
ALTER TABLE public.dominio_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own snapshots" ON public.dominio_snapshots FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read snapshots" ON public.dominio_snapshots FOR SELECT TO authenticated USING (public.is_admin());