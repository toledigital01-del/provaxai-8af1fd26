-- ===== corrigir avisos do linter =====
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ===== FINANCEIRO =====
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  descricao text,
  preco_cents integer NOT NULL DEFAULT 0,
  intervalo text NOT NULL DEFAULT 'mensal',
  recursos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plans_read" ON public.plans FOR SELECT TO anon, authenticated USING (ativo OR public.is_admin());
CREATE POLICY "plans_admin" ON public.plans FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'inativa',
  provider text,
  provider_subscription_id text,
  current_period_end timestamptz,
  cancel_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subs_read_own" ON public.subscriptions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "subs_admin" ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  valor_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  provider text,
  provider_payment_id text,
  cupom text,
  reembolsado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchases_read_own" ON public.purchases FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "purchases_admin" ON public.purchases FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  desconto_percent integer NOT NULL DEFAULT 0,
  desconto_cents integer NOT NULL DEFAULT 0,
  usos_maximos integer,
  usos integer NOT NULL DEFAULT 0,
  expira_em timestamptz,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons_read" ON public.coupons FOR SELECT TO anon, authenticated USING (ativo OR public.is_admin());
CREATE POLICY "coupons_admin" ON public.coupons FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.course_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  origem text NOT NULL DEFAULT 'manual',
  expira_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT ON public.course_access TO authenticated;
GRANT ALL ON public.course_access TO service_role;
ALTER TABLE public.course_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access_read_own" ON public.course_access FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "access_admin" ON public.course_access FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ===== IA =====
CREATE TABLE public.ai_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  prompt text,
  modelo text NOT NULL DEFAULT 'google/gemini-2.5-flash',
  limite_diario integer NOT NULL DEFAULT 200,
  ativo boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_settings TO authenticated;
GRANT ALL ON public.ai_settings TO service_role;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_settings_admin" ON public.ai_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.ai_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ferramenta text,
  modelo text,
  discipline_nome text,
  topic_nome text,
  pergunta text,
  resposta text,
  tokens_entrada integer NOT NULL DEFAULT 0,
  tokens_saida integer NOT NULL DEFAULT 0,
  custo_cents numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_logs TO authenticated;
GRANT ALL ON public.ai_logs TO service_role;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_logs_read_own" ON public.ai_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- ===== SUPORTE =====
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo text NOT NULL DEFAULT 'suporte',
  assunto text NOT NULL,
  descricao text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'aberto',
  prioridade text NOT NULL DEFAULT 'normal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tickets_read_own" ON public.support_tickets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin() OR public.has_role(auth.uid(), 'suporte'));
CREATE POLICY "tickets_insert_own" ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "tickets_update_staff" ON public.support_tickets FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'suporte'))
  WITH CHECK (public.is_admin() OR public.has_role(auth.uid(), 'suporte'));
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  mensagem text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_msgs_read" ON public.ticket_messages FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_role(auth.uid(), 'suporte')
         OR EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));
CREATE POLICY "ticket_msgs_insert" ON public.ticket_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ===== CONFIGURAÇÕES E LOGS =====
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  valor jsonb NOT NULL DEFAULT '{}'::jsonb,
  publico boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_read" ON public.platform_settings FOR SELECT TO anon, authenticated
  USING (publico OR public.is_admin());
CREATE POLICY "settings_admin" ON public.platform_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  acao text NOT NULL,
  alvo_tipo text,
  alvo_id text,
  detalhes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_logs TO authenticated;
GRANT ALL ON public.admin_logs TO service_role;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_logs_admin" ON public.admin_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin_logs_insert" ON public.admin_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() AND admin_id = auth.uid());

CREATE TABLE public.login_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.login_events TO authenticated;
GRANT ALL ON public.login_events TO service_role;
ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "login_events_read" ON public.login_events FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "login_events_insert" ON public.login_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ===== SEED =====
INSERT INTO public.plans (slug, nome, descricao, preco_cents, intervalo, recursos, ordem) VALUES
  ('free', 'Gratuito', 'Material próprio e ferramentas básicas', 0, 'mensal', '["Material próprio","Flashcards","Anotações"]'::jsonb, 0),
  ('pro-mensal', 'Prova X Pro', 'Acesso completo com Athena IA', 4990, 'mensal', '["Todos os cursos","Athena IA ilimitada","Simulados Cebraspe","Cronograma adaptativo"]'::jsonb, 1),
  ('pro-anual', 'Prova X Pro Anual', 'Dois meses grátis no plano anual', 49900, 'anual', '["Tudo do Pro","2 meses grátis"]'::jsonb, 2);

INSERT INTO public.courses (slug, nome, descricao, categoria, capa_url, preco_cents, status, ordem) VALUES
  ('prf-2021', 'Curso Polícia Rodoviária Federal', 'Curso completo para a PRF: planejamento, aulas com a Athena IA, flashcards, questões e simulados no padrão Cebraspe.', 'Carreiras Policiais', 'curso-prf.jpg', 69900, 'publicado', 0),
  ('pf-2026', 'Concurso Polícia Federal', 'Em breve.', 'Carreiras Policiais', null, 0, 'em_breve', 1);

INSERT INTO public.ai_settings (chave, prompt, modelo) VALUES
  ('tutor', 'Você é a Athena, tutora de concursos públicos brasileiros. Explique de forma direta, com exemplos de prova Cebraspe.', 'google/gemini-2.5-flash'),
  ('resumo', 'Gere um resumo inteligente do material, grifando os trechos essenciais para memorização.', 'google/gemini-2.5-flash');

INSERT INTO public.platform_settings (chave, valor, publico) VALUES
  ('branding', '{"nome":"Prova X","cor_primaria":"#2563EB","logo_url":null}'::jsonb, true);