
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/AuthProvider';
import { Loader2, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import { formatDate } from '@/utils/formatters';
import { getCMSPages, getCMSContent, updateCMSContent, CMSPage } from '@/utils/cms';

const VisualCMSEditor = () => {
  const { user, loading } = useAuth();
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [pageContent, setPageContent] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Sekcje, które mogą być edytowane na stronie
  const sections = [
    { id: 'hero', name: 'Sekcja główna', description: 'Główny banner strony' },
    { id: 'about', name: 'O nas', description: 'Informacje o firmie' },
    { id: 'services', name: 'Usługi', description: 'Lista oferowanych usług' },
    { id: 'features', name: 'Funkcje', description: 'Główne funkcje produktu/usługi' },
    { id: 'testimonials', name: 'Opinie', description: 'Opinie klientów' },
    { id: 'faq', name: 'FAQ', description: 'Najczęściej zadawane pytania' },
    { id: 'contact', name: 'Kontakt', description: 'Informacje kontaktowe' },
    { id: 'footer', name: 'Stopka', description: 'Treść stopki strony' }
  ];
  
  useEffect(() => {
    const loadPages = async () => {
      try {
        const pagesData = await getCMSPages();
        setPages(pagesData);
        
        if (pagesData.length > 0) {
          setSelectedPage(pagesData[0]);
          await loadPageContent(pagesData[0]);
        }
      } catch (error) {
        console.error('Error loading pages:', error);
        toast.error('Nie udało się załadować stron');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading && user) {
      loadPages();
    }
  }, [loading, user]);
  
  const loadPageContent = async (page: CMSPage) => {
    setIsLoading(true);
    const contentData: {[key: string]: string} = {};
    
    try {
      for (const section of sections) {
        const sectionContent = await getCMSContent(page.id, section.id);
        contentData[section.id] = sectionContent?.content || '';
      }
      
      setPageContent(contentData);
    } catch (error) {
      console.error('Error loading page content:', error);
      toast.error('Nie udało się załadować treści strony');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = async (page: CMSPage) => {
    setSelectedPage(page);
    await loadPageContent(page);
  };
  
  const handleContentChange = (sectionId: string, content: string) => {
    setPageContent(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };
  
  const handleSaveContent = async (sectionId: string) => {
    if (!selectedPage) return;
    
    setIsSaving(true);
    
    try {
      const success = await updateCMSContent({
        page_id: selectedPage.id,
        section_id: sectionId,
        content: pageContent[sectionId],
        content_type: 'html'
      });
      
      if (success) {
        toast.success(`Sekcja "${sections.find(s => s.id === sectionId)?.name}" została zapisana`);
      } else {
        toast.error('Nie udało się zapisać treści');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Wystąpił błąd podczas zapisywania treści');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveAll = async () => {
    if (!selectedPage) return;
    
    setIsSaving(true);
    
    try {
      let allSaved = true;
      
      for (const section of sections) {
        const success = await updateCMSContent({
          page_id: selectedPage.id,
          section_id: section.id,
          content: pageContent[section.id] || '',
          content_type: 'html'
        });
        
        if (!success) {
          allSaved = false;
          toast.error(`Nie udało się zapisać sekcji "${section.name}"`);
        }
      }
      
      if (allSaved) {
        toast.success('Wszystkie zmiany zostały zapisane pomyślnie');
      }
    } catch (error) {
      console.error('Error saving all content:', error);
      toast.error('Wystąpił błąd podczas zapisywania treści');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Ładowanie edytora...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-premium-dark">
      {/* Header */}
      <div className="border-b border-premium-light/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/admin/cms" className="flex items-center text-premium-light hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Powrót do panelu CMS</span>
            </Link>
            <h1 className="text-xl font-bold">Wizualny edytor treści</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center"
            >
              {previewMode ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Wyłącz podgląd
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Podgląd
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-premium-gradient"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Zapisz wszystko
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4">
        {/* Page selector */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Wybierz stronę do edycji:</h2>
          <div className="flex flex-wrap gap-2">
            {pages.map(page => (
              <Button
                key={page.id}
                variant={selectedPage?.id === page.id ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className="flex-grow md:flex-grow-0"
              >
                {page.title}
              </Button>
            ))}
          </div>
        </div>
        
        {selectedPage && (
          <div className="mb-6">
            <Card className="p-4 bg-premium-dark/50 border border-premium-light/10">
              <h2 className="text-lg font-medium">{selectedPage.title}</h2>
              <div className="text-sm text-premium-light/70 mt-1">
                <span>Ostatnia aktualizacja: {formatDate(selectedPage.updated_at)}</span>
              </div>
              <p className="mt-2 text-sm">{selectedPage.meta_description}</p>
            </Card>
          </div>
        )}
        
        {/* Main editor */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar with sections */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <h3 className="font-medium mb-3">Sekcje strony:</h3>
              <nav className="space-y-1">
                {sections.map(section => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className="block p-3 rounded-lg hover:bg-white hover:text-black bg-premium-dark/50 border border-premium-light/10 transition-colors mb-2"
                  >
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-premium-light/70">{section.description}</div>
                  </a>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Content editor */}
          <div className="lg:col-span-4">
            {sections.map(section => (
              <div 
                key={section.id} 
                id={`section-${section.id}`}
                className="mb-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium">{section.name}</h3>
                  <Button 
                    onClick={() => handleSaveContent(section.id)}
                    variant="outline" 
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz sekcję
                  </Button>
                </div>
                
                <Tabs defaultValue="edit">
                  <TabsList className="mb-2">
                    <TabsTrigger value="edit">Edycja</TabsTrigger>
                    <TabsTrigger value="preview">Podgląd</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="border rounded-md p-2 min-h-[200px]">
                    <RichTextEditor 
                      value={pageContent[section.id] || ''} 
                      onChange={(value) => handleContentChange(section.id, value)} 
                      placeholder={`Wprowadź zawartość sekcji "${section.name}"...`}
                      rows={15}
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="border rounded-md p-4 min-h-[200px] bg-white text-black">
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: pageContent[section.id] || '' }}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualCMSEditor;
