-- 1) Merge o glossário órfão na "Visão geral da matéria" (tópico nulo) de Legislação de Trânsito
UPDATE public.knowledge_docs g
SET conteudo = g.conteudo || E'\n\n---\n\n## Glossário do Trânsito: Vias e Termos Técnicos\n\n' || o.conteudo,
    updated_at = now()
FROM public.knowledge_docs o
WHERE g.id = 'e791ba54-5b75-4774-8db8-acd0e26ed4d0'
  AND o.id = 'c18d7bfa-9d44-4a4a-8be0-1f6f8d0131a2';

DELETE FROM public.knowledge_docs WHERE id = 'c18d7bfa-9d44-4a4a-8be0-1f6f8d0131a2';

-- 2) Remove as 7 aulas antigas substituídas pelas versões novas
DELETE FROM public.knowledge_docs WHERE id IN (
  '7a01fab3-32da-4d65-8501-2dd70c84d94a',
  '11969820-9d8c-422c-aae8-0e3ea6a16737',
  '7c10c3b2-61ed-4c10-bf3d-47c50d8c83f9',
  '0ac98d6c-3790-4b7c-9344-f515d45ec418',
  'bc16a64e-c64f-41c6-a841-950e92b26be5',
  '00aa2a52-bb7d-436b-97aa-698f10bb7270',
  'f7897a16-2e47-45e6-8fa0-3f2f09157fc7'
);

-- 3) Log administrativo
INSERT INTO public.admin_logs (admin_id, acao, alvo_tipo, alvo_id, detalhes)
SELECT ur.user_id, 'limpeza_conhecimento', 'knowledge_docs', NULL,
  jsonb_build_object(
    'disciplina','Legislação de Trânsito',
    'glossario_movido_para','visao_geral',
    'aulas_antigas_excluidas',7
  )
FROM public.user_roles ur WHERE ur.role='admin' LIMIT 1;