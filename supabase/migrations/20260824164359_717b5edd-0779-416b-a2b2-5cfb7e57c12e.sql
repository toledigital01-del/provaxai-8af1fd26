CREATE TABLE IF NOT EXISTS public.aula_editorial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL DEFAULT 'prf-2021',
  disciplina text NOT NULL,
  topico text NOT NULL,
  status text NOT NULL DEFAULT 'rascunho',
  versao_rotulo text NOT NULL DEFAULT 'v1.0',
  metadados jsonb NOT NULL DEFAULT '{}'::jsonb,
  auditoria jsonb NOT NULL DEFAULT '{}'::jsonb,
  observacoes text,
  ultima_verificacao timestamptz,
  ultima_atualizacao timestamptz,
  proxima_revisao date,
  atualizado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_slug, disciplina, topico)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.aula_editorial TO authenticated;
GRANT ALL ON public.aula_editorial TO service_role;

ALTER TABLE public.aula_editorial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam o controle editorial"
ON public.aula_editorial FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.tocar_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_aula_editorial_updated_at
BEFORE UPDATE ON public.aula_editorial
FOR EACH ROW EXECUTE FUNCTION public.tocar_updated_at();

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS origem text NOT NULL DEFAULT 'inedita',
  ADD COLUMN IF NOT EXISTS orgao text,
  ADD COLUMN IF NOT EXISTS cargo text,
  ADD COLUMN IF NOT EXISTS nivel text,
  ADD COLUMN IF NOT EXISTS verificada boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fonte text;