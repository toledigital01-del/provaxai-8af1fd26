CREATE TABLE IF NOT EXISTS public.podcasts_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_slug TEXT NOT NULL,
  disciplina TEXT NOT NULL,
  topico TEXT,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  roteiro JSONB NOT NULL,
  modelo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.podcasts_ia TO authenticated;
GRANT ALL ON public.podcasts_ia TO service_role;
ALTER TABLE public.podcasts_ia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Episodios oficiais visiveis" ON public.podcasts_ia;
CREATE POLICY "Episodios oficiais visiveis" ON public.podcasts_ia FOR SELECT TO authenticated USING (user_id IS NULL OR user_id = auth.uid());
CREATE INDEX IF NOT EXISTS podcasts_ia_busca ON public.podcasts_ia (course_slug, disciplina, topico);

CREATE TABLE IF NOT EXISTS public.tts_cache (
  hash TEXT PRIMARY KEY,
  voz TEXT NOT NULL,
  caracteres INTEGER NOT NULL DEFAULT 0,
  caminho TEXT NOT NULL,
  provedor TEXT,
  usos INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tts_cache TO authenticated;
GRANT ALL ON public.tts_cache TO service_role;
ALTER TABLE public.tts_cache ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cache de audio legivel" ON public.tts_cache;
CREATE POLICY "Cache de audio legivel" ON public.tts_cache FOR SELECT TO authenticated USING (true);