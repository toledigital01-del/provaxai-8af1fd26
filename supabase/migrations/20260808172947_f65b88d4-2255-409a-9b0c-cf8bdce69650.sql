-- 1) Regras públicas sem depender de is_admin() (que não é executável por visitantes)
DROP POLICY IF EXISTS courses_public_read ON public.courses;
CREATE POLICY courses_anon_read ON public.courses FOR SELECT TO anon USING (status <> 'rascunho');
CREATE POLICY courses_auth_read ON public.courses FOR SELECT TO authenticated USING (status <> 'rascunho' OR public.is_admin());

DROP POLICY IF EXISTS plans_read ON public.plans;
CREATE POLICY plans_anon_read ON public.plans FOR SELECT TO anon USING (ativo);
CREATE POLICY plans_auth_read ON public.plans FOR SELECT TO authenticated USING (ativo OR public.is_admin());

DROP POLICY IF EXISTS coupons_read ON public.coupons;
CREATE POLICY coupons_anon_read ON public.coupons FOR SELECT TO anon USING (ativo);
CREATE POLICY coupons_auth_read ON public.coupons FOR SELECT TO authenticated USING (ativo OR public.is_admin());

DROP POLICY IF EXISTS questions_read ON public.questions;
CREATE POLICY questions_anon_read ON public.questions FOR SELECT TO anon USING (ativa);
CREATE POLICY questions_auth_read ON public.questions FOR SELECT TO authenticated USING (ativa OR public.is_admin());

DROP POLICY IF EXISTS settings_read ON public.platform_settings;
CREATE POLICY settings_anon_read ON public.platform_settings FOR SELECT TO anon USING (publico);
CREATE POLICY settings_auth_read ON public.platform_settings FOR SELECT TO authenticated USING (publico OR public.is_admin());

DROP POLICY IF EXISTS flashcards_read ON public.flashcards;
CREATE POLICY flashcards_anon_read ON public.flashcards FOR SELECT TO anon USING (is_oficial);
CREATE POLICY flashcards_auth_read ON public.flashcards FOR SELECT TO authenticated
  USING (is_oficial OR user_id = auth.uid() OR public.is_admin());

-- 2) Verificação de acesso ao curso (compra vitalícia ou assinatura ativa)
CREATE OR REPLACE FUNCTION public.has_course_access(_slug text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.course_access ca
    JOIN public.courses c ON c.id = ca.course_id
    WHERE ca.user_id = auth.uid()
      AND c.slug = _slug
      AND (ca.expira_em IS NULL OR ca.expira_em > now())
  ) OR EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = auth.uid()
      AND s.status IN ('active','trialing')
      AND (s.current_period_end IS NULL OR s.current_period_end > now())
  ) OR public.is_admin();
$$;

REVOKE ALL ON FUNCTION public.has_course_access(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_course_access(text) TO authenticated, service_role;

-- 3) Conteúdo pago: nada de leitura anônima
DROP POLICY IF EXISTS knowledge_docs_read_published_anon ON public.knowledge_docs;
DROP POLICY IF EXISTS knowledge_docs_read_published_auth ON public.knowledge_docs;
CREATE POLICY knowledge_docs_read_paid ON public.knowledge_docs FOR SELECT TO authenticated
  USING (public.is_admin() OR (publicado = true AND public.has_course_access(course_slug)));

REVOKE SELECT ON public.knowledge_docs FROM anon;