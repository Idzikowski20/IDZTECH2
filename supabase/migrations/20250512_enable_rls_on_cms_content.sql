
-- Funkcja włączająca RLS na tabeli cms_content
CREATE OR REPLACE FUNCTION public.enable_rls_on_cms_content()
RETURNS void AS $$
BEGIN
  -- Włączenie RLS na tabeli cms_content
  EXECUTE 'ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY';
  
  -- Utworzenie polityk dla tabeli cms_content
  
  -- Polityka umożliwiająca odczyt wszystkim
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow public read" ON public.cms_content FOR SELECT USING (true)';
  
  -- Polityka umożliwiająca modyfikację tylko administratorom
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow admin insert" ON public.cms_content FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN (''admin'', ''moderator''))';
  
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow admin update" ON public.cms_content FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN (''admin'', ''moderator''))';
  
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow admin delete" ON public.cms_content FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN (''admin'', ''moderator''))';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
