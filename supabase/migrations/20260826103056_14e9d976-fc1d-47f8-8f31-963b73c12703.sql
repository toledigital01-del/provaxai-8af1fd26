ALTER TABLE public.topics
  ADD COLUMN IF NOT EXISTS modulo text,
  ADD COLUMN IF NOT EXISTS modulo_ordem integer;

CREATE INDEX IF NOT EXISTS topics_modulo_idx ON public.topics (discipline_id, modulo_ordem, ordem);