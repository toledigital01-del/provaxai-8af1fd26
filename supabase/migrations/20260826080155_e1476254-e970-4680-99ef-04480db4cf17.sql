ALTER TABLE public.aulas_ia ADD COLUMN IF NOT EXISTS formato text NOT NULL DEFAULT 'markdown';
ALTER TABLE public.aulas_ia DROP CONSTRAINT IF EXISTS aulas_ia_formato_check;
ALTER TABLE public.aulas_ia ADD CONSTRAINT aulas_ia_formato_check CHECK (formato IN ('markdown','html'));