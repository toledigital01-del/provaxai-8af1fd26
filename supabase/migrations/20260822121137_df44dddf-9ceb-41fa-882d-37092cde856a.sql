CREATE TABLE public.aula_conteudos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_slug TEXT NOT NULL DEFAULT 'prf-2021',
  disciplina TEXT NOT NULL,
  topico TEXT NOT NULL,
  tipo TEXT NOT NULL,
  conteudo TEXT NOT NULL DEFAULT '',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  versao INTEGER NOT NULL DEFAULT 1,
  origem TEXT NOT NULL DEFAULT 'ia',
  publicado BOOLEAN NOT NULL DEFAULT false,
  instrucao TEXT,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX aula_conteudos_aula_idx ON public.aula_conteudos (course_slug, disciplina, topico, tipo, versao DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aula_conteudos TO authenticated;
GRANT ALL ON public.aula_conteudos TO service_role;
ALTER TABLE public.aula_conteudos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin gerencia conteudos da aula" ON public.aula_conteudos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "aluno le conteudo publicado da aula" ON public.aula_conteudos FOR SELECT TO authenticated USING (publicado);
CREATE TRIGGER trg_aula_conteudos_updated BEFORE UPDATE ON public.aula_conteudos FOR EACH ROW EXECUTE FUNCTION set_updated_at();