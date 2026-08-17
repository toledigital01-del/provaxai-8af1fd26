WITH tot AS (
  SELECT c.slug, count(t.id)::numeric AS n
  FROM courses c JOIN disciplines d ON d.course_id=c.id JOIN topics t ON t.discipline_id=d.id
  GROUP BY c.slug
), disc AS (
  SELECT c.slug, d.nome, count(t.id)::numeric AS n
  FROM courses c JOIN disciplines d ON d.course_id=c.id LEFT JOIN topics t ON t.discipline_id=d.id
  GROUP BY c.slug, d.nome
), agg AS (
  SELECT s.id,
    COALESCE(round(SUM(LEAST(100, tp.dominio))::numeric / NULLIF(tot.n,0)), 0) AS dom
  FROM dominio_snapshots s
  JOIN tot ON tot.slug = s.course_slug
  LEFT JOIN topic_progress tp ON tp.user_id = s.user_id AND tp.course_slug = s.course_slug
  GROUP BY s.id, tot.n
), pd AS (
  SELECT s.id, COALESCE(jsonb_object_agg(disc.nome, sub.val) FILTER (WHERE disc.nome IS NOT NULL), '{}'::jsonb) AS j
  FROM dominio_snapshots s
  JOIN disc ON disc.slug = s.course_slug
  CROSS JOIN LATERAL (
    SELECT COALESCE(round(SUM(LEAST(100, tp.dominio))::numeric / NULLIF(disc.n,0)), 0) AS val
    FROM topic_progress tp
    WHERE tp.user_id = s.user_id AND tp.course_slug = s.course_slug AND tp.discipline_nome = disc.nome
  ) sub
  GROUP BY s.id
)
UPDATE dominio_snapshots s
SET dominio = agg.dom, por_disciplina = pd.j
FROM agg, pd
WHERE agg.id = s.id AND pd.id = s.id;