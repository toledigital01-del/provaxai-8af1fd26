INSERT INTO public.platform_settings (chave, valor, publico) VALUES
 ('ia_athena', '{"provider":"lovable","model":"google/gemini-3-flash-preview"}'::jsonb, true),
 ('ia_sistema', '{"provider":"lovable","model":"google/gemini-3-flash-preview"}'::jsonb, true),
 ('voz_elevenlabs', '{"ativo":false,"voice_id":"9BWtsMINqrJLrRacOk9x","model":"eleven_turbo_v2_5"}'::jsonb, true)
ON CONFLICT (chave) DO NOTHING;