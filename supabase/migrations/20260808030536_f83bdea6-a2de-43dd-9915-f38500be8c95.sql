DO $$
DECLARE u uuid := 'e794d8ed-bd03-49df-9d84-5cdd4fb9d595';
        c uuid := '6516b4c5-b1e6-4427-b890-6d78ae7e3386';
        liberado boolean;
BEGIN
  -- simula PURCHASE_APPROVED (mensal)
  INSERT INTO public.purchases(user_id, course_id, valor_cents, status, provider, provider_payment_id)
  VALUES (u, c, 2900, 'pago', 'hotmart', 'TEST-TX-MENSAL');
  INSERT INTO public.course_access(user_id, course_id, origem) VALUES (u, c, 'hotmart');
  INSERT INTO public.subscriptions(user_id, status, provider, provider_subscription_id)
  VALUES (u, 'ativa', 'hotmart', 'TEST-SUB-MENSAL');

  SELECT EXISTS(SELECT 1 FROM public.course_access WHERE user_id=u AND course_id=c)
     AND EXISTS(SELECT 1 FROM public.subscriptions WHERE user_id=u AND status='ativa') INTO liberado;
  RAISE NOTICE 'mensal liberado: %', liberado;

  -- simula PURCHASE_REFUNDED
  DELETE FROM public.course_access WHERE user_id=u AND course_id=c AND origem='hotmart';
  UPDATE public.purchases SET status='reembolsado', reembolsado_em=now() WHERE provider_payment_id='TEST-TX-MENSAL';
  UPDATE public.subscriptions SET status='cancelada' WHERE user_id=u AND provider='hotmart';
  SELECT EXISTS(SELECT 1 FROM public.course_access WHERE user_id=u AND course_id=c)
      OR EXISTS(SELECT 1 FROM public.subscriptions WHERE user_id=u AND status='ativa') INTO liberado;
  RAISE NOTICE 'apos reembolso ainda liberado: %', liberado;

  -- simula plano anual
  INSERT INTO public.purchases(user_id, course_id, valor_cents, status, provider, provider_payment_id)
  VALUES (u, c, 29000, 'pago', 'hotmart', 'TEST-TX-ANUAL');
  INSERT INTO public.course_access(user_id, course_id, origem) VALUES (u, c, 'hotmart');
  INSERT INTO public.subscriptions(user_id, status, provider, provider_subscription_id)
  VALUES (u, 'ativa', 'hotmart', 'TEST-SUB-ANUAL');
  SELECT EXISTS(SELECT 1 FROM public.course_access WHERE user_id=u AND course_id=c) INTO liberado;
  RAISE NOTICE 'anual liberado: %', liberado;

  -- limpeza total dos dados de teste
  DELETE FROM public.course_access WHERE user_id=u AND origem='hotmart';
  DELETE FROM public.subscriptions WHERE provider_subscription_id IN ('TEST-SUB-MENSAL','TEST-SUB-ANUAL');
  DELETE FROM public.purchases WHERE provider_payment_id IN ('TEST-TX-MENSAL','TEST-TX-ANUAL');
END $$;