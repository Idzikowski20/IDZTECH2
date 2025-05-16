import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft, Upload, FileCode, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useBlogStore } from '@/utils/blog';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

const blogPostSchema = z.object({
  title: z.string().min(5, 'Tytuł musi mieć co najmniej 5 znaków'),
  slug: z.string().min(5, 'Slug musi mieć co najmniej 5 znaków').regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  summary: z.string().min(10, 'Zajawka musi mieć co najmniej 10 znaków'),
  content: z.string().min(50, 'Treść musi mieć co najmniej 50 znaków'),
  categories: z.string().min(2, 'Kategorie są wymagane'),
  tags: z.string().min(2, 'Tagi są wymagane'),
  meta_title: z.string().min(1, 'Meta title jest wymagany'),
  meta_description: z.string().min(1, 'Meta description jest wymagana'),
  meta_keywords: z.string().min(1, 'Meta keywords są wymagane'),
});

type FormValues = z.infer<typeof blogPostSchema>;

const BlogPostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { posts, addPost, updatePost } = useBlogStore();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  // Find existing post if editing
  const [existingPost, setExistingPost] = useState<any>(null);
  const isEditing = !!id;

  // Fetch post from database if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
            
          if (error) {
            throw error;
          }
          
          if (data) {
            setExistingPost(data);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          toast({
            title: "Błąd",
            description: "Nie udało się załadować posta",
            variant: "destructive"
          });
        }
      }
    };
    
    fetchPost();
  }, [id, toast]);

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: existingPost?.title || '',
      slug: existingPost?.slug || '',
      summary: existingPost?.summary || '',
      content: existingPost?.content || '',
      categories: existingPost?.categories?.join(', ') || '',
      tags: existingPost?.tags?.join(', ') || '',
      meta_title: existingPost?.meta_title || '',
      meta_description: existingPost?.meta_description || '',
      meta_keywords: existingPost?.meta_keywords || '',
    },
    values: existingPost ? {
      title: existingPost.title || '',
      slug: existingPost.slug || '',
      summary: existingPost.summary || '',
      content: existingPost.content || '',
      categories: existingPost.categories?.join(', ') || '',
      tags: existingPost.tags?.join(', ') || '',
      meta_title: existingPost.meta_title || '',
      meta_description: existingPost.meta_description || '',
      meta_keywords: existingPost.meta_keywords || '',
    } : undefined
  });

  // Initialize image preview if we're editing a post with an existing image
  useEffect(() => {
    if (existingPost?.featured_image) {
      setImagePreview(existingPost.featured_image);
    }
  }, [existingPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      
      // Create a preview URL for the image
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Błąd",
        description: "Musisz być zalogowany, aby dodać lub edytować post.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert image to base64 if we have a new image
      let imageUrl = existingPost?.featured_image || '';
      
      if (featuredImage) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(featuredImage);
        });
      }

      // Prepare data for database
      const postData = {
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        content: values.content,
        featured_image: imageUrl,
        author_id: user.id,
        categories: values.categories.split(',').map(cat => cat.trim()),
        tags: values.tags.split(',').map(tag => tag.trim()),
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (isEditing && id) {
        // Update existing post in database
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        // Update local state
        updatePost(id, {
          ...postData,
          author: user.name || 'Anonymous',
          featuredImage: imageUrl,
          excerpt: values.summary
        });
        
        toast({
          title: "Post zaktualizowany",
          description: "Post został pomyślnie zaktualizowany."
        });
      } else {
        // Add new post to database
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        // Add to local state
        if (data) {
          addPost({
            title: values.title,
            slug: values.slug,
            excerpt: values.summary,
            content: values.content,
            featuredImage: imageUrl,
            author: user.name || 'Anonymous',
            categories: values.categories.split(',').map(cat => cat.trim()),
            tags: values.tags.split(',').map(tag => tag.trim())
          });
        }
        
        toast({
          title: "Post dodany",
          description: "Nowy post został dodany do bloga."
        });
      }
      
      navigate('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił problem podczas zapisywania posta.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Automatyczne generowanie sluga na podstawie tytułu
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'title') {
        const title = values.title || '';
        const slug = title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[ -]/g, c => c)
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        form.setValue('slug', slug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <AdminLayout>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Lewa kolumna: główne pola */}
              <div className="flex-1 bg-premium-dark/40 rounded-2xl shadow-lg p-8">
                <div className="flex flex-col gap-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Tytuł</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tytuł posta" className="bg-slate-950 text-lg py-4 px-4 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Slug (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="url-posta" className="bg-slate-950 py-4 px-4 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="summary" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Zajawka</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Krótki opis posta (będzie widoczny na liście postów)" rows={2} className="bg-slate-950 py-4 px-4 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Treść (HTML)</FormLabel>
                      <FormControl>
                        <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Treść posta w formacie HTML" rows={15} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* Featured Image Upload */}
                  <div className="space-y-2">
                    <FormLabel className="text-lg font-semibold">Zdjęcie główne</FormLabel>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <label className="cursor-pointer">
                          <div className="bg-premium-light/5 border border-premium-light/20 hover:bg-premium-light/10 transition-colors rounded-lg px-4 py-2 flex items-center">
                            <Upload size={18} className="mr-2" />
                            <span>Wybierz plik</span>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                        {featuredImage && (
                          <span className="text-sm text-premium-light/70">{featuredImage.name} ({Math.round(featuredImage.size / 1024)} KB)</span>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="relative mt-2 max-w-md">
                          <img src={imagePreview} alt="Podgląd zdjęcia głównego" className="rounded-lg max-h-48 object-cover" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-80 hover:opacity-100" onClick={() => { setImagePreview(''); setFeaturedImage(null); }}>Usuń</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Prawa kolumna: ustawienia posta */}
              <div className="w-full md:w-96 flex-shrink-0 bg-premium-dark/60 rounded-2xl shadow-lg p-8 flex flex-col gap-6">
                <div>
                  <FormLabel className="text-lg font-semibold">Autor</FormLabel>
                  <div className="bg-slate-950 border border-premium-light/10 rounded-md px-4 py-2 text-premium-light/80 mt-2">
                    {user?.name || user?.email || 'Nieznany autor'}
                  </div>
                </div>
                <FormField control={form.control} name="categories" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Kategorie (oddzielone przecinkami)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SEO, Marketing Cyfrowy" className="bg-slate-950" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="tags" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Tagi (oddzielone przecinkami)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="pozycjonowanie, SEO, Google" className="bg-slate-950" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="meta_title" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Meta Title (SEO)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Meta tytuł (do SEO, max 60 znaków)" className="bg-slate-950" maxLength={60} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="meta_description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Meta Description (SEO)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Meta opis (do SEO, max 160 znaków)" className="bg-slate-950" maxLength={160} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="meta_keywords" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Meta Keywords (oddzielone przecinkami)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="np. pozycjonowanie, SEO, strony internetowe" className="bg-slate-950" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            {/* Przyciski na górze */}
            <div className="flex gap-4 justify-end mt-8">
              <Button type="button" onClick={() => setShowPreview(true)} className="bg-blue-700 px-8 py-3 text-lg rounded-xl shadow-md hover:bg-blue-800 transition">Podgląd posta</Button>
              <Button type="submit" className="bg-premium-gradient px-8 py-3 text-lg rounded-xl shadow-md hover:scale-105 transition" disabled={isLoading}>{isLoading ? 'Zapisywanie...' : isEditing ? 'Aktualizuj post' : 'Opublikuj post'}</Button>
            </div>
          </form>
        </Form>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Podgląd posta</DialogTitle>
            </DialogHeader>
            <div className="prose prose-invert max-w-none">
              <h1>{form.getValues('title')}</h1>
              <p className="text-premium-light/70 mb-2">{form.getValues('summary')}</p>
              {imagePreview && (
                <img src={imagePreview} alt="Podgląd zdjęcia głównego" className="rounded-lg max-h-64 object-cover mb-4" />
              )}
              <div dangerouslySetInnerHTML={{ __html: form.getValues('content') }} />
              <div className="mt-4 text-xs text-premium-light/60">
                Kategorie: {form.getValues('categories')}
                <br />
                Tagi: {form.getValues('tags')}
                <br />
                Autor: {user?.name || 'Nieznany autor'}
              </div>
            </div>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4">Zamknij podgląd</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BlogPostEditor;
