
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  getCMSPages, 
  updateCMSContent, 
  isUserAdmin, 
  CMSPage, 
  CMSContent, 
  getCMSContent, 
  enableRLSOnCMSTables 
} from '@/utils/cms';
import { toast } from 'sonner';
import { Loader2, Save, Eye, Edit, FileText, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

const CMSPanel: React.FC = () => {
  const { session } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'text' | 'html'>('html');
  const [enablingRLS, setEnablingRLS] = useState(false);
  
  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'about', name: 'About Section' },
    { id: 'services', name: 'Services Section' },
    { id: 'features', name: 'Features Section' },
    { id: 'testimonials', name: 'Testimonials' },
    { id: 'faq', name: 'FAQ Section' },
    { id: 'contact', name: 'Contact Section' },
    { id: 'footer', name: 'Footer' },
  ];
  
  useEffect(() => {
    const checkUserAndLoadData = async () => {
      if (session?.user) {
        const adminStatus = await isUserAdmin(session.user.id);
        setIsAdmin(adminStatus);
        
        if (adminStatus) {
          const pagesData = await getCMSPages();
          setPages(pagesData);
          
          if (pagesData.length > 0) {
            setSelectedPage(pagesData[0]);
            loadSectionContent(pagesData[0].id, 'hero');
          }
        }
      }
      
      setLoading(false);
    };
    
    checkUserAndLoadData();
  }, [session?.user]);
  
  const loadSectionContent = async (pageId: string, sectionId: string) => {
    const contentData = await getCMSContent(pageId, sectionId);
    if (contentData) {
      setContent(contentData.content);
      setContentType(contentData.content_type as 'text' | 'html');
    } else {
      setContent('');
      setContentType('html');
    }
    
    setSelectedSection(sectionId);
  };
  
  const handlePageChange = (page: CMSPage) => {
    setSelectedPage(page);
    loadSectionContent(page.id, selectedSection);
  };
  
  const handleSectionChange = (sectionId: string) => {
    if (selectedPage) {
      loadSectionContent(selectedPage.id, sectionId);
    }
  };
  
  const handleSaveContent = async () => {
    if (!selectedPage || !selectedSection) return;
    
    setSaving(true);
    
    const success = await updateCMSContent({
      page_id: selectedPage.id,
      section_id: selectedSection,
      content,
      content_type: contentType
    });
    
    setSaving(false);
    
    if (success) {
      toast.success('Content saved successfully');
    } else {
      toast.error('Failed to save content');
    }
  };
  
  const handleEnableRLS = async () => {
    setEnablingRLS(true);
    
    try {
      const result = await enableRLSOnCMSTables();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(`Błąd: ${error.message}`);
    } finally {
      setEnablingRLS(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading CMS panel...</span>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <Card className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>You don't have permission to access the CMS panel. Please contact an administrator.</p>
      </Card>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IDZ.TECH CMS Panel</h1>
        
        <Button 
          onClick={handleEnableRLS} 
          disabled={enablingRLS}
          className="bg-premium-gradient"
        >
          {enablingRLS ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Włączanie zabezpieczeń...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Włącz zabezpieczenia RLS
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className={`p-4 ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/60'}`}>
            <h2 className="text-lg font-medium mb-3">Pages</h2>
            <div className="space-y-1">
              {pages.map(page => (
                <Button
                  key={page.id}
                  variant={selectedPage?.id === page.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handlePageChange(page)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {page.title}
                </Button>
              ))}
            </div>
          </Card>
          
          <Card className={`p-4 mt-4 ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/60'}`}>
            <h2 className="text-lg font-medium mb-3">Sections</h2>
            <div className="space-y-1">
              {sections.map(section => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleSectionChange(section.id)}
                >
                  {section.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className={`p-4 ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/60'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Editing: {selectedPage?.title} - {sections.find(s => s.id === selectedSection)?.name}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleSaveContent} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="visual" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="visual">Visual Editor</TabsTrigger>
                <TabsTrigger value="html">HTML Editor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visual">
                <div className="border rounded-md p-2 min-h-[400px]">
                  {/* This would be a rich text editor in a full implementation */}
                  <Textarea
                    placeholder="Enter content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[400px]"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="html">
                <div className="border rounded-md p-2 min-h-[400px] bg-slate-50 dark:bg-slate-900">
                  <Textarea
                    placeholder="Enter HTML content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-[400px] font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CMSPanel;
