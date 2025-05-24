import React, { useState, useRef } from 'react';
import { useAuth } from '@/utils/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Upload, Image as ImageIcon, Sparkles, X, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/config';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import AdminLayout from '@/components/AdminLayout';
import { useTheme } from '@/utils/themeContext';
import AIPostEditor from '@/components/AIPostEditor';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ż/g, 'z')
    .replace(/ź/g, 'z')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function aiPostToHtml(aiPost: any) {
  return (
    `<h1>${aiPost.title || ''}</h1><p>${aiPost.lead || ''}</p>` +
    (Array.isArray(aiPost.sections) ? aiPost.sections.map((s: any) => `<h2>${s.heading}</h2><p>${s.content}</p>`).join('') : '')
  );
}

const postLengths = {
  short: { name: 'Krótki', words: '300-500 słów' },
  medium: { name: 'Średni', words: '500-900 słów' },
  long: { name: 'Długi', words: '900-1500 słów' }
};

const postStyles = [
  { id: 'expert', name: 'Ekspercki', description: 'Profesjonalny ton z technicznym podejściem' },
  { id: 'casual', name: 'Przyjazny', description: 'Luźny i konwersacyjny styl' },
  { id: 'formal', name: 'Formalny', description: 'Oficjalny i biznesowy ton' },
  { id: 'creative', name: 'Kreatywny', description: 'Artystyczne i ekspresyjne podejście' }
];

const postPresentations = [
  { id: 'instruction', name: 'Instruktaż', description: 'Krok po kroku, praktyczny przewodnik' },
  { id: 'explanation', name: 'Wyjaśnienie', description: 'Dogłębne tłumaczenie zagadnienia' },
  { id: 'guide', name: 'Poradnik', description: 'Praktyczne wskazówki i porady' },
  { id: 'case', name: 'Case study', description: 'Opis przypadku, analiza sytuacji' },
  { id: 'overview', name: 'Przegląd', description: 'Podsumowanie, przegląd tematu' },
  { id: 'review', name: 'Recenzja', description: 'Ocena produktu, usługi lub zjawiska' },
];

export default function AIPostPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // Stan dla kroków
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [topic, setTopic] = useState('');
  const [postLength, setPostLength] = useState(0); // zmiana wartości początkowej na 0
  const [selectedStyle, setSelectedStyle] = useState('expert');
  const [selectedPresentation, setSelectedPresentation] = useState('instruction');
  
  // Pozostałe stany
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState('polski');
  const [cta, setCta] = useState(true);
  const [meta, setMeta] = useState(true);
  const [questions, setQuestions] = useState(true);
  const [summary, setSummary] = useState(true);
  const [links, setLinks] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedPost, setEditedPost] = useState('');
  const [aiPost, setAiPost] = useState<any>(null);
  const [accepted, setAccepted] = useState(false);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');
  const [showMissingThumbnailModal, setShowMissingThumbnailModal] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const [postStatus, setPostStatus] = useState<'published' | 'draft'>('published');
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitAction, setExitAction] = useState<'back' | 'cancel' | 'panel' | 'home' | null>(null);
  const [exitTarget, setExitTarget] = useState<'back' | 'cancel' | 'panel' | 'home' | null>(null);
  const [aiEditorStep, setAiEditorStep] = useState(false);
  const [aiEditorInitialData, setAiEditorInitialData] = useState<any>(null);

  React.useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  // Funkcje pomocnicze
  const getPostLengthFromSlider = (value: number) => {
    if (value < 33) return 'short';
    if (value < 66) return 'medium';
    return 'long';
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setThumbnail(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setThumbnail(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      if (!selectedStyle || !selectedPresentation) {
        toast.error('Wybierz styl i sposób przedstawienia artykułu!');
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleGenerate();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGeneratingModalOpen(true);
    setLoadingAI(true);
    setShowConfetti(false);
    setAiPost(null);
    const lengthType = getPostLengthFromSlider(postLength);
    if (!selectedStyle || !selectedPresentation) {
      toast.error('Wybierz styl i sposób przedstawienia artykułu!');
      setCurrentStep(3);
      setLoadingAI(false);
      setIsGeneratingModalOpen(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/generate-blog-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          keywords, 
          style: selectedStyle, 
          presentation: selectedPresentation,
          length: lengthType, 
          audience, 
          cta, 
          meta, 
          questions, 
          summary, 
          links, 
          language 
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Błąd generowania posta przez AI');
        setLoadingAI(false);
        setIsGeneratingModalOpen(false);
        return;
      }
      const data = await res.json();
      setAiPost(data);
      setLoadingAI(false);
      setShowConfetti(true);
      setIsGeneratingModalOpen(false);
      setEditedPost(aiPostToHtml(data));
      // Automatycznie pobierz target i tagi na podstawie tytułu
      let target = '';
      let tags = '';
      try {
        const resTarget = await fetch('/api/generate-audience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: data?.title || '' })
        });
        if (resTarget.ok) {
          const d = await resTarget.json();
          if (d.audience) target = d.audience;
        }
        const resTags = await fetch('/api/generate-tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: data?.title || '' })
        });
        if (resTags.ok) {
          const d = await resTags.json();
          if (d.tags) tags = d.tags;
        }
      } catch (e) { /* ignoruj */ }
      setAiEditorInitialData({
        title: data?.title || '',
        slug: data?.title ? slugify(data.title) : '',
        summary: data?.lead || '',
        content: aiPostToHtml(data),
        featured_image: thumbnail || '',
        target,
        tags
      });
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (e) {
      toast.error('Błąd połączenia z API');
      setLoadingAI(false);
      setIsGeneratingModalOpen(false);
    }
  };

  const handlePublish = async () => {
    if (!aiPost) return;
    if (!user || !user.uid) {
      toast.error('Musisz być zalogowany, aby zapisać post!');
      return;
    }
    if (!thumbnail) {
      setShowMissingThumbnailModal(true);
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "blog_posts"), {
        title: aiPost?.title || "",
        lead: typeof aiPost?.lead === 'string' ? aiPost.lead : "",
        sections: Array.isArray(aiPost?.sections) ? aiPost.sections : [],
        summary: typeof aiPost?.summary === 'string' ? aiPost.summary : "",
        tags: Array.isArray(aiPost?.tags) ? aiPost.tags : [],
        created_at: serverTimestamp(),
        slug: aiPost?.title ? slugify(aiPost.title) : '',
        featured_image: thumbnail || '',
        excerpt: typeof aiPost?.lead === 'string' ? aiPost.lead : "",
        author: user?.email || "anonim",
        author_id: user?.uid || "",
        status: status,
        content: editedPost,
        published: true
      });
      toast.success('Post opublikowany!');
      setIsEditModalOpen(false);
      setAccepted(true);
      setPostId(docRef.id);
      setPostStatus('published');
      setAiEditorInitialData({
        title: aiPost?.title || '',
        slug: aiPost?.title ? slugify(aiPost.title) : '',
        summary: aiPost?.lead || '',
        content: editedPost,
        featured_image: thumbnail || '',
        target: '',
        tags: ''
      });
      setPostId(docRef.id);
    } catch (e: any) {
      toast.error('Błąd zapisu do bazy: ' + (e.message || e));
      console.error('Błąd zapisu do Firestore:', e);
    }
  };

  const handleDeletePost = async () => {
    if (!postId) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      toast.success('Post usunięty!');
      setAccepted(false);
      setPostId(null);
      setAiPost(null);
    } catch (e: any) {
      toast.error('Błąd usuwania posta: ' + (e.message || e));
    }
  };

  const handleToggleStatus = async () => {
    if (!postId) return;
    try {
      const newStatus = postStatus === 'published' ? 'draft' : 'published';
      await updateDoc(doc(db, 'blog_posts', postId), { status: newStatus });
      setPostStatus(newStatus);
      toast.success(`Status zmieniony na: ${newStatus === 'published' ? 'Publiczny' : 'Szkic'}`);
    } catch (e: any) {
      toast.error('Błąd zmiany statusu: ' + (e.message || e));
    }
  };

  // Sprawdź czy są wprowadzone zmiany (np. tytuł lub lead)
  const hasUnsavedChanges = topic.trim().length > 0 || (aiPost && (aiPost.title || aiPost.lead));

  const handleBack = () => {
    handlePrevStep();
  };

  const handleCancelPreview = () => {
    setExitAction('cancel');
    setShowExitModal(true);
  };

  const handleGoPanel = () => {
    navigate('/admin');
  };

  const handleGoHome = () => {
    if (hasUnsavedChanges) {
      setExitAction('home');
      setShowExitModal(true);
    } else {
      navigate('/');
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);
    if (exitAction === 'back') {
      handlePrevStep();
    } else if (exitAction === 'cancel') {
      setIsEditModalOpen(false);
      setAiPost(null);
    } else if (exitAction === 'panel') {
      navigate('/admin');
    } else if (exitAction === 'home') {
      navigate('/');
    }
    setExitAction(null);
  };

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Ładowanie...</div>;
  }

  const isDark = theme === 'dark';

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={handleGoPanel}
              className={`${
                isDark 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={18} className="mr-2" /> Wróć do panelu
            </Button>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {aiEditorInitialData ? 'Podsumowanie utworzonego posta' : 'Nowy post AI'}
            </h1>
          </div>
        </div>

        {aiEditorInitialData ? (
          <AIPostEditor
            postId={postId}
            initialData={aiEditorInitialData}
            onSave={async (values) => {
              // Zapisz do bazy
              if (!user || !user.uid) {
                toast.error('Musisz być zalogowany, aby zapisać post!');
                return;
              }
              if (!values.featured_image) {
                setShowMissingThumbnailModal(true);
                return;
              }
              try {
                await addDoc(collection(db, "blog_posts"), {
                  title: values.title || "",
                  lead: values.summary || "",
                  sections: [],
                  summary: values.summary || "",
                  tags: [],
                  created_at: serverTimestamp(),
                  slug: values.slug || '',
                  featured_image: values.featured_image || '',
                  excerpt: values.summary || "",
                  author: user?.email || "anonim",
                  author_id: user?.uid || "",
                  status: status,
                  content: values.content,
                  published: true
                });
                toast.success('Post opublikowany!');
                setAiEditorInitialData(null);
                navigate('/admin');
              } catch (e) {
                toast.error('Błąd zapisu do bazy');
              }
            }}
            onCancel={() => {
              setAiEditorInitialData(null);
              navigate('/admin');
            }}
          />
        ) : (
          <div className="flex gap-8">
            {/* Lewa kolumna - miniaturka */}
            <div className={`w-1/3 rounded-xl p-6 border ${
              isDark 
                ? 'bg-premium-dark/50 border-premium-light/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex flex-col items-center gap-4">
                <div 
                  className={`w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer transition-all hover:scale-105 ${
                    isDark 
                      ? 'bg-premium-dark/50 backdrop-blur-[5px] border-premium-light/20 hover:border-premium-light/50' 
                      : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                >
                  {thumbnail ? (
                    <img src={thumbnail} alt="Miniatura" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <ImageIcon size={48} className={`mb-4 ${isDark ? 'text-premium-light/50' : 'text-gray-400'}`} />
                      <p className={`text-center text-sm mb-4 ${isDark ? 'text-premium-light/70' : 'text-gray-500'}`}>
                        Przeciągnij i upuść lub kliknij, aby dodać miniaturę
                      </p>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                      <Button 
                        variant="outline" 
                        className={isDark ? 'btn-back' : 'bg-white border-gray-200 text-black hover:bg-gray-50'}
                      >
                        <Upload size={16} className="mr-2" />
                        Wybierz plik
                      </Button>
                    </>
                  )}
                </div>
                {thumbnail && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setThumbnail('')}
                    className={isDark ? 'btn-back' : 'bg-white border-gray-200 text-black hover:bg-gray-50'}
                  >
                    Usuń miniaturę
                  </Button>
                )}
              </div>
            </div>
            {/* Prawa kolumna - kreator */}
            <div className={`w-2/3 rounded-xl p-6 border ${
              isDark 
                ? 'bg-premium-dark/50 border-premium-light/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex flex-col gap-8">
                {/* Krok 1 - Temat */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                      O czym chcesz napisać?
                    </h2>
                    <textarea
                      className={`w-full h-32 rounded-xl px-4 py-3 text-lg resize-none transition-all focus:outline-none focus:ring-2 ${
                        isDark 
                          ? 'btn-back' 
                          : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 focus:ring-blue-500 hover:border-gray-400'
                      }`}
                      placeholder="Opisz temat swojego artykułu..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                )}
                {/* Krok 2 - Długość */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                      Jak długi ma być artykuł?
                    </h2>
                    <div className="space-y-8">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={[0]}
                        value={[postLength]}
                        onValueChange={(values) => setPostLength(values[0])}
                        className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=track]]:bg-gray-700/50 [&_[role=track].data-[orientation=horizontal]]:h-2 [&_[role=range]]:bg-white [&_[role=range]]:data-[orientation=horizontal]:bg-white [&_[role=track]]:data-[orientation=horizontal]:bg-gray-700/50"
                      />
                      <div className={`flex justify-between ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        <span className="flex-1">Krótki<br/>(300-500 słów)</span>
                        <span className="flex-1 text-center">Średni<br/>(500-900 słów)</span>
                        <span className="flex-1 text-right">Długi<br/>(900-1500 słów)</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Krok 3 - Styl i sposób przedstawienia */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                        Wybierz styl artykułu
                      </h2>
                      <div className="grid grid-cols-2 gap-2">
                        {postStyles.map((style) => (
                          <button
                            key={style.id}
                            className={
                              isDark
                                ? `btn-back p-2 rounded-lg border text-sm transition-all hover:scale-105${selectedStyle === style.id ? ' active' : ''}`
                                : `p-2 rounded-lg border text-sm transition-all hover:scale-105 ${selectedStyle === style.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-500 text-gray-700'}`
                            }
                            onClick={() => setSelectedStyle(style.id)}
                          >
                            <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {style.name}
                            </h3>
                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {style.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                        Sposób przedstawienia artykułu
                      </h2>
                      <div className="grid grid-cols-2 gap-2">
                        {postPresentations.map((presentation) => (
                          <button
                            key={presentation.id}
                            className={
                              isDark
                                ? `btn-back p-2 rounded-lg border text-sm transition-all hover:scale-105${selectedPresentation === presentation.id ? ' active' : ''}`
                                : `p-2 rounded-lg border text-sm transition-all hover:scale-105 ${selectedPresentation === presentation.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-blue-500 text-gray-700'}`
                            }
                            onClick={() => setSelectedPresentation(presentation.id)}
                          >
                            <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {presentation.name}
                            </h3>
                            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {presentation.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Krok 4 - Generowanie */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                      Gotowy do wygenerowania?
                    </h2>
                    <div className="space-y-4">
                      <div className={`rounded-lg p-4 space-y-2 ${
                        isDark 
                          ? 'bg-black/50 border border-gray-700' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Temat: <span className={isDark ? 'text-white' : 'text-gray-900'}>{topic}</span>
                        </p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Długość: <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {postLengths[getPostLengthFromSlider(postLength)].name}
                          </span>
                        </p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Styl: <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {postStyles.find(s => s.id === selectedStyle)?.name}
                          </span>
                        </p>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Sposób przedstawienia: <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {postPresentations.find(p => p.id === selectedPresentation)?.name}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Przyciski nawigacji */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="btn-back"
                    >
                      Wstecz
                    </Button>
                  )}
                  <div className="flex-1" />
                  <Button
                    onClick={handleNextStep}
                    className="btn-next"
                    disabled={currentStep === 1 && !topic.trim()}
                  >
                    {currentStep === 4 ? (
                      <>
                        <Sparkles className="mr-2" size={16} />
                        Generuj z AI
                      </>
                    ) : (
                      'Dalej'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modalne okna */}
      <Dialog open={isGeneratingModalOpen}>
        <DialogContent
          onInteractOutside={e => e.preventDefault()}
          hideCloseButton={true}
          className={`p-8 rounded-xl max-w-lg w-full ${
            isDark 
              ? 'bg-black/95 border border-gray-200' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Generowanie posta...
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className={`w-12 h-12 animate-spin ${
              isDark ? 'text-purple-500' : 'text-blue-500'
            }`} />
            <p className={isDark ? 'text-white' : 'text-gray-700'}>
              To może potrwać kilka minut. Proszę o cierpliwość.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className={`p-4 rounded-xl w-[90vw] max-w-[1400px] h-[90vh] overflow-hidden ${
          isDark 
            ? 'bg-black/50 backdrop-blur-[5px] border border-purple-500/30' 
            : 'bg-white border border-gray-200'
        }`}>
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Edycja posta
              </DialogTitle>
              <Button
                variant="ghost"
                className={`transition-all hover:scale-105 ${
                  isDark 
                    ? 'text-white hover:bg-purple-600/20' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex gap-4 h-[calc(90vh-120px)] mt-4">
            <div className="flex-1 flex flex-col">
              <div className={`sticky top-0 z-10 rounded-lg border-0 ${
                isDark ? 'bg-black/50 backdrop-blur-[5px]' : 'bg-white'
              }`}>
                <div className="tiptap-toolbar-container p-2">
                  {/* Toolbar będzie tutaj */}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto mt-4 pr-4">
                <div className={`rounded-lg border-0 ${
                  isDark ? 'bg-black/50 backdrop-blur-[5px]' : 'bg-white'
                }`}>
                  <SimpleEditor
                    value={editedPost}
                    onChange={setEditedPost}
                    isToolbarFixed={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-48 flex flex-col gap-4 ml-4">
              <Button
                className="btn-save w-full py-6"
                onClick={handlePublish}
              >
                Zapisz
              </Button>
              <Button
                className="btn-cancel w-full py-6"
                onClick={handleCancelPreview}
              >
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMissingThumbnailModal} onOpenChange={setShowMissingThumbnailModal}>
        <DialogContent className={`p-8 rounded-xl max-w-lg w-full ${
          isDark 
            ? 'bg-black/95 border border-purple-500/30' 
            : 'bg-white border border-gray-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Zapomniałeś dodać miniaturę!
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <p className={isDark ? 'text-white' : 'text-gray-700'}>
              Aby opublikować post, musisz dodać miniaturę.
            </p>
            <input
              id="thumbnail-upload-modal"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (typeof event.target?.result === 'string') {
                      setThumbnail(event.target.result);
                      setShowMissingThumbnailModal(false);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Button
              className={isDark ? 'btn-next' : 'bg-blue-600 text-white hover:bg-blue-700'}
              onClick={() => document.getElementById('thumbnail-upload-modal')?.click()}
            >
              Wybierz plik
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className={`p-8 rounded-xl max-w-lg w-full ${
          isDark 
            ? 'bg-black/95 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-semibold text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Czy na pewno chcesz wyjść?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <p className={isDark ? 'text-white' : 'text-gray-700'}>
              Wprowadzone zmiany nie zostaną zapisane.
            </p>
            <div className="flex gap-4 mt-4">
              <Button className="btn-exit-cancel" onClick={() => setShowExitModal(false)}>
                Wróć
              </Button>
              <Button className="btn-exit-confirm" onClick={confirmExit}>
                Wyjdź
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          recycle={true}
          style={{ position: 'fixed', top: 0, left: 0 }}
        />
      )}
    </AdminLayout>
  );
}
