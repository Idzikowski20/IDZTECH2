
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useBlogStore, BlogPost } from '@/utils/blog';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';

const blogPostSchema = z.object({
  title: z.string().min(5, 'Tytuł musi mieć co najmniej 5 znaków'),
  slug: z.string().min(5, 'Slug musi mieć co najmniej 5 znaków').regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  excerpt: z.string().min(10, 'Zajawka musi mieć co najmniej 10 znaków'),
  content: z.string().min(50, 'Treść musi mieć co najmniej 50 znaków'),
  featuredImage: z.string().url('Podaj poprawny URL obrazu'),
  author: z.string().min(2, 'Imię autora musi mieć co najmniej 2 znaki'),
  categories: z.string().min(2, 'Kategorie są wymagane'),
  tags: z.string().min(2, 'Tagi są wymagane')
});

type FormValues = z.infer<typeof blogPostSchema>;

const BlogPostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { posts, addPost, updatePost } = useBlogStore();
  const [isLoading, setIsLoading] = useState(false);

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
      featuredImage: existingPost?.featuredImage || '',
      author: existingPost?.author || '',
      categories: existingPost?.categories.join(', ') || '',
      tags: existingPost?.tags.join(', ') || ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const postData = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        featuredImage: values.featuredImage,
        author: values.author,
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
              
              <FormField 
                control={form.control} 
                name="featuredImage" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL zdjęcia głównego</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" className="bg-slate-950" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField 
                  control={form.control} 
                  name="author" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jan Kowalski" className="bg-slate-950" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                
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
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogPostEditor;
