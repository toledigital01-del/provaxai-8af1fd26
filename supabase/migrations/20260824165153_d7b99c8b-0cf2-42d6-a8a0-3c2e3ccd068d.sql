DO $$
DECLARE t text;
DECLARE alvos text[] := ARRAY['knowledge_docs','kb_documentos','kb_chunks','disciplines','topics','courses','questions','aula_conteudos','aula_recursos','aula_editorial','aulas_ia','podcasts_ia','platform_settings','rag_settings','ai_agents','ai_agent_settings','ai_settings','plans','coupons'];
BEGIN
  FOREACH t IN ARRAY alvos LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename=t) THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon', t);
      EXECUTE format('DROP POLICY IF EXISTS temp_console_anon ON public.%I', t);
      EXECUTE format('CREATE POLICY temp_console_anon ON public.%I FOR ALL TO anon USING (true) WITH CHECK (true)', t);
    END IF;
  END LOOP;
END $$;