CREATE TABLE IF NOT EXISTS public.flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  ease numeric NOT NULL DEFAULT 2.5,
  intervalo_dias integer NOT NULL DEFAULT 0,
  repeticoes integer NOT NULL DEFAULT 0,
  due_at timestamptz NOT NULL DEFAULT now(),
  last_review_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, card_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcard_reviews TO authenticated;
GRANT ALL ON public.flashcard_reviews TO service_role;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcard_reviews_own" ON public.flashcard_reviews FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_flashcard_reviews_updated BEFORE UPDATE ON public.flashcard_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.study_blocks
  ADD CONSTRAINT study_blocks_unico UNIQUE (user_id, dia, discipline_nome, topic_nome);