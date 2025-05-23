import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TipTapEditor from '@/components/TipTapEditor';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTheme } from '@/utils/themeContext';

const blogPostSchema = z.object({
  title: z.string().min(5, 'Tytuł musi mieć co najmniej 5 znaków'),
  slug: z.string().min(5, 'Slug musi mieć co najmniej 5 znaków').regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  summary: z.string().min(10, 'Zajawka musi mieć co najmniej 10 znaków'),
  content: z.string().min(50, 'Treść musi mieć co najmniej 50 znaków'),
  target: z.string().min(2, 'Target jest wymagany'),
  tags: z.string().min(2, 'Tagi są wymagane')
});

type FormValues = z.infer<typeof blogPostSchema>;

type AIPostEditorProps = {
  postId: string;
  initialData: Partial<FormValues & { featured_image?: string }>;
  onSave?: (data: any) => void;
  onCancel?: () => void;
};

const AIPostEditor: React.FC<AIPostEditorProps> = ({ postId, initialData, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData.featured_image || '');
  const [editorContent, setEditorContent] = useState(initialData.content || '');
  const [showExitModal, setShowExitModal] = useState(false);
  const { theme } = useTheme();

  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData.title || '',
      slug: initialData.slug || '',
      summary: initialData.summary || '',
      content: initialData.content || '',
      target: initialData.target || '',
      tags: initialData.tags || ''
    }
  });

  useEffect(() => {
    if (initialData.featured_image) setImagePreview(initialData.featured_image);
    if (initialData.content) setEditorContent(initialData.content);
  }, [initialData]);

  // Automatyczne uzupełnianie targetu i tagów przez AI na podstawie tytułu
  useEffect(() => {
    const autoFillTargetAndTags = async () => {
      const title = form.getValues('title');
      if (title && (!form.getValues('target') || !form.getValues('tags'))) {
        try {
          // Pobierz target (grupa docelowa)
          if (!form.getValues('target')) {
            const resTarget = await fetch('/api/generate-audience', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic: title })
            });
            if (resTarget.ok) {
              const data = await resTarget.json();
              if (data.audience) form.setValue('target', data.audience);
            }
          }
          // Pobierz tagi
          if (!form.getValues('tags')) {
            const resTags = await fetch('/api/generate-tags', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic: title })
            });
            if (resTags.ok) {
              const data = await resTags.json();
              if (data.tags) form.setValue('tags', data.tags);
            }
          }
        } catch (e) { /* ignoruj */ }
      }
    };
    autoFillTargetAndTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('title')]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let imageUrl = initialData.featured_image || '';
      if (featuredImage) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(featuredImage);
        });
      }
      const postData = {
        ...values,
        content: editorContent,
        featured_image: imageUrl,
      };
      if (onSave) onSave(postData);
    } catch (error) {
      toast.error('Błąd podczas zapisywania posta.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/\[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      form.setValue('slug', slug);
    }
  };

  const handleCancel = () => {
    setShowExitModal(true);
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              control={form.control} 
              name="title" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Tytuł</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Tytuł posta" 
                      onBlur={() => {
                        if (!form.getValues('slug')) {
                          generateSlug();
                        }
                      }} 
                      className={theme === 'dark' ? 'bg-black text-white border-gray-700 placeholder-gray-400' : 'bg-white border-gray-300 text-black'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
              control={form.control} 
              name="slug" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="url-posta" 
                      className={theme === 'dark' ? 'bg-black text-white border-gray-700 placeholder-gray-400' : 'bg-white border-gray-300 text-black'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>
          <FormField 
            control={form.control} 
            name="summary" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Zajawka</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Krótki opis posta (będzie widoczny na liście postów)" rows={2} 
                    className={theme === 'dark' ? 'bg-black text-white border-gray-700 placeholder-gray-400' : 'bg-white border-gray-300 text-black resize-none'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField 
            control={form.control} 
            name="content" 
            render={() => (
              <FormItem>
                <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Treść (HTML)</FormLabel>
                <FormControl>
                  <TipTapEditor 
                    value={editorContent}
                    onChange={setEditorContent}
                    placeholder="Treść posta w formacie HTML"
                    className={theme === 'dark' ? 'editor-force-text-color' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <div className="space-y-2">
            <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Zdjęcie główne</FormLabel>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="bg-premium-light/5 border border-premium-light/20 hover:bg-premium-light/10 transition-colors rounded-lg px-4 py-2 flex items-center">
                    <Upload size={18} className="mr-2" />
                    <span>Wybierz plik</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
                {featuredImage && (
                  <span className="text-sm text-premium-light/70">
                    {featuredImage.name} ({Math.round(featuredImage.size / 1024)} KB)
                  </span>
                )}
              </div>
              {imagePreview && (
                <div className="relative mt-2 max-w-md">
                  <img 
                    src={imagePreview} 
                    alt="Podgląd zdjęcia głównego" 
                    className="rounded-lg max-h-48 object-cover" 
                  />
                  <Button 
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                    onClick={() => {
                      setImagePreview('');
                      setFeaturedImage(null);
                    }}
                  >
                    Usuń
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              control={form.control} 
              name="target" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Target (grupa docelowa, oddzielone przecinkami)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="np. właściciele firm, marketerzy, blogerzy" className={theme === 'dark' ? 'bg-black text-white border-gray-700 placeholder-gray-400' : ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
              control={form.control} 
              name="tags" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Tagi (oddzielone przecinkami)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="pozycjonowanie, SEO, Google" className={theme === 'dark' ? 'bg-black text-white border-gray-700 placeholder-gray-400' : ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>
          <div className="pt-4 flex gap-4">
            <Button 
              type="submit" 
              className="btn-save" 
              disabled={isLoading}
            >
              {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
            {onCancel && (
              <Button type="button" className="btn-cancel" onClick={handleCancel}>
                Anuluj
              </Button>
            )}
          </div>
        </form>
      </Form>
      {showExitModal && (
        <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Czy na pewno chcesz wyjść?</DialogTitle>
              <DialogDescription>Zmiany zostaną utracone.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowExitModal(false)}>Wróć</Button>
              <Button variant="destructive" onClick={onCancel}>Wyjdź</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AIPostEditor; 