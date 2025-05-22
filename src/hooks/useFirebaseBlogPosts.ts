import { useEffect, useState } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/integrations/firebase/client';
import { toast } from 'sonner';

// Define a simpler type for blog posts
type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  featured_image: string
  summary: string | null
  excerpt: string | null
  categories: string[] | null
  tags: string[] | null
  created_at: string
  published: boolean
  published_at: string | null
}

// Sample fallback data - used when Firebase connection fails
const fallbackPosts: BlogPost[] = [
  {
    id: 'fallback-1',
    title: 'Co to jest SEO i dlaczego jest ważne dla biznesu',
    slug: 'co-to-jest-seo',
    content: '<p>SEO (Search Engine Optimization) to zestaw praktyk mających na celu zwiększenie widoczności strony internetowej w wynikach wyszukiwania. Dowiedz się więcej o tym, jak SEO może pomóc Twojemu biznesowi.</p>',
    featured_image: '/lovable-uploads/97ac4bd6-784a-468e-8520-021492b8878d.png',
    summary: 'Podstawy SEO i jego wpływ na marketing internetowy',
    excerpt: 'Podstawy SEO i jego wpływ na marketing internetowy',
    categories: ['SEO', 'Marketing'],
    tags: ['pozycjonowanie', 'google', 'marketing cyfrowy'],
    created_at: '2025-01-15T10:00:00Z',
    published: true,
    published_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'fallback-2',
    title: 'Najlepsze praktyki optymalizacji strony na urządzenia mobilne',
    slug: 'optymalizacja-mobile',
    content: '<p>W dzisiejszych czasach większość ruchu w internecie pochodzi z urządzeń mobilnych. Dowiedz się, jak zoptymalizować swoją stronę, aby była przyjazna dla użytkowników mobile.</p>',
    featured_image: '/lovable-uploads/af7b17cd-510f-468f-a8b1-5b0c5be88c9f.png',
    summary: 'Jak projektować strony przyjazne urządzeniom mobilnym',
    excerpt: 'Jak projektować strony przyjazne urządzeniom mobilnym',
    categories: ['UX/UI', 'Web Development'],
    tags: ['mobile', 'responsywność', 'ux'],
    created_at: '2025-02-20T14:30:00Z',
    published: true,
    published_at: '2025-02-20T14:30:00Z'
  },
  {
    id: 'fallback-3',
    title: 'Znaczenie contentu wysokiej jakości w strategii SEO',
    slug: 'content-seo',
    content: '<p>Content jest królem - to stare powiedzenie jest nadal aktualne. Dowiedz się, jak tworzyć treści, które podobają się zarówno Google, jak i użytkownikom.</p>',
    featured_image: '/lovable-uploads/4eaa25a8-fb84-4c19-ae4f-8536407401c1.png',
    summary: 'Jak tworzyć treści, które pozycjonują się w Google',
    excerpt: 'Jak tworzyć treści, które pozycjonują się w Google',
    categories: ['Content Marketing', 'SEO'],
    tags: ['treści', 'blog', 'content marketing'],
    created_at: '2025-03-10T09:15:00Z',
    published: true,
    published_at: '2025-03-10T09:15:00Z'
  }
];

export function useFirebaseBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      try {
        console.log('Fetching blog posts from Firebase...');
        const postsRef = collection(db, 'blog_posts');
        const q = query(postsRef, orderBy('created_at', 'desc'));
        
        try {
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            console.log('No posts found, using fallback data');
            setPosts(fallbackPosts);
            return;
          }
          
          const fetchedPosts = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || '',
              slug: data.slug || '',
              content: data.content || '',
              featured_image: data.featured_image || '',
              summary: data.summary || null,
              excerpt: data.excerpt || data.summary || null, // Use summary as fallback if excerpt is missing
              categories: data.categories || null,
              tags: data.tags || null,
              created_at: data.created_at && typeof data.created_at.toDate === 'function'
                ? data.created_at.toDate().toISOString()
                : (typeof data.created_at === 'string'
                    ? data.created_at
                    : new Date().toISOString()),
              published: data.published || false,
              published_at: data.published_at && typeof data.published_at.toDate === 'function'
                ? data.published_at.toDate().toISOString()
                : (typeof data.published_at === 'string'
                    ? data.published_at
                    : null)
            } as BlogPost;
          });
          
          console.log('Blog posts fetched:', fetchedPosts);
          setPosts(fetchedPosts.length > 0 ? fetchedPosts : fallbackPosts);
        } catch (firestoreError) {
          console.error('Error fetching blog posts from Firestore:', firestoreError);
          // Immediately use fallback data on Firestore error
          console.log('Using fallback data due to Firestore error');
          setPosts(fallbackPosts);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        console.log('Using fallback data due to general error');
        setPosts(fallbackPosts);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Get post by slug
  const getPost = (slug: string) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const fetchPost = async () => {
        if (!slug) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        
        // Always check fallback posts first for reliability
        const fallbackPost = fallbackPosts.find(p => p.slug === slug);
        
        try {
          console.log(`Fetching blog post with slug: ${slug}`);
          
          // If we have a fallback post, use it immediately for faster loading
          if (fallbackPost) {
            console.log('Found fallback post:', fallbackPost);
            setPost(fallbackPost);
            setIsLoading(false);
            return;
          }
          
          // Try to fetch from Firestore
          try {
            const postsRef = collection(db, 'blog_posts');
            const q = query(postsRef, where('slug', '==', slug));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
              throw new Error(`Post with slug ${slug} not found`);
            } else {
              const postDoc = querySnapshot.docs[0];
              const data = postDoc.data();
              
              const fetchedPost = {
                id: postDoc.id,
                title: data.title || '',
                slug: data.slug || '',
                content: data.content || '',
                featured_image: data.featured_image || '',
                summary: data.summary || null,
                excerpt: data.excerpt || data.summary || null, // Use summary as fallback
                categories: data.categories || null,
                tags: data.tags || null,
                created_at: data.created_at && typeof data.created_at.toDate === 'function'
                  ? data.created_at.toDate().toISOString()
                  : (typeof data.created_at === 'string'
                      ? data.created_at
                      : new Date().toISOString()),
                published: data.published || false,
                published_at: data.published_at && typeof data.published_at.toDate === 'function'
                  ? data.published_at.toDate().toISOString()
                  : (typeof data.published_at === 'string'
                      ? data.published_at
                      : null)
              } as BlogPost;
              
              setPost(fetchedPost);
              console.log('Fetched post from Firebase:', fetchedPost);
            }
          } catch (firestoreError) {
            console.error('Firestore error fetching post:', firestoreError);
            throw firestoreError;
          }
        } catch (err) {
          console.error('Error fetching blog post:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          
          // As a last resort, try to find a fallback post again
          if (fallbackPost) {
            console.log('Using fallback post after error:', fallbackPost);
            setPost(fallbackPost);
          } else {
            toast.error('Błąd podczas pobierania postu');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }, [slug]);

    return { post: post || undefined, isLoading, error };
  };

  // Create post
  const createPost = async (newPost: Omit<BlogPost, 'id'>) => {
    try {
      // Zamiast uploadować do storage, po prostu użyj base64 (data URL)
      let imageUrl = newPost.featured_image;
      // Nie uploadujemy do storage!
      const postData = {
        ...newPost,
        excerpt: newPost.excerpt || newPost.summary, // Ensure excerpt exists
        featured_image: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'blog_posts'), postData);
      toast.success('Post dodany!');
      setPosts(prevPosts => {
        const newPosts = [
          { id: docRef.id, ...postData },
          ...(prevPosts || [])
        ];
        return newPosts;
      });
      return { id: docRef.id, ...postData };
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Błąd podczas tworzenia postu');
      throw err;
    }
  };

  // Update post
  const updatePost = async ({ id, ...updates }: BlogPost) => {
    try {
      // Zamiast uploadować do storage, po prostu użyj base64 (data URL)
      let imageUrl = updates.featured_image;
      // Nie uploadujemy do storage!
      const postRef = doc(db, 'blog_posts', id);
      const postData = {
        ...updates,
        excerpt: updates.excerpt || updates.summary, // Ensure excerpt exists
        featured_image: imageUrl,
        updated_at: new Date().toISOString(),
      };
      await updateDoc(postRef, postData);
      toast.success('Post zaktualizowany!');
      setPosts(prevPosts => {
        if (!prevPosts) return prevPosts;
        return prevPosts.map(post => 
          post.id === id ? { ...post, ...postData } : post
        );
      });
      return { id, ...postData };
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error('Błąd podczas aktualizacji postu');
      throw err;
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
      toast.success('Post usunięty!');
      
      // Update local state
      setPosts(prevPosts => {
        if (!prevPosts) return prevPosts;
        return prevPosts.filter(post => post.id !== id);
      });
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Błąd podczas usuwania postu');
      throw err;
    }
  };

  return {
    posts,
    isLoadingPosts,
    error,
    getPost,
    createPost,
    updatePost,
    deletePost
  };
}

export function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') return new Date(date).toLocaleDateString('pl-PL');
  if (date.toDate) return date.toDate().toLocaleDateString('pl-PL');
  if (date.seconds) return new Date(date.seconds * 1000).toLocaleDateString('pl-PL');
  return '';
}
