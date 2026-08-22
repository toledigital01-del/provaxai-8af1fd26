CREATE TABLE public.aula_recursos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_slug text NOT NULL,
  disciplina text NOT NULL,
  topico text,
  tipo text NOT NULL,
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  modelo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX aula_recursos_uniq ON public.aula_recursos (course_slug, disciplina, coalesce(topico, ''), tipo);

GRANT SELECT ON public.aula_recursos TO authenticated;
GRANT ALL ON public.aula_recursos TO service_role;

ALTER TABLE public.aula_recursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos autenticados leem recursos das aulas"
  ON public.aula_recursos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin gerencia recursos das aulas"
  ON public.aula_recursos FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER trg_aula_recursos_updated BEFORE UPDATE ON public.aula_recursos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();