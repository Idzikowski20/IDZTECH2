
import React, { useState, useEffect } from 'react';
import { Loader2, Move, X, Save, Eye, ArrowLeft, Settings, Layout, Image, Text, Video, Code, Columns, Box, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/utils/AuthProvider';

const VisualCMSEditor = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elements');
  const [elementEditing, setElementEditing] = useState<string | null>(null);
  const { user } = useAuth();

  // Symulacja ładowania
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Kategorie elementów
  const elementCategories = [
    { id: 'elements', name: 'Elementy', icon: <Layout size={16} /> },
    { id: 'blocks', name: 'Bloki', icon: <Box size={16} /> },
    { id: 'templates', name: 'Szablony', icon: <Columns size={16} /> },
  ];

  // Elementy
  const elements = {
    elements: [
      { id: 'heading', name: 'Nagłówek', icon: <Text size={20} /> },
      { id: 'paragraph', name: 'Paragraf', icon: <Text size={20} /> },
      { id: 'image', name: 'Obraz', icon: <Image size={20} /> },
      { id: 'video', name: 'Wideo', icon: <Video size={20} /> },
      { id: 'button', name: 'Przycisk', icon: <Button aria-label="button icon" size="sm" className="h-5 w-5 p-0" /> },
      { id: 'divider', name: 'Separator', icon: <Separator /> },
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

  const handleSave = () => {
    toast.success("Zmiany zostały zapisane");
  };

  const handlePreview = () => {
    toast.info("Podgląd strony w nowej karcie");
    window.open('/', '_blank');
  };

  const handleElementDrag = (id: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleElementEdit = (id: string) => {
    setElementEditing(id === elementEditing ? null : id);
    toast.info(`Edytowanie elementu: ${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-premium-dark">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mb-4 mx-auto text-premium-purple" />
          <p className="text-premium-light">Ładowanie edytora wizualnego...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-premium-dark">
      {/* Górny pasek narzędzi */}
      <div className="bg-premium-dark/90 border-b border-premium-light/10 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/admin/cms">
            <Button variant="ghost" size="icon" className="hover:bg-premium-dark/50">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Edytor Elementor</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePreview} className="flex items-center text-sm space-x-1 hover:bg-white hover:text-black">
            <Eye size={16} />
            <span>Podgląd</span>
          </Button>
          <Button onClick={handleSave} className="flex items-center text-sm space-x-1 bg-premium-gradient">
            <Save size={16} />
            <span>Zapisz zmiany</span>
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-white hover:text-black">
            <Settings size={20} />
          </Button>
        </div>
      </div>
      
      {/* Główny kontener */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel boczny */}
        <div className="w-72 bg-premium-dark border-r border-premium-light/10 flex flex-col">
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
          <div className="overflow-y-auto flex-1 p-2">
            <h2 className="text-sm font-medium mb-2 text-premium-light/80">{
              elementCategories.find(cat => cat.id === activeTab)?.name || 'Elementy'
            }</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {elements[activeTab as keyof typeof elements].map(element => (
                <div 
                  key={element.id}
                  draggable
                  onDragStart={handleElementDrag(element.id)}
                  onClick={() => handleElementEdit(element.id)}
                  className={`
                    p-2 bg-premium-dark/70 rounded-md border border-premium-light/10 
                    flex flex-col items-center justify-center gap-1 
                    hover:border-premium-purple cursor-grab
                    ${elementEditing === element.id ? 'border-premium-purple/80 ring-1 ring-premium-purple/30' : ''}
                  `}
                >
                  <div className="text-premium-light/80">{element.icon}</div>
                  <span className="text-xs">{element.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Informacje o użytkowniku */}
          <div className="p-3 border-t border-premium-light/10">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-premium-gradient flex items-center justify-center text-white">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">{user?.email?.split('@')[0] || 'Admin'}</div>
                <div className="text-xs text-premium-light/70">Administrator</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Przestrzeń robocza */}
        <div className="flex-1 overflow-auto relative bg-white p-6">
          <div className="max-w-5xl mx-auto min-h-full bg-white">
            {/* Pustego ekranu dla demonstracji */}
            <div className="w-full h-full flex flex-col items-center justify-center text-black/70 py-20">
              <div className="border-2 border-dashed border-gray-300 p-10 rounded-lg flex flex-col items-center justify-center w-full">
                <Plus size={32} className="mb-2 text-gray-400" />
                <p className="text-lg text-gray-500 font-medium">Przeciągnij elementy tutaj, aby rozpocząć</p>
                <p className="text-sm text-gray-400 mt-2">lub kliknij, aby dodać nowy element</p>
              </div>
              
              <div className="mt-10 p-6 bg-gray-100 rounded-lg w-full">
                <h2 className="text-xl font-bold text-gray-700">Przykładowy podgląd strony</h2>
                <p className="mt-2 text-gray-600">
                  To jest przykładowy podgląd strony. W rzeczywistym edytorze, będziesz mógł dodawać, 
                  przesuwać i edytować elementy, które zostaną natychmiast odzwierciedlone w podglądzie.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="default" className="bg-premium-purple hover:bg-premium-purple/90">
                    Przykładowy przycisk
                  </Button>
                  <Button variant="outline" className="border-premium-purple text-premium-purple hover:bg-white hover:text-black">
                    Więcej informacji
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Przyciski edycji elementów */}
          <div className="fixed bottom-6 right-6 flex items-center space-x-2">
            <Button variant="outline" className="shadow-lg hover:bg-white hover:text-black transition-colors">
              <Move size={20} className="mr-2" />
              Przesuwaj
            </Button>
            <Button className="shadow-lg bg-premium-gradient transition-colors">
              <Plus size={20} className="mr-2" />
              Dodaj element
            </Button>
          </div>
        </div>
        
        {/* Panel właściwości elementu (pojawia się, gdy element jest edytowany) */}
        {elementEditing && (
          <div className="w-72 bg-premium-dark border-l border-premium-light/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Właściwości elementu</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setElementEditing(null)}
                className="hover:bg-white hover:text-black transition-colors"
              >
                <X size={18} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-premium-light/70 block mb-1">Nazwa</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded-md bg-premium-dark border border-premium-light/20" 
                  value={elements[activeTab as keyof typeof elements].find(e => e.id === elementEditing)?.name} 
                  readOnly 
                />
              </div>
              
              <div>
                <label className="text-sm text-premium-light/70 block mb-1">ID</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded-md bg-premium-dark border border-premium-light/20" 
                  value={elementEditing} 
                  readOnly 
                />
              </div>
              
              <Separator />
              
              {/* Przykładowe właściwości (będą się różnić w zależności od typu elementu) */}
              <div>
                <label className="text-sm text-premium-light/70 block mb-1">Zawartość</label>
                <textarea 
                  className="w-full p-2 rounded-md bg-premium-dark border border-premium-light/20 h-24"
                  placeholder="Wprowadź tekst..."
                ></textarea>
              </div>
              
              <div>
                <label className="text-sm text-premium-light/70 block mb-1">Kolor</label>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 cursor-pointer hover:ring-2 hover:ring-white/50"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer hover:ring-2 hover:ring-white/50"></div>
                  <div className="w-6 h-6 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-white/50"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 cursor-pointer hover:ring-2 hover:ring-white/50"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500 cursor-pointer hover:ring-2 hover:ring-white/50"></div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-premium-light/70 block mb-1">Rozmiar</label>
                <select className="w-full p-2 rounded-md bg-premium-dark border border-premium-light/20">
                  <option>Mały</option>
                  <option>Średni</option>
                  <option>Duży</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualCMSEditor;
