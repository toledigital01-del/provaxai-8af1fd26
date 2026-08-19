-- Alunos com acesso ao curso podem ler apenas documentos-fonte com direitos liberados
DROP POLICY IF EXISTS "Alunos leem material liberado" ON public.kb_documentos;
CREATE POLICY "Alunos leem material liberado" ON public.kb_documentos
FOR SELECT TO authenticated
USING (
  status_direitos IN ('dominio_publico','material_proprio')
  AND public.has_course_access(course_slug)
);

-- Contagem (apenas número) de documentos retidos por revisão de direitos
CREATE OR REPLACE FUNCTION public.kb_material_retido(_disciplina text, _curso text DEFAULT 'prf-2021')
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN public.has_course_access(_curso) THEN (
    SELECT count(*)::int FROM public.kb_documentos
    WHERE course_slug = _curso
      AND discipline_nome = _disciplina
      AND status_direitos = 'terceiro_verificar'
  ) ELSE 0 END;
$$;

REVOKE ALL ON FUNCTION public.kb_material_retido(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.kb_material_retido(text, text) TO authenticated;