CREATE TABLE IF NOT EXISTS public.knowledge_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL DEFAULT 'prf-2021',
  disciplina text NOT NULL,
  topico text,
  titulo text,
  conteudo text NOT NULL DEFAULT '',
  publicado boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS knowledge_docs_lookup ON public.knowledge_docs (course_slug, disciplina, topico);

GRANT SELECT ON public.knowledge_docs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_docs TO authenticated;
GRANT ALL ON public.knowledge_docs TO service_role;

ALTER TABLE public.knowledge_docs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "knowledge_docs_read_published_anon" ON public.knowledge_docs;
CREATE POLICY "knowledge_docs_read_published_anon" ON public.knowledge_docs
  FOR SELECT TO anon USING (publicado = true);
DROP POLICY IF EXISTS "knowledge_docs_read_published_auth" ON public.knowledge_docs;
CREATE POLICY "knowledge_docs_read_published_auth" ON public.knowledge_docs
  FOR SELECT TO authenticated USING (publicado = true OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "knowledge_docs_admin_insert" ON public.knowledge_docs;
CREATE POLICY "knowledge_docs_admin_insert" ON public.knowledge_docs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "knowledge_docs_admin_update" ON public.knowledge_docs;
CREATE POLICY "knowledge_docs_admin_update" ON public.knowledge_docs
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "knowledge_docs_admin_delete" ON public.knowledge_docs;
CREATE POLICY "knowledge_docs_admin_delete" ON public.knowledge_docs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_knowledge_docs()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS knowledge_docs_updated_at ON public.knowledge_docs;
CREATE TRIGGER knowledge_docs_updated_at BEFORE UPDATE ON public.knowledge_docs
  FOR EACH ROW EXECUTE FUNCTION public.touch_knowledge_docs();