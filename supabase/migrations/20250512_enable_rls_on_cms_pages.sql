
-- Funkcja włączająca RLS na tabeli cms_pages
CREATE OR REPLACE FUNCTION public.enable_rls_on_cms_pages()
RETURNS void AS $$
BEGIN
  -- Włączenie RLS na tabeli cms_pages
  EXECUTE 'ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY';
  
  -- Utworzenie polityk dla tabeli cms_pages
  
  -- Polityka umożliwiająca odczyt wszystkim
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow public read" ON public.cms_pages FOR SELECT USING (true)';
  
  -- Polityka umożliwiająca modyfikację tylko administratorom
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow admin insert" ON public.cms_pages FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN (''admin'', ''moderator''))';
  
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow admin update" ON public.cms_pages FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN (''admin'', ''moderator''))';
  
  EXECUTE 'CREATE POLICY IF NOT EXISTS "Allow admin delete" ON public.cms_pages FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN (''admin'', ''moderator''))';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
