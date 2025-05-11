
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useBlogStore, BlogPost } from '@/utils/blog';
import { useAuth } from '@/utils/AuthProvider';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';

const blogPostSchema = z.object({
  title: z.string().min(5, 'Tytuł musi mieć co najmniej 5 znaków'),
  slug: z.string().min(5, 'Slug musi mieć co najmniej 5 znaków').regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  excerpt: z.string().min(10, 'Zajawka musi mieć co najmniej 10 znaków'),
  content: z.string().min(50, 'Treść musi mieć co najmniej 50 znaków'),
  categories: z.string().min(2, 'Kategorie są wymagane'),
  tags: z.string().min(2, 'Tagi są wymagane')
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

  // Find existing post if editing
  const existingPost = id ? posts.find(post => post.id === id) : undefined;
  const isEditing = !!existingPost;

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: existingPost?.title || '',
      slug: existingPost?.slug || '',
      excerpt: existingPost?.excerpt || '',
      content: existingPost?.content || '',
      categories: existingPost?.categories.join(', ') || '',
      tags: existingPost?.tags.join(', ') || ''
    }
  });

  // Initialize image preview if we're editing a post with an existing image
  useEffect(() => {
    if (existingPost?.featuredImage) {
      setImagePreview(existingPost.featuredImage);
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
      let imageUrl = existingPost?.featuredImage || '';
      
      if (featuredImage) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(featuredImage);
        });
      }

      const postData = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        featuredImage: imageUrl,
        author: user.name || 'Anonymous',  // Use logged in user name
        categories: values.categories.split(',').map(cat => cat.trim()),
        tags: values.tags.split(',').map(tag => tag.trim())
      };

      if (isEditing && existingPost) {
        updatePost(existingPost.id, postData);
        toast({
          title: "Post zaktualizowany",
          description: "Post został pomyślnie zaktualizowany."
        });
      } else {
        addPost(postData);
        toast({
          title: "Post dodany",
          description: "Nowy post został dodany do bloga."
        });
      }
      navigate('/admin');
    } catch (error) {
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
      const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
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
          <Button onClick={form.handleSubmit(onSubmit)} className="bg-premium-gradient" disabled={isLoading}>
            <Save size={18} className="mr-2" />
            {isLoading ? 'Zapisywanie...' : 'Zapisz post'}
          </Button>
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
                            if (!isEditing) generateSlug();
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
                      <FormLabel>Slug</FormLabel>
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
                name="excerpt" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zajawka</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Krótki opis posta (będzie widoczny na liście postów)" rows={2} className="bg-slate-950" />
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
                    {user?.name || 'Nieznany autor'}
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
                      <Input {...field} placeholder="pozycjonowanie, SEO, Google" className="bg-slate-950" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogPostEditor;
