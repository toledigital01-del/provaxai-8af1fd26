-- Atualiza os preços dos planos pagos para R$47/mês e R$397/ano (decisão de negócio).
UPDATE public.plans SET preco_cents = 4700 WHERE slug = 'pro-mensal';
UPDATE public.plans
  SET preco_cents = 39700,
      descricao = 'Economize 30% no plano anual',
      recursos = '["Tudo do Pro","Economize 30%"]'::jsonb
  WHERE slug = 'pro-anual';
