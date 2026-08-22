CREATE TABLE public.rag_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_slug text NOT NULL,
  disciplina text,
  max_chars integer NOT NULL DEFAULT 12000,
  top_k integer NOT NULL DEFAULT 8,
  threshold double precision NOT NULL DEFAULT 0.28,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT rag_settings_scope_key UNIQUE NULLS NOT DISTINCT (course_slug, disciplina)
);
GRANT SELECT ON public.rag_settings TO authenticated;
GRANT ALL ON public.rag_settings TO service_role;
ALTER TABLE public.rag_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins gerenciam rag_settings" ON public.rag_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_rag_settings_updated BEFORE UPDATE ON public.rag_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE public.rag_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  course_slug text NOT NULL,
  disciplina text NOT NULL,
  topico text,
  pergunta text,
  rag_ativo boolean NOT NULL DEFAULT false,
  trechos integer NOT NULL DEFAULT 0,
  sim_media double precision,
  sim_max double precision,
  motivo_fallback text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rag_events TO authenticated;
GRANT ALL ON public.rag_events TO service_role;
ALTER TABLE public.rag_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins leem rag_events" ON public.rag_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_rag_events_escopo ON public.rag_events (course_slug, disciplina, created_at DESC);
CREATE INDEX idx_rag_settings_escopo ON public.rag_settings (course_slug, disciplina);