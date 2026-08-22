create extension if not exists vector;

create table public.kb_chunks (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  disciplina text not null,
  topico text,
  doc_id uuid,
  titulo text,
  seq integer not null default 0,
  trecho text not null,
  content_hash text not null,
  embedding vector(3072) not null,
  created_at timestamptz not null default now()
);

GRANT ALL ON public.kb_chunks TO service_role;

ALTER TABLE public.kb_chunks ENABLE ROW LEVEL SECURITY;

create index kb_chunks_scope_idx on public.kb_chunks (course_slug, disciplina, topico);
create index kb_chunks_embedding_idx on public.kb_chunks using hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);

create or replace function public.match_kb_chunks(
  query_embedding vector(3072),
  p_curso text,
  p_disciplina text default null,
  p_topico text default null,
  match_count int default 8,
  match_threshold float default 0.28
)
returns table (
  id uuid,
  disciplina text,
  topico text,
  titulo text,
  trecho text,
  similarity float
)
language sql stable
security definer
set search_path = public
as $$
  with candidatos as (
    select
      c.id,
      c.disciplina,
      c.topico,
      c.titulo,
      c.trecho,
      1 - (c.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)) as sim
    from kb_chunks c
    where c.course_slug = p_curso
      and (p_disciplina is null or c.disciplina = p_disciplina)
    order by c.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)
    limit greatest(match_count * 4, 24)
  )
  select
    id,
    disciplina,
    topico,
    titulo,
    trecho,
    (sim + case when p_topico is not null and topico = p_topico then 0.08 else 0 end)::float as similarity
  from candidatos
  where sim >= match_threshold
  order by similarity desc
  limit match_count;
$$;