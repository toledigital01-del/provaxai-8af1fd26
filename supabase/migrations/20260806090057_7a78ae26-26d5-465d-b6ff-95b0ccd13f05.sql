CREATE OR REPLACE FUNCTION public.is_support()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT public.has_role(auth.uid(), 'suporte'::app_role) $$;

REVOKE ALL ON FUNCTION public.is_support() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_support() TO authenticated;

DROP POLICY tickets_read_own ON public.support_tickets;
CREATE POLICY tickets_read_own ON public.support_tickets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin() OR public.is_support());

DROP POLICY tickets_update_staff ON public.support_tickets;
CREATE POLICY tickets_update_staff ON public.support_tickets FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.is_support())
  WITH CHECK (public.is_admin() OR public.is_support());

DROP POLICY ticket_msgs_read ON public.ticket_messages;
CREATE POLICY ticket_msgs_read ON public.ticket_messages FOR SELECT TO authenticated
  USING (public.is_admin() OR public.is_support() OR EXISTS (
    SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_messages.ticket_id AND t.user_id = auth.uid()));

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;