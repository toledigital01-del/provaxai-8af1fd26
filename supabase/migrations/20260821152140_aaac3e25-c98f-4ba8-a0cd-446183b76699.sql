ALTER TABLE public.knowledge_docs
  ADD COLUMN IF NOT EXISTS modo_exibicao text NOT NULL DEFAULT 'texto',
  ADD COLUMN IF NOT EXISTS pdf_url text;

CREATE POLICY "aulas_pdf_auth_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'aulas-pdf');
CREATE POLICY "aulas_pdf_admin_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'aulas-pdf' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "aulas_pdf_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'aulas-pdf' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "aulas_pdf_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'aulas-pdf' AND public.has_role(auth.uid(), 'admin'));