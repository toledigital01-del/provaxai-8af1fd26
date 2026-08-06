CREATE POLICY profiles_admin_read ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY profiles_admin_update ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY roles_admin_read ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY roles_admin_write ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY roles_admin_delete ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY ai_logs_admin ON public.ai_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY ai_logs_insert_own ON public.ai_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY sessions_admin ON public.study_sessions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY progress_admin_read ON public.topic_progress FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY tickets_admin_read ON public.support_tickets FOR SELECT TO authenticated USING (public.is_admin());