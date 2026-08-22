create table if not exists public.ai_agents (
  slug text primary key,
  nome text not null,
  descricao text,
  grupo text not null default 'admin',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.ai_agents to authenticated;
grant all on public.ai_agents to service_role;
alter table public.ai_agents enable row level security;
create policy "Autenticados leem agentes" on public.ai_agents for select to authenticated using (true);

create table if not exists public.ai_agent_settings (
  agent_slug text primary key references public.ai_agents(slug) on delete cascade,
  provider text not null default 'anthropic',
  model text not null default 'claude-sonnet-4-5',
  custom_model text,
  fallback_provider text,
  fallback_model text,
  fallback_ativo boolean not null default true,
  prompt_extra text,
  limite_diario integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.ai_agent_settings to authenticated;
grant all on public.ai_agent_settings to service_role;
alter table public.ai_agent_settings enable row level security;
create policy "Autenticados leem rotas" on public.ai_agent_settings for select to authenticated using (true);

create table if not exists public.ai_integrations (
  provedor text primary key,
  nome text not null,
  ultimo_teste timestamptz,
  teste_ok boolean,
  teste_detalhe text,
  updated_at timestamptz not null default now()
);
grant select on public.ai_integrations to authenticated;
grant all on public.ai_integrations to service_role;
alter table public.ai_integrations enable row level security;
create policy "Admins leem integracoes" on public.ai_integrations for select to authenticated using (public.is_admin());

alter table public.ai_logs add column if not exists agent_slug text;
alter table public.ai_logs add column if not exists provider text;
alter table public.ai_logs add column if not exists sucesso boolean not null default true;
alter table public.ai_logs add column if not exists duracao_ms integer;

insert into public.ai_agents (slug, nome, descricao, grupo) values
  ('athena','Athena','Professora virtual que conversa com os alunos','aluno'),
  ('geracao_aulas','Geração de aulas','Aulas completas, roteiros de podcast e base de conhecimento da Athena','aluno'),
  ('geracao_questoes','Geração de questões','Questões certo/errado e preencher espaços','aluno'),
  ('revisao','Revisão inteligente','Revisões, pegadinhas de prova e correção de redação','aluno'),
  ('resumos','Resumos','Resumo inteligente e pontos-chave','aluno'),
  ('flashcards','Flashcards','Cartões de memorização','aluno'),
  ('assistente_admin','Assistente administrativo','Copiloto do painel e montagem de cursos (edital, classificação, currículo)','admin'),
  ('analise_desempenho','Análise de desempenho','Leituras e relatórios sobre o progresso dos alunos','admin'),
  ('tarefas_simples','Tarefas simples','Classificações, títulos e chamadas curtas de baixo custo','admin')
on conflict (slug) do nothing;

insert into public.ai_agent_settings (agent_slug)
select slug from public.ai_agents
on conflict (agent_slug) do nothing;

update public.ai_agent_settings s
set provider = coalesce(nullif(p.valor->>'provider',''), s.provider),
    model = coalesce(nullif(p.valor->>'model',''), s.model),
    limite_diario = coalesce(nullif(p.valor->>'limiteDiario','')::int, nullif(p.valor->>'limite_diario','')::int, s.limite_diario),
    updated_at = now()
from public.platform_settings p
where p.chave = 'ia_athena' and s.agent_slug = 'athena';

update public.ai_agent_settings s
set provider = coalesce(nullif(p.valor->>'provider',''), s.provider),
    model = coalesce(nullif(p.valor->>'model',''), s.model),
    updated_at = now()
from public.platform_settings p
where p.chave = 'ia_sistema' and s.agent_slug in ('assistente_admin','tarefas_simples');

update public.ai_agent_settings
set fallback_provider = 'lovable', fallback_model = 'google/gemini-3-flash-preview', fallback_ativo = true
where fallback_provider is null;

insert into public.ai_integrations (provedor, nome) values
  ('anthropic','Anthropic (Claude)'),
  ('openai','OpenAI (GPT)'),
  ('gemini','Google Gemini'),
  ('lovable','IA inclusa (Lovable)'),
  ('elevenlabs','ElevenLabs (voz)')
on conflict (provedor) do nothing;