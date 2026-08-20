-- Direitos autorais deixam de existir: todo documento-fonte fica visível ao aluno com acesso
UPDATE public.kb_documentos SET status_direitos = 'material_proprio' WHERE status_direitos <> 'material_proprio';
ALTER TABLE public.kb_documentos ALTER COLUMN status_direitos SET DEFAULT 'material_proprio';

DROP POLICY IF EXISTS "Alunos leem material liberado" ON public.kb_documentos;
CREATE POLICY "Alunos leem material liberado" ON public.kb_documentos
FOR SELECT TO authenticated
USING (public.has_course_access(course_slug));

-- Revisão simplificada: apenas rascunho ou publicado
UPDATE public.knowledge_docs SET status = 'publicado' WHERE status = 'revisado' AND publicado IS TRUE;
UPDATE public.knowledge_docs SET status = 'rascunho' WHERE status = 'revisado';