ALTER TABLE public.knowledge_docs ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'rascunho';
UPDATE public.knowledge_docs SET status = CASE WHEN publicado THEN 'publicado' ELSE 'rascunho' END;
ALTER TABLE public.knowledge_docs DROP CONSTRAINT IF EXISTS knowledge_docs_status_chk;
ALTER TABLE public.knowledge_docs ADD CONSTRAINT knowledge_docs_status_chk CHECK (status IN ('rascunho','revisado','publicado'));

CREATE OR REPLACE FUNCTION public.sync_knowledge_publicado()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status AND NEW.publicado IS DISTINCT FROM OLD.publicado THEN
    NEW.status := CASE WHEN NEW.publicado THEN 'publicado' ELSE 'rascunho' END;
  END IF;
  NEW.publicado := (NEW.status = 'publicado');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_knowledge_status ON public.knowledge_docs;
CREATE TRIGGER trg_knowledge_status BEFORE INSERT OR UPDATE ON public.knowledge_docs
FOR EACH ROW EXECUTE FUNCTION public.sync_knowledge_publicado();

CREATE TABLE IF NOT EXISTS public.kb_documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL DEFAULT 'prf-2021',
  discipline_nome text NOT NULL,
  topic_nome text,
  nome_arquivo text NOT NULL,
  tipo text NOT NULL DEFAULT 'texto',
  origem_url text,
  texto_extraido text NOT NULL DEFAULT '',
  status_direitos text NOT NULL DEFAULT 'terceiro_verificar',
  enviado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kb_documentos DROP CONSTRAINT IF EXISTS kb_documentos_tipo_chk;
ALTER TABLE public.kb_documentos ADD CONSTRAINT kb_documentos_tipo_chk CHECK (tipo IN ('pdf','imagem','texto','url','video','google_drive'));
ALTER TABLE public.kb_documentos DROP CONSTRAINT IF EXISTS kb_documentos_direitos_chk;
ALTER TABLE public.kb_documentos ADD CONSTRAINT kb_documentos_direitos_chk CHECK (status_direitos IN ('dominio_publico','material_proprio','terceiro_verificar'));

CREATE INDEX IF NOT EXISTS kb_documentos_disc_idx ON public.kb_documentos (course_slug, discipline_nome);
CREATE UNIQUE INDEX IF NOT EXISTS kb_documentos_origem_idx ON public.kb_documentos (course_slug, origem_url) WHERE origem_url IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kb_documentos TO authenticated;
GRANT ALL ON public.kb_documentos TO service_role;
ALTER TABLE public.kb_documentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins gerenciam documentos-fonte" ON public.kb_documentos;
CREATE POLICY "Admins gerenciam documentos-fonte" ON public.kb_documentos
FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());