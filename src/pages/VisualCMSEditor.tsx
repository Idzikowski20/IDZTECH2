
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, Move, X, Save, Eye, ArrowLeft, Settings, Layout, 
  Image as ImageIcon, Text, Video, Code, Columns, Box, Plus, 
  Type, AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Heading,
  Check, Globe, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/utils/AuthProvider';
import { useTheme } from '@/utils/themeContext';
import { 
  getCMSPages, 
  updateCMSContent, 
  getCMSPageBySlug, 
  getAllCMSContentForPage, 
  createOrUpdateCMSPage,
  initializeDefaultPages,
  CMSPage,
  CMSContent
} from '@/utils/cms';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface CMSBlock {
  id: string;
  type: string;
  content: string;
  settings: Record<string, any>;
  section_id: string;
}

interface EditingElement {
  id: string;
  type: string;
  content: string;
  settings: Record<string, any>;
  section_id: string;
}

const VisualCMSEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elements');
  const [elementEditing, setElementEditing] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<CMSBlock[]>([]);
  const [editingElement, setEditingElement] = useState<EditingElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Load pages and initialize default pages if needed
  useEffect(() => {
    const loadPagesAndContent = async () => {
      setLoading(true);
      
      // Initialize default pages if needed
      await initializeDefaultPages();
      
      // Get all pages
      const pagesData = await getCMSPages();
      setPages(pagesData);
      
      // Get homepage or first available page
      let homePage = pagesData.find(p => p.slug === 'home');
      if (!homePage && pagesData.length > 0) {
        homePage = pagesData[0];
      }
      
      if (homePage) {
        setSelectedPage(homePage);
        await loadPageContent(homePage.id);
      }
      
      setLoading(false);
    };
    
    loadPagesAndContent();
  }, []);
  
  // Load content for a specific page
  const loadPageContent = async (pageId: string) => {
    setLoading(true);
    
    try {
      const contents = await getAllCMSContentForPage(pageId);
      
      // Map contents to blocks
      const blocks: CMSBlock[] = contents.map(content => ({
        id: content.id,
        type: content.content_type === 'html' ? 'html' : 
              content.section_id.includes('heading') ? 'heading' : 
              content.section_id.includes('button') ? 'button' : 'paragraph',
        content: content.content,
        section_id: content.section_id,
        settings: getDefaultSettingsFromContent(content)
      }));
      
      // If page has no content, add some default elements
      if (blocks.length === 0) {
        const defaultBlocks: CMSBlock[] = [
          {
            id: `heading-${Date.now()}`,
            type: 'heading',
            content: 'Edytuj tę stronę',
            section_id: `heading-${Date.now()}`,
            settings: { level: 'h1', align: 'center', fontSize: '42px' }
          },
          {
            id: `paragraph-${Date.now() + 1}`,
            type: 'paragraph',
            content: 'To jest przykładowy tekst, który można edytować w naszym wizualnym edytorze CMS podobnym do Elementora.',
            section_id: `paragraph-${Date.now() + 1}`,
            settings: { align: 'center', fontSize: '16px' }
          }
        ];
        
        setPageContent(defaultBlocks);
      } else {
        setPageContent(blocks);
      }
    } catch (error) {
      console.error('Error loading page content:', error);
      toast.error('Nie udało się załadować zawartości strony');
    }
    
    setLoading(false);
  };
  
  // Extract settings from content
  const getDefaultSettingsFromContent = (content: CMSContent): Record<string, any> => {
    // Try to parse settings from content if in JSON format
    try {
      if (content.content.includes('"settings":')) {
        const parsed = JSON.parse(content.content);
        if (parsed.settings) {
          return parsed.settings;
        }
      }
    } catch (e) {
      // If can't parse, use default settings
    }
    
    // Default settings based on section type
    if (content.section_id.includes('heading')) {
      return { level: 'h2', align: 'left', fontSize: '32px' };
    } else if (content.section_id.includes('button')) {
      return { size: 'medium', variant: 'default', align: 'left' };
    } else {
      return { align: 'left', fontSize: '16px' };
    }
  };

  // Kategorie elementów
  const elementCategories = [
    { id: 'elements', name: 'Elementy', icon: <Layout size={16} /> },
    { id: 'blocks', name: 'Bloki', icon: <Box size={16} /> },
    { id: 'templates', name: 'Szablony', icon: <Columns size={16} /> },
  ];

  // Elementy
  const elements = {
    elements: [
      { id: 'heading', name: 'Nagłówek', icon: <Heading size={20} /> },
      { id: 'paragraph', name: 'Paragraf', icon: <Text size={20} /> },
      { id: 'image', name: 'Obraz', icon: <ImageIcon size={20} /> },
      { id: 'video', name: 'Wideo', icon: <Video size={20} /> },
      { id: 'button', name: 'Przycisk', icon: <Button aria-label="button icon" size="sm" className="h-5 w-5 p-0" /> },
      { id: 'divider', name: 'Separator', icon: <Separator className="bg-current" /> },
      { id: 'html', name: 'HTML', icon: <Code size={20} /> },
    ],
    blocks: [
      { id: 'hero', name: 'Hero', icon: <Layout size={20} /> },
      { id: 'features', name: 'Funkcje', icon: <Layout size={20} /> },
      { id: 'testimonials', name: 'Opinie', icon: <Layout size={20} /> },
      { id: 'pricing', name: 'Cennik', icon: <Layout size={20} /> },
      { id: 'cta', name: 'Call to Action', icon: <Layout size={20} /> },
      { id: 'faq', name: 'FAQ', icon: <Layout size={20} /> },
      { id: 'team', name: 'Zespół', icon: <Layout size={20} /> },
    ],
    templates: [
      { id: 'landing', name: 'Landing Page', icon: <Layout size={20} /> },
      { id: 'about', name: 'O nas', icon: <Layout size={20} /> },
      { id: 'contact', name: 'Kontakt', icon: <Layout size={20} /> },
      { id: 'services', name: 'Usługi', icon: <Layout size={20} /> },
      { id: 'blog', name: 'Blog', icon: <Layout size={20} /> },
    ],
  };

  const handlePageChange = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setSelectedPage(page);
      await loadPageContent(page.id);
    }
  };

  const handleSave = async () => {
    if (!selectedPage) {
      toast.error("Nie wybrano strony do edycji");
      return;
    }
    
    setSaving(true);
    let success = true;
    
    try {
      // Save all blocks one by one
      for (const block of pageContent) {
        // Format content - for some blocks we might want to save settings along with content
        let blockContent = block.content;
        
        // For some blocks we might want to save the settings along with content
        if (['heading', 'button', 'image'].includes(block.type)) {
          const contentWithSettings = {
            content: block.content,
            settings: block.settings
          };
          blockContent = JSON.stringify(contentWithSettings);
        }
        
        const result = await updateCMSContent({
          page_id: selectedPage.id,
          section_id: block.section_id,
          content: blockContent,
          content_type: block.type === 'html' ? 'html' : 'text'
        });
        
        if (!result) {
          success = false;
        }
      }
      
      if (success) {
        toast.success("Zmiany zostały zapisane");
      } else {
        toast.error("Wystąpił błąd podczas zapisywania niektórych elementów");
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Wystąpił błąd podczas zapisywania");
      success = false;
    }
    
    setSaving(false);
    return success;
  };

  const handlePreview = () => {
    if (!selectedPage) return;
    
    toast.info("Podgląd strony w nowej karcie");
    // Map slug to correct route
    const routeMap: Record<string, string> = {
      'home': '/',
      'about': '/o-nas',
      'contact': '/kontakt',
      // Add more mappings as needed
    };
    
    const route = routeMap[selectedPage.slug] || `/${selectedPage.slug}`;
    window.open(route, '_blank');
  };

  const handleElementDrag = (id: string, type: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.setData('element-type', type);
    setIsDragging(true);
    setDraggedElement(id);
  };

  const handleElementEdit = (id: string) => {
    const element = pageContent.find(item => item.id === id);
    if (element) {
      setEditingElement(element);
      setElementEditing(id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!selectedPage) {
      toast.error("Najpierw wybierz stronę do edycji");
      return;
    }
    
    const id = e.dataTransfer.getData('text/plain');
    const type = e.dataTransfer.getData('element-type');
    
    // If element already exists in pageContent, don't add it again
    if (pageContent.some(item => item.id === id)) {
      return;
    }
    
    const section_id = `${type}-${Date.now()}`;
    const newElement: CMSBlock = {
      id: section_id,
      type: type,
      content: getDefaultContent(type),
      settings: getDefaultSettings(type),
      section_id: section_id
    };
    
    setPageContent([...pageContent, newElement]);
    toast.success(`Dodano element: ${getElementName(type)}`);
  };
  
  const getElementName = (type: string): string => {
    for (const category in elements) {
      const found = elements[category as keyof typeof elements].find(el => el.id === type);
      if (found) return found.name;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const getDefaultContent = (type: string): string => {
    switch(type) {
      case 'heading':
        return 'Nowy nagłówek';
      case 'paragraph':
        return 'Nowy paragraf tekstu. Kliknij, aby edytować.';
      case 'button':
        return 'Przycisk';
      case 'html':
        return '<div>Edytuj kod HTML</div>';
      default:
        return '';
    }
  };
  
  const getDefaultSettings = (type: string): Record<string, any> => {
    switch(type) {
      case 'heading':
        return { level: 'h2', align: 'left', fontSize: '32px' };
      case 'paragraph':
        return { align: 'left', fontSize: '16px' };
      case 'button':
        return { size: 'medium', variant: 'default', align: 'left' };
      default:
        return {};
    }
  };
  
  const updateElementContent = (id: string, content: string) => {
    setPageContent(pageContent.map(element => 
      element.id === id ? { ...element, content } : element
    ));
  };
  
  const updateElementSetting = (id: string, settingKey: string, value: any) => {
    setPageContent(pageContent.map(element => 
      element.id === id ? { 
        ...element, 
        settings: { ...element.settings, [settingKey]: value }
      } : element
    ));
  };
  
  const deleteElement = (id: string) => {
    setPageContent(pageContent.filter(element => element.id !== id));
    if (elementEditing === id) {
      setElementEditing(null);
      setEditingElement(null);
    }
    toast.info('Element został usunięty');
  };
  
  const renderEditableContent = (block: CMSBlock) => {
    switch(block.type) {
      case 'heading':
        return (
          <div 
            className={`group cursor-pointer p-2 hover:outline-dashed hover:outline-1 hover:outline-premium-purple/50 ${block.id === elementEditing ? 'outline-dashed outline-1 outline-premium-purple' : ''} mb-4`}
            onClick={() => handleElementEdit(block.id)}
          >
            {block.settings.level === 'h1' ? (
              <h1 
                className={`text-4xl font-bold text-${block.settings.align}`}
                style={{ fontSize: block.settings.fontSize }}
              >
                {block.content}
              </h1>
            ) : block.settings.level === 'h2' ? (
              <h2 
                className={`text-3xl font-bold text-${block.settings.align}`}
                style={{ fontSize: block.settings.fontSize }}
              >
                {block.content}
              </h2>
            ) : (
              <h3 
                className={`text-2xl font-bold text-${block.settings.align}`}
                style={{ fontSize: block.settings.fontSize }}
              >
                {block.content}
              </h3>
            )}
            <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-0 bg-premium-dark/70 rounded-bl-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-premium-purple/20"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(block.id);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        );
      case 'paragraph':
        return (
          <div 
            className={`group cursor-pointer p-2 hover:outline-dashed hover:outline-1 hover:outline-premium-purple/50 ${block.id === elementEditing ? 'outline-dashed outline-1 outline-premium-purple' : ''} mb-4 relative`}
            onClick={() => handleElementEdit(block.id)}
          >
            <p 
              className={`text-${block.settings.align}`}
              style={{ fontSize: block.settings.fontSize }}
            >
              {block.content}
            </p>
            <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-0 bg-premium-dark/70 rounded-bl-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-premium-purple/20"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(block.id);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        );
      case 'button':
        return (
          <div 
            className={`group cursor-pointer p-2 hover:outline-dashed hover:outline-1 hover:outline-premium-purple/50 ${block.id === elementEditing ? 'outline-dashed outline-1 outline-premium-purple' : ''} mb-4 relative`}
            onClick={() => handleElementEdit(block.id)}
          >
            <div className={`text-${block.settings.align}`}>
              <Button variant={block.settings.variant || "default"} size={block.settings.size}>
                {block.content}
              </Button>
            </div>
            <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-0 bg-premium-dark/70 rounded-bl-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-premium-purple/20"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(block.id);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        );
      case 'divider':
        return (
          <div 
            className={`group cursor-pointer p-2 hover:outline-dashed hover:outline-1 hover:outline-premium-purple/50 ${block.id === elementEditing ? 'outline-dashed outline-1 outline-premium-purple' : ''} mb-4 relative`}
            onClick={() => handleElementEdit(block.id)}
          >
            <Separator className="my-4" />
            <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-0 bg-premium-dark/70 rounded-bl-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-premium-purple/20"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(block.id);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        );
      case 'html':
        return (
          <div 
            className={`group cursor-pointer p-2 hover:outline-dashed hover:outline-1 hover:outline-premium-purple/50 ${block.id === elementEditing ? 'outline-dashed outline-1 outline-premium-purple' : ''} mb-4 relative bg-slate-100 dark:bg-premium-dark/30 rounded`}
            onClick={() => handleElementEdit(block.id)}
          >
            <div className="text-xs font-mono p-2 overflow-auto max-h-32">
              {block.content}
            </div>
            <div className="opacity-0 group-hover:opacity-100 absolute right-0 top-0 bg-premium-dark/70 rounded-bl-md p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-premium-purple/20"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteElement(block.id);
                }}
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-2 border border-dashed border-gray-300 rounded mb-4">
            Nieobsługiwany element typu: {block.type}
          </div>
        );
    }
  };

  const renderPropertyEditor = () => {
    if (!editingElement) return null;
    
    const commonSettings = (
      <>
        <div className="mb-4">
          <label className="text-sm text-premium-light/70 block mb-1">Zawartość</label>
          <Input
            value={editingElement.content}
            onChange={(e) => {
              setEditingElement({...editingElement, content: e.target.value});
              updateElementContent(editingElement.id, e.target.value);
            }}
            className={`w-full p-2 rounded-md ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark border-premium-light/20'}`}
          />
        </div>
        
        <div className="mb-4">
          <label className="text-sm text-premium-light/70 block mb-1">Wyrównanie</label>
          <div className="flex space-x-2">
            <Button 
              variant={editingElement.settings.align === 'left' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => {
                setEditingElement({...editingElement, settings: {...editingElement.settings, align: 'left'}});
                updateElementSetting(editingElement.id, 'align', 'left');
              }}
              className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
            >
              <AlignLeft size={16} />
            </Button>
            <Button 
              variant={editingElement.settings.align === 'center' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => {
                setEditingElement({...editingElement, settings: {...editingElement.settings, align: 'center'}});
                updateElementSetting(editingElement.id, 'align', 'center');
              }}
              className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
            >
              <AlignCenter size={16} />
            </Button>
            <Button 
              variant={editingElement.settings.align === 'right' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => {
                setEditingElement({...editingElement, settings: {...editingElement.settings, align: 'right'}});
                updateElementSetting(editingElement.id, 'align', 'right');
              }}
              className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
            >
              <AlignRight size={16} />
            </Button>
          </div>
        </div>
      </>
    );
    
    switch(editingElement.type) {
      case 'heading':
        return (
          <>
            {commonSettings}
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Poziom nagłówka</label>
              <div className="flex space-x-2">
                <Button 
                  variant={editingElement.settings.level === 'h1' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, level: 'h1'}});
                    updateElementSetting(editingElement.id, 'level', 'h1');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  H1
                </Button>
                <Button 
                  variant={editingElement.settings.level === 'h2' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, level: 'h2'}});
                    updateElementSetting(editingElement.id, 'level', 'h2');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  H2
                </Button>
                <Button 
                  variant={editingElement.settings.level === 'h3' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, level: 'h3'}});
                    updateElementSetting(editingElement.id, 'level', 'h3');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  H3
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Rozmiar czcionki</label>
              <Input
                type="text" 
                value={editingElement.settings.fontSize} 
                onChange={(e) => {
                  setEditingElement({...editingElement, settings: {...editingElement.settings, fontSize: e.target.value}});
                  updateElementSetting(editingElement.id, 'fontSize', e.target.value);
                }}
                className={`w-full p-2 rounded-md ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark border-premium-light/20'}`}
              />
            </div>
          </>
        );
      case 'paragraph':
        return (
          <>
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Zawartość</label>
              <textarea
                value={editingElement.content}
                onChange={(e) => {
                  setEditingElement({...editingElement, content: e.target.value});
                  updateElementContent(editingElement.id, e.target.value);
                }}
                className={`w-full p-2 rounded-md h-32 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark border-premium-light/20'}`}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Wyrównanie</label>
              <div className="flex space-x-2">
                <Button 
                  variant={editingElement.settings.align === 'left' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, align: 'left'}});
                    updateElementSetting(editingElement.id, 'align', 'left');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  <AlignLeft size={16} />
                </Button>
                <Button 
                  variant={editingElement.settings.align === 'center' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, align: 'center'}});
                    updateElementSetting(editingElement.id, 'align', 'center');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  <AlignCenter size={16} />
                </Button>
                <Button 
                  variant={editingElement.settings.align === 'right' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, align: 'right'}});
                    updateElementSetting(editingElement.id, 'align', 'right');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  <AlignRight size={16} />
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Rozmiar czcionki</label>
              <Input
                type="text" 
                value={editingElement.settings.fontSize} 
                onChange={(e) => {
                  setEditingElement({...editingElement, settings: {...editingElement.settings, fontSize: e.target.value}});
                  updateElementSetting(editingElement.id, 'fontSize', e.target.value);
                }}
                className={`w-full p-2 rounded-md ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark border-premium-light/20'}`}
              />
            </div>
          </>
        );
      case 'button':
        return (
          <>
            {commonSettings}
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Wariant</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={editingElement.settings.variant === 'default' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, variant: 'default'}});
                    updateElementSetting(editingElement.id, 'variant', 'default');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  Domyślny
                </Button>
                <Button 
                  variant={editingElement.settings.variant === 'outline' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, variant: 'outline'}});
                    updateElementSetting(editingElement.id, 'variant', 'outline');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  Outline
                </Button>
                <Button 
                  variant={editingElement.settings.variant === 'secondary' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, variant: 'secondary'}});
                    updateElementSetting(editingElement.id, 'variant', 'secondary');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  Secondary
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-premium-light/70 block mb-1">Rozmiar</label>
              <div className="flex gap-2">
                <Button 
                  variant={editingElement.settings.size === 'sm' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, size: 'sm'}});
                    updateElementSetting(editingElement.id, 'size', 'sm');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  Mały
                </Button>
                <Button 
                  variant={editingElement.settings.size === 'default' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, size: 'default'}});
                    updateElementSetting(editingElement.id, 'size', 'default');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  Średni
                </Button>
                <Button 
                  variant={editingElement.settings.size === 'lg' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setEditingElement({...editingElement, settings: {...editingElement.settings, size: 'lg'}});
                    updateElementSetting(editingElement.id, 'size', 'lg');
                  }}
                  className={theme === 'light' ? 'hover:bg-gray-100 hover:text-black' : 'hover:bg-white hover:text-black'}
                >
                  Duży
                </Button>
              </div>
            </div>
          </>
        );
      case 'html':
        return (
          <div className="mb-4">
            <label className="text-sm text-premium-light/70 block mb-1">Kod HTML</label>
            <textarea
              value={editingElement.content}
              onChange={(e) => {
                setEditingElement({...editingElement, content: e.target.value});
                updateElementContent(editingElement.id, e.target.value);
              }}
              className={`w-full p-2 rounded-md h-64 font-mono text-sm ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-premium-dark border-premium-light/20'}`}
            />
          </div>
        );
      default:
        return (
          <div className="text-premium-light/70">
            Brak dostępnych właściwości dla tego elementu.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
        <div className="text-center">
          <Loader2 className={`h-10 w-10 animate-spin mb-4 mx-auto ${theme === 'light' ? 'text-premium-purple' : 'text-premium-purple'}`} />
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light'}`}>Ładowanie edytora wizualnego...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'light' ? 'bg-white' : 'bg-premium-dark'}`}>
      {/* Górny pasek narzędzi */}
      <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-premium-dark/90 border-premium-light/10'} border-b p-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <Link to="/admin/cms">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-premium-dark/50'}`}
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Edytor Wizualny</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select 
            value={selectedPage?.id || ""} 
            onValueChange={handlePageChange}
          >
            <SelectTrigger className={`w-[200px] ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/80'}`}>
              <SelectValue placeholder="Wybierz stronę" />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                  {page.slug === 'home' && <Home className="inline-block ml-2 h-3 w-3" />}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handlePreview} 
            className={`flex items-center text-sm space-x-1 ${
              theme === 'light' 
                ? 'hover:bg-gray-100 hover:text-black' 
                : 'hover:bg-white hover:text-black'
            }`}
          >
            <Eye size={16} />
            <span>Podgląd</span>
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center text-sm space-x-1 bg-premium-gradient"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                <span>Zapisywanie...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Zapisz zmiany</span>
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={`${
              theme === 'light' 
                ? 'hover:bg-gray-100 hover:text-black' 
                : 'hover:bg-white hover:text-black'
            }`}
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>
      
      {/* Główny kontener */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel boczny */}
        <div className={`w-72 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-premium-dark border-premium-light/10'} border-r flex flex-col`}>
          {/* Zakładki boczne */}
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              {elementCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="flex items-center justify-center gap-1"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Lista elementów */}
          <div className={`overflow-y-auto flex-1 p-2 ${theme === 'light' ? 'bg-gray-50' : ''}`}>
            <h2 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-premium-light/80'}`}>{
              elementCategories.find(cat => cat.id === activeTab)?.name || 'Elementy'
            }</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {elements[activeTab as keyof typeof elements].map(element => (
                <div 
                  key={element.id}
                  draggable
                  onDragStart={handleElementDrag(element.id, element.id)}
                  onClick={() => {
                    if (!selectedPage) {
                      toast.error("Najpierw wybierz stronę do edycji");
                      return;
                    }
                    
                    const section_id = `${element.id}-${Date.now()}`;
                    const newElement: CMSBlock = {
                      id: section_id,
                      type: element.id,
                      content: getDefaultContent(element.id),
                      settings: getDefaultSettings(element.id),
                      section_id: section_id
                    };
                    
                    setPageContent([...pageContent, newElement]);
                    toast.success(`Dodano element: ${element.name}`);
                  }}
                  className={`
                    p-2 ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-premium-dark/70'} rounded-md 
                    border ${theme === 'light' ? 'border-gray-200' : 'border-premium-light/10'}
                    flex flex-col items-center justify-center gap-1 
                    hover:border-premium-purple cursor-grab
                  `}
                >
                  <div className={`${theme === 'light' ? 'text-gray-700' : 'text-premium-light/80'}`}>
                    {element.icon}
                  </div>
                  <span className="text-xs">{element.name}</span>
                </div>
              ))}
            </div>
            
            {/* Page information */}
            {selectedPage && (
              <Card className={`mt-4 ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/60'}`}>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1">Informacje o stronie</h3>
                  <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-premium-light/70'}`}>
                    <p>Tytuł: {selectedPage.title}</p>
                    <p>URL: /{selectedPage.slug}</p>
                    <p>Status: {selectedPage.status === 'published' ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <Check size={12} /> Opublikowana
                      </span>
                    ) : 'Szkic'}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Informacje o użytkowniku */}
          <div className={`p-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-premium-light/10'}`}>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-premium-gradient flex items-center justify-center text-white">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">{user?.email?.split('@')[0] || 'Admin'}</div>
                <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-premium-light/70'}`}>Administrator</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Przestrzeń robocza */}
        <div 
          className={`flex-1 overflow-auto relative ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-900'} p-6`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className={`max-w-5xl mx-auto min-h-full ${theme === 'light' ? 'bg-white' : 'bg-premium-dark/30'} p-8 shadow-lg rounded-lg`}>
            {pageContent.length > 0 ? (
              // Renderowanie zawartości strony
              <div className="space-y-2">
                {pageContent.map(block => renderEditableContent(block))}
              </div>
            ) : (
              // Pustego ekranu dla demonstracji
              <div className="w-full h-full flex flex-col items-center justify-center py-20">
                <div className={`border-2 border-dashed ${theme === 'light' ? 'border-gray-300' : 'border-premium-light/20'} p-10 rounded-lg flex flex-col items-center justify-center w-full`}>
                  <Plus size={32} className={`mb-2 ${theme === 'light' ? 'text-gray-400' : 'text-premium-light/50'}`} />
                  <p className={`text-lg ${theme === 'light' ? 'text-gray-500' : 'text-premium-light/80'} font-medium`}>Przeciągnij elementy tutaj, aby rozpocząć</p>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-400' : 'text-premium-light/50'} mt-2`}>lub kliknij, aby dodać nowy element</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Przyciski edycji elementów */}
          <div className="fixed bottom-6 right-6 flex items-center space-x-2">
            <Button 
              variant="outline" 
              className={`shadow-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white hover:text-black'} transition-colors`}
            >
              <Move size={20} className="mr-2" />
              Przesuwaj
            </Button>
            <Button 
              className="shadow-lg bg-premium-gradient transition-colors"
              onClick={() => {
                if (!selectedPage) {
                  toast.error("Najpierw wybierz stronę do edycji");
                  return;
                }
                
                const newElement = {
                  id: `paragraph-${Date.now()}`,
                  type: 'paragraph',
                  content: 'Nowy paragraf tekstu. Kliknij, aby edytować.',
                  section_id: `paragraph-${Date.now()}`,
                  settings: { align: 'left', fontSize: '16px' }
                };
                setPageContent([...pageContent, newElement]);
                toast.success("Dodano nowy element");
              }}
            >
              <Plus size={20} className="mr-2" />
              Dodaj element
            </Button>
          </div>
        </div>
        
        {/* Panel właściwości elementu (pojawia się, gdy element jest edytowany) */}
        {elementEditing && (
          <div className={`w-72 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-premium-dark border-premium-light/10'} border-l p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Właściwości elementu</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setElementEditing(null);
                  setEditingElement(null);
                }}
                className={`${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-white hover:text-black'} transition-colors`}
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="space-y-4">
              {editingElement && renderPropertyEditor()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualCMSEditor;
