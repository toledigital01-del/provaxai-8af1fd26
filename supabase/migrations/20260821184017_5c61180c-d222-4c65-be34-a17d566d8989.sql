CREATE TABLE public.aulas_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  disciplina text NOT NULL,
  topico text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text,
  conteudo text NOT NULL,
  modelo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX aulas_ia_unica ON public.aulas_ia (course_slug, disciplina, topico, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid));

GRANT SELECT ON public.aulas_ia TO authenticated;
GRANT ALL ON public.aulas_ia TO service_role;

ALTER TABLE public.aulas_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alunos leem aulas compartilhadas ou proprias"
ON public.aulas_ia FOR SELECT TO authenticated
USING (user_id IS NULL OR user_id = auth.uid());

CREATE TRIGGER trg_aulas_ia_updated BEFORE UPDATE ON public.aulas_ia
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();