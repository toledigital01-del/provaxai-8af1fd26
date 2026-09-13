DROP POLICY IF EXISTS temp_console_anon ON public.platform_settings;
DROP POLICY IF EXISTS temp_console_anon ON public.coupons;
DROP POLICY IF EXISTS temp_console_anon ON public.plans;
DROP POLICY IF EXISTS temp_console_anon ON public.ai_settings;

REVOKE INSERT, UPDATE, DELETE ON public.platform_settings FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.coupons FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.plans FROM anon;
REVOKE ALL ON public.ai_settings FROM anon;