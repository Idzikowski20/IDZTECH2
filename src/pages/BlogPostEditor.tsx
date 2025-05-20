
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft, Upload, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createPost, updatePost, getPostBySlug, BlogPost } from '@/services/blogService';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';

const blogPostSchema = z.object({
  title: z.string().min(5, 'Tytuł musi mieć co najmniej 5 znaków'),
  slug: z.string().min(5, 'Slug musi mieć co najmniej 5 znaków').regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  summary: z.string().min(10, 'Zajawka musi mieć co najmniej 10 znaków'),
  content: z.string().min(50, 'Treść musi mieć co najmniej 50 znaków'),
  categories: z.string().min(2, 'Kategorie są wymagane'),
  tags: z.string().min(2, 'Tagi są wymagane'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_tags: z.string().optional(),
});

type FormValues = z.infer<typeof blogPostSchema>;

const BlogPostEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);
  const isEditing = !!slug;

  // Fetch post if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          const data = await getPostBySlug(slug);
          setExistingPost(data);
          
          if (data?.featured_image) {
            setImagePreview(data.featured_image);
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
  }, [slug, toast]);

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      categories: '',
      tags: '',
      meta_title: '',
      meta_description: '',
      meta_tags: '',
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
      meta_tags: existingPost.meta_tags || '',
    } : undefined
  });

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
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
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
        date: existingPost?.date || new Date().toISOString(),
        meta_title: values.meta_title || values.title,
        meta_description: values.meta_description || values.summary,
        meta_tags: values.meta_tags || values.tags,
      };

      let result;
      
      if (isEditing && existingPost?.id) {
        // Update existing post
        result = await updatePost(existingPost.id, postData);
        
        toast({
          title: "Post zaktualizowany",
          description: "Post został pomyślnie zaktualizowany."
        });
      } else {
        // Add new post
        result = await createPost(postData);
        
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

  // Handle slug generation from title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      form.setValue('slug', slug);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate('/admin')} className="hover:bg-premium-light/5 mb-2">
              <ArrowLeft size={18} className="mr-2" /> Wróć do panelu
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edytuj post' : 'Dodaj nowy post'}
            </h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => form.setValue('content', form.getValues('content') + '<h2>Nagłówek H2</h2>')} className="bg-gray-700">
              <FileCode size={18} className="mr-2" /> Dodaj H2
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} className="bg-premium-gradient" disabled={isLoading}>
              <Save size={18} className="mr-2" />
              {isLoading ? 'Zapisywanie...' : 'Zapisz post'}
            </Button>
          </div>
        </div>

        <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  control={form.control} 
                  name="title" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Tytuł posta" 
                          onBlur={() => {
                            if (!isEditing && !form.getValues('slug')) {
                              generateSlug();
                            }
                            
                            // Ustaw meta_title jeśli pusty
                            if (!form.getValues('meta_title')) {
                              form.setValue('meta_title', field.value);
                            }
                          }} 
                          className="bg-slate-950" 
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
                      <FormLabel>Slug (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="url-posta" className="bg-slate-950" />
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
                    <FormLabel>Zajawka</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Krótki opis posta (będzie widoczny na liście postów)" 
                        rows={2} 
                        className="bg-slate-950"
                        onBlur={() => {
                          // Ustaw meta_description jeśli pusty
                          if (!form.getValues('meta_description')) {
                            form.setValue('meta_description', field.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                control={form.control} 
                name="content" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treść (HTML)</FormLabel>
                    <div className="mb-2 flex gap-2">
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<h1>Nagłówek H1</h1>')}>H1</Button>
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<h2>Nagłówek H2</h2>')}>H2</Button>
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<h3>Nagłówek H3</h3>')}>H3</Button>
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<p>Paragraf</p>')}>P</Button>
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<strong>Pogrubienie</strong>')}>Bold</Button>
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<em>Kursywa</em>')}>Italic</Button>
                      <Button type="button" size="sm" onClick={() => field.onChange(field.value + '<ul>\n<li>Element listy</li>\n<li>Element listy</li>\n</ul>')}>Lista</Button>
                    </div>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Treść posta w formacie HTML"
                        rows={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              {/* SEO section */}
              <div className="mt-10 border-t border-premium-light/10 pt-6">
                <h3 className="text-xl font-semibold mb-4">SEO</h3>
                
                <div className="space-y-4">
                  <FormField 
                    control={form.control} 
                    name="meta_title" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Meta tytuł (SEO)" className="bg-slate-950" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  
                  <FormField 
                    control={form.control} 
                    name="meta_description" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Meta opis (SEO)" className="bg-slate-950" rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  
                  <FormField 
                    control={form.control} 
                    name="meta_tags" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Tags</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Meta tagi oddzielone przecinkami (SEO)" className="bg-slate-950" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
              </div>
              
              {/* Featured Image Upload */}
              <div className="space-y-2">
                <FormLabel>Zdjęcie główne</FormLabel>
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
                  
                  {/* Image Preview */}
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
                {/* Author information display (not editable) */}
                <div className="space-y-2">
                  <FormLabel>Autor</FormLabel>
                  <div className="bg-slate-950 border border-premium-light/10 rounded-md px-4 py-2 text-premium-light/80">
                    {user?.name || user?.email?.split('@')[0] || 'Nieznany autor'}
                  </div>
                </div>
                
                <FormField 
                  control={form.control} 
                  name="categories" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategorie (oddzielone przecinkami)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SEO, Marketing Cyfrowy" className="bg-slate-950" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
              
              <FormField 
                control={form.control} 
                name="tags" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagi (oddzielone przecinkami)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="pozycjonowanie, SEO, Google" 
                        className="bg-slate-950"
                        onBlur={() => {
                          // Ustaw meta_tags jeśli pusty
                          if (!form.getValues('meta_tags')) {
                            form.setValue('meta_tags', field.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="bg-premium-gradient" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Zapisywanie...' : isEditing ? 'Aktualizuj post' : 'Opublikuj post'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Post zostanie automatycznie dodany do sitemap.xml dla lepszego indeksowania w Google.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogPostEditor;
