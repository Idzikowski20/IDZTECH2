
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotifications } from './notifications';
import { NotificationType } from './notifications';
import { supabase } from './supabaseClient';

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  replies?: CommentReply[];
}

export interface GuestLike {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  date: string;
  views: number;
  author: string;
  categories: string[];
  tags: string[];
  comments: BlogComment[];
  likes: string[]; // Array of user IDs who liked the post
  guestLikes: GuestLike[]; // Array of guest likes
  deviceLikes: string[]; // Array of device IDs that liked the post
}

interface BlogStore {
  posts: BlogPost[];
  deviceId: string; // Unique identifier for the current device
  loading: boolean;
  error: string | null;
  addPost: (post: Omit<BlogPost, 'id' | 'views' | 'date' | 'comments' | 'likes' | 'guestLikes' | 'deviceLikes'>) => Promise<void>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  incrementView: (id: string) => Promise<void>;
  resetStats: () => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  fetchPosts: () => Promise<void>;
  addComment: (postId: string, userId: string, userName: string, userAvatar: string | undefined, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  addReplyToComment: (postId: string, commentId: string, userId: string, userName: string, userAvatar: string | undefined, content: string) => Promise<void>;
  deleteReplyFromComment: (postId: string, commentId: string, replyId: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  addGuestLike: (postId: string, guestId: string, guestName: string) => Promise<void>;
  removeGuestLike: (postId: string, guestId: string) => Promise<void>;
  hasDeviceLiked: (postId: string) => boolean;
  toggleDeviceLike: (postId: string) => Promise<void>;
  getTotalComments: () => number;
  getTotalLikes: () => number;
  getPostComments: (postId: string) => BlogComment[];
  hasUserLiked: (postId: string, userId: string) => boolean;
}

// Generate a unique device ID
const generateDeviceId = () => {
  return 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Sample blog posts with reset view counts
const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Jak skutecznie pozycjonować stronę internetową w 2023 roku?',
    slug: 'jak-skutecznie-pozycjonowac-strone-internetowa',
    excerpt: 'Poznaj najnowsze trendy i strategie SEO, które pomogą Twojej stronie osiągnąć wysokie pozycje w wyszukiwarkach.',
    content: `
      <h2>Wprowadzenie do pozycjonowania</h2>
      <p>Pozycjonowanie stron internetowych jest kluczowym elementem strategii marketingowej każdego biznesu online. W 2023 roku algorytmy Google stają się coraz bardziej zaawansowane, co wymaga od nas stosowania bardziej kompleksowych i przemyślanych strategii SEO.</p>
      
      <h2>Najważniejsze czynniki rankingowe</h2>
      <p>Google wykorzystuje ponad 200 czynników do oceny i rankingowania stron internetowych. Wśród najważniejszych możemy wyróżnić:</p>
      <ul>
        <li>Jakość i unikalność treści</li>
        <li>User Experience (UX)</li>
        <li>Core Web Vitals</li>
        <li>Linki przychodzące</li>
        <li>Mobile-friendly design</li>
      </ul>
      
      <h2>Content is King</h2>
      <p>Treść nadal pozostaje królem w świecie SEO. Tworzenie wartościowych, unikalnych i odpowiadających na potrzeby użytkowników treści to podstawa skutecznego pozycjonowania.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    date: '2023-06-15T12:00:00Z',
    views: 0,
    author: 'Jan Kowalski',
    categories: ['SEO', 'Marketing Cyfrowy'],
    tags: ['pozycjonowanie', 'SEO', 'Google', 'treści'],
    comments: [],
    likes: [],
    guestLikes: [],
    deviceLikes: []
  },
  {
    id: '2',
    title: 'Responsywne strony internetowe - dlaczego są niezbędne?',
    slug: 'responsywne-strony-internetowe-dlaczego-sa-niezbedne',
    excerpt: 'Dowiedz się, dlaczego responsywny design jest kluczowy dla sukcesu Twojej witryny w erze mobile-first.',
    content: `
      <h2>Co to jest responsywny design?</h2>
      <p>Responsywny design to podejście do projektowania stron internetowych, które zapewnia optymalne wyświetlanie strony na różnych urządzeniach - od komputerów stacjonarnych po smartfony i tablety.</p>
      
      <h2>Dlaczego responsywność jest ważna?</h2>
      <p>W obecnych czasach ponad 50% ruchu w internecie pochodzi z urządzeń mobilnych. Google stosuje indeksowanie mobile-first, co oznacza, że wersja mobilna Twojej strony jest priorytetowa dla algorytmów wyszukiwarki.</p>
      
      <h2>Korzyści z responsywnego designu</h2>
      <ul>
        <li>Lepsze doświadczenie użytkownika</li>
        <li>Wyższe pozycje w wyszukiwarkach</li>
        <li>Niższy współczynnik odrzuceń</li>
        <li>Większa konwersja</li>
        <li>Oszczędność czasu i pieniędzy na utrzymanie strony</li>
      </ul>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    date: '2023-05-22T10:30:00Z',
    views: 0,
    author: 'Anna Nowak',
    categories: ['Web Development', 'UX Design'],
    tags: ['responsywność', 'mobile-first', 'design', 'UX'],
    comments: [],
    likes: [],
    guestLikes: [],
    deviceLikes: []
  },
  {
    id: '3',
    title: 'Strona internetowa: jak stworzyć, uruchomić i rozwijać własną witrynę',
    slug: 'strona-internetowa-jak-stworzyc-uruchomic-rozwijac-wlasna-witryne',
    excerpt: 'Chcesz zaistnieć jako twórca, czy sprzedawać produkty online? Własna witryna to fundament obecności w sieci.',
    content: `
      <h2>Od czego zacząć tworzenie strony internetowej?</h2>
      <p>Tworzenie własnej strony internetowej może wydawać się skomplikowanym zadaniem, ale postępując krok po kroku, można osiągnąć świetne rezultaty nawet bez specjalistycznej wiedzy technicznej.</p>
      
      <h2>Wybór domeny i hostingu</h2>
      <p>Pierwszym krokiem jest wybór odpowiedniej nazwy domeny, która będzie odzwierciedlać charakter Twojej działalności. Następnie potrzebujesz hostingu - miejsca, gdzie będą przechowywane pliki Twojej strony.</p>
      
      <h2>Projektowanie i rozwój</h2>
      <ul>
        <li>Określ cele swojej strony</li>
        <li>Wybierz odpowiedni system CMS (np. WordPress, Wix, Shopify)</li>
        <li>Zaprojektuj strukturę strony</li>
        <li>Stwórz wartościowe treści</li>
        <li>Zadbaj o SEO od samego początku</li>
      </ul>
      
      <h2>Promocja i rozwijanie witryny</h2>
      <p>Stworzenie strony to dopiero początek. Aby osiągnąć sukces, musisz regularnie aktualizować treści, monitorować statystyki i dostosowywać strategię do zmieniających się trendów i potrzeb użytkowników.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    date: '2023-05-13T09:15:00Z',
    views: 0,
    author: 'Piotr Nowicki',
    categories: ['Tworzenie stron internetowych'],
    tags: ['własna strona', 'projektowanie', 'rozwój', 'domena', 'hosting'],
    comments: [],
    likes: [],
    guestLikes: [],
    deviceLikes: []
  }
];

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      posts: initialPosts || [], // Ensure posts is never undefined
      deviceId: generateDeviceId(),
      loading: false,
      error: null,
      
      fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
          // Check if we have posts in Supabase
          const { data: blogPosts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('date', { ascending: false });
          
          if (error) throw error;
          
          // If we have posts in Supabase, convert them to our BlogPost structure
          if (blogPosts && blogPosts.length > 0) {
            // Format posts from Supabase to match our structure
            const formattedPosts: BlogPost[] = blogPosts.map(post => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.summary || '',
              content: post.content,
              featuredImage: post.featured_image || '',
              date: post.date || new Date().toISOString(),
              views: post.views || 0,
              author: post.author_id || 'Anonymous',
              categories: post.categories || [],
              tags: post.tags || [],
              comments: [], // We'll fetch comments separately if needed
              likes: [], // We'll fetch likes separately if needed
              guestLikes: [],
              deviceLikes: []
            }));
            
            set({ posts: formattedPosts });
          } else {
            // If no posts in Supabase yet, initialize with our sample posts
            // Upload initial posts to Supabase
            const initialPromises = initialPosts.map(async (post) => {
              const { error } = await supabase
                .from('blog_posts')
                .insert({
                  id: post.id,
                  title: post.title,
                  slug: post.slug,
                  summary: post.excerpt,
                  content: post.content,
                  featured_image: post.featuredImage,
                  date: post.date,
                  views: post.views,
                  author_id: post.author,
                  categories: post.categories,
                  tags: post.tags
                });
              
              if (error) console.error("Error initializing post:", error);
            });
            
            await Promise.all(initialPromises);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ loading: false });
        }
      },
      
      addPost: async (post) => {
        set({ loading: true, error: null });
        try {
          // Add post to Supabase
          const { data: newPost, error } = await supabase
            .from('blog_posts')
            .insert({
              title: post.title,
              slug: post.slug,
              summary: post.excerpt,
              content: post.content,
              featured_image: post.featuredImage,
              date: new Date().toISOString(),
              author_id: post.author,
              categories: post.categories,
              tags: post.tags,
              views: 0
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // Add to local state
          const blogPost: BlogPost = {
            id: newPost.id,
            title: newPost.title,
            slug: newPost.slug,
            excerpt: newPost.summary || '',
            content: newPost.content,
            featuredImage: newPost.featured_image || '',
            date: newPost.date || new Date().toISOString(),
            views: 0,
            author: newPost.author_id || 'Anonymous',
            categories: newPost.categories || [],
            tags: newPost.tags || [],
            comments: [],
            likes: [],
            guestLikes: [],
            deviceLikes: []
          };
          
          set((state) => ({
            posts: [...state.posts, blogPost]
          }));
        } catch (error) {
          console.error("Error adding post:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ loading: false });
        }
      },
      
      updatePost: async (id, updatedPost) => {
        set({ loading: true, error: null });
        try {
          // Update post in Supabase
          const updateData: any = {};
          if (updatedPost.title) updateData.title = updatedPost.title;
          if (updatedPost.slug) updateData.slug = updatedPost.slug;
          if (updatedPost.excerpt) updateData.summary = updatedPost.excerpt;
          if (updatedPost.content) updateData.content = updatedPost.content;
          if (updatedPost.featuredImage) updateData.featured_image = updatedPost.featuredImage;
          if (updatedPost.author) updateData.author_id = updatedPost.author;
          if (updatedPost.categories) updateData.categories = updatedPost.categories;
          if (updatedPost.tags) updateData.tags = updatedPost.tags;
          if (updatedPost.views) updateData.views = updatedPost.views;
          
          const { error } = await supabase
            .from('blog_posts')
            .update(updateData)
            .eq('id', id);
          
          if (error) throw error;
          
          // Update local state
          set((state) => ({
            posts: state.posts.map((post) => 
              post.id === id ? { ...post, ...updatedPost } : post
            )
          }));
        } catch (error) {
          console.error("Error updating post:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ loading: false });
        }
      },
      
      deletePost: async (id) => {
        set({ loading: true, error: null });
        try {
          // Delete post from Supabase
          const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          // Update local state
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id)
          }));
        } catch (error) {
          console.error("Error deleting post:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ loading: false });
        }
      },
      
      incrementView: async (id) => {
        try {
          // Get current post to increment views
          const post = get().posts.find(p => p.id === id);
          if (!post) return;
          
          const newViews = (post.views || 0) + 1;
          
          // Update views in Supabase
          const { error } = await supabase
            .from('blog_posts')
            .update({ views: newViews })
            .eq('id', id);
          
          if (error) throw error;
          
          // Update local state
          set((state) => ({
            posts: state.posts.map((post) => 
              post.id === id ? { ...post, views: newViews } : post
            )
          }));
        } catch (error) {
          console.error("Error incrementing view:", error);
        }
      },
      
      resetStats: async () => {
        try {
          // Reset stats in Supabase
          const { error } = await supabase
            .from('blog_posts')
            .update({ views: 0 })
            .neq('id', '');
          
          if (error) throw error;
          
          // Reset local state
          set((state) => ({
            posts: state.posts.map(post => ({
              ...post,
              views: 0,
              likes: [],
              guestLikes: [],
              deviceLikes: []
            }))
          }));
        } catch (error) {
          console.error("Error resetting stats:", error);
        }
      },
      
      getPostBySlug: (slug: string) => {
        const { posts } = get();
        return (posts || []).find((post) => post.slug === slug);
      },

      addComment: async (postId, userId, userName, userAvatar, content) => {
        try {
          // Add comment to Supabase
          const { data: newComment, error } = await supabase
            .from('blog_comments')
            .insert({
              post_id: postId,
              user_id: userId,
              content
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // Update local state
          set((state) => {
            const post = state.posts.find(p => p.id === postId);
            if (!post) return state;

            const blogComment: BlogComment = {
              id: newComment.id,
              postId,
              userId,
              userName,
              userAvatar,
              content,
              date: newComment.created_at || new Date().toISOString(),
              replies: []
            };
            
            // Add notification for new comment
            useNotifications.getState().addNotification({
              title: 'Nowy komentarz',
              message: `${userName} dodał komentarz do "${post.title}"`,
              type: 'comment_added' as NotificationType,
              status: 'unread',
              fromUserId: userId,
              fromUserName: userName,
              targetId: postId,
              targetType: 'post'
            });

            return {
              posts: state.posts.map((p) => 
                p.id === postId 
                  ? { ...p, comments: [...(p.comments || []), blogComment] } 
                  : p
              )
            };
          });
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      },

      deleteComment: async (postId, commentId) => {
        try {
          // Delete comment from Supabase
          const { error } = await supabase
            .from('blog_comments')
            .delete()
            .eq('id', commentId);
          
          if (error) throw error;
          
          // Update local state
          set((state) => ({
            posts: state.posts.map((post) => 
              post.id === postId 
                ? { ...post, comments: post.comments && post.comments.filter(comment => comment.id !== commentId) } 
                : post
            )
          }));
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      },
      
      addReplyToComment: async (postId, commentId, userId, userName, userAvatar, content) => {
        // For now, just update local state
        // In a future implementation, you could add a replies table in Supabase
        set((state) => {
          const post = state.posts.find(p => p.id === postId);
          if (!post) return state;
          
          const comment = post.comments?.find(c => c.id === commentId);
          if (!comment) return state;
          
          const newReply: CommentReply = {
            id: Date.now().toString(),
            commentId,
            userId,
            userName,
            userAvatar,
            content,
            date: new Date().toISOString()
          };
          
          // Add notification for new reply
          useNotifications.getState().addNotification({
            title: 'Nowa odpowiedź',
            message: `${userName} odpowiedział na Twój komentarz w "${post.title}"`,
            type: 'comment_added' as NotificationType,
            status: 'unread',
            fromUserId: userId,
            fromUserName: userName,
            targetId: postId,
            targetType: 'post'
          });
          
          return {
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { 
                    ...p, 
                    comments: p.comments?.map(c => 
                      c.id === commentId 
                        ? { 
                            ...c, 
                            replies: [...(c.replies || []), newReply] 
                          } 
                        : c
                    )
                  } 
                : p
            )
          };
        });
      },
      
      deleteReplyFromComment: async (postId, commentId, replyId) => {
        // For now, just update local state
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId 
              ? { 
                  ...post, 
                  comments: post.comments?.map(comment => 
                    comment.id === commentId 
                      ? {
                          ...comment,
                          replies: comment.replies?.filter(reply => reply.id !== replyId)
                        }
                      : comment
                  ) 
                } 
              : post
          )
        }));
      },

      toggleLike: async (postId, userId) => {
        try {
          const post = get().posts.find(p => p.id === postId);
          if (!post) return;

          // Check if user already liked this post
          const { data: existingLikes, error: fetchError } = await supabase
            .from('blog_likes')
            .select()
            .eq('post_id', postId)
            .eq('user_id', userId);
          
          if (fetchError) throw fetchError;
          
          if (existingLikes && existingLikes.length > 0) {
            // Remove like
            const { error } = await supabase
              .from('blog_likes')
              .delete()
              .eq('post_id', postId)
              .eq('user_id', userId);
              
            if (error) throw error;
          } else {
            // Add like
            const { error } = await supabase
              .from('blog_likes')
              .insert({ post_id: postId, user_id: userId });
              
            if (error) throw error;
            
            // Add notification if it's a new like
            useNotifications.getState().addNotification({
              title: 'Nowe polubienie',
              message: `Użytkownik polubił "${post.title}"`,
              type: 'like_added' as NotificationType,
              status: 'unread',
              fromUserId: userId,
              fromUserName: "Użytkownik",
              targetId: postId,
              targetType: 'post'
            });
          }
          
          // Update local state with local likes only (we'll fetch from DB for display)
          const likes = post.likes || [];
          const hasLiked = likes.includes(userId);
          
          const updatedLikes = hasLiked
            ? likes.filter(id => id !== userId)
            : [...likes, userId];
          
          set((state) => ({
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { ...p, likes: updatedLikes } 
                : p
            )
          }));
        } catch (error) {
          console.error("Error toggling like:", error);
        }
      },
      
      addGuestLike: async (postId, guestId, guestName) => {
        // Guest likes are only stored locally for now
        set((state) => {
          const post = state.posts.find(p => p.id === postId);
          if (!post) return state;

          const newGuestLike: GuestLike = {
            id: guestId,
            name: guestName
          };
          
          // Ensure post.guestLikes exists before accessing it
          const guestLikes = post.guestLikes || [];
          
          // Add notification for new like
          useNotifications.getState().addNotification({
            title: 'Nowe polubienie',
            message: `Gość "${guestName || "Gość"}" polubił "${post.title}"`,
            type: 'like_added' as NotificationType,
            status: 'unread',
            fromUserId: "guest",
            fromUserName: guestName || "Gość",
            targetId: postId,
            targetType: 'post'
          });
          
          return {
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { ...p, guestLikes: [...guestLikes, newGuestLike] } 
                : p
            )
          };
        });
      },
      
      removeGuestLike: async (postId, guestId) => {
        // Guest likes are only stored locally for now
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId && post.guestLikes 
              ? { 
                  ...post, 
                  guestLikes: post.guestLikes.filter(like => like.id !== guestId) 
                } 
              : post
          )
        }));
      },
      
      hasDeviceLiked: (postId) => {
        const { deviceId, posts } = get();
        const post = posts.find(p => p.id === postId);
        return post?.deviceLikes ? post.deviceLikes.includes(deviceId) : false;
      },
      
      toggleDeviceLike: async (postId) => {
        const { deviceId } = get();
        
        set((state) => {
          const post = state.posts.find(p => p.id === postId);
          if (!post) return state;
          
          // Ensure deviceLikes exists
          const deviceLikes = post.deviceLikes || [];
          const hasLiked = deviceLikes.includes(deviceId);
          
          const updatedDeviceLikes = hasLiked
            ? deviceLikes.filter(id => id !== deviceId)
            : [...deviceLikes, deviceId];
          
          // Add notification if it's a new like (not a removal)
          if (!hasLiked) {
            useNotifications.getState().addNotification({
              title: 'Nowe polubienie',
              message: `Gość polubił "${post.title}"`,
              type: 'like_added' as NotificationType,
              status: 'unread',
              fromUserId: "guest",
              fromUserName: "Gość",
              targetId: postId,
              targetType: 'post'
            });
          }
          
          return {
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { ...p, deviceLikes: updatedDeviceLikes } 
                : p
            )
          };
        });
      },

      getTotalComments: () => {
        const { posts } = get();
        let total = 0;
        (posts || []).forEach(post => {
          // Count main comments
          total += (post.comments?.length || 0);
          
          // Count replies
          post.comments?.forEach(comment => {
            total += (comment.replies?.length || 0);
          });
        });
        return total;
      },

      getTotalLikes: () => {
        const { posts } = get();
        return (posts || []).reduce((total, post) => 
          total + ((post.likes?.length) || 0) + ((post.guestLikes?.length) || 0) + ((post.deviceLikes?.length) || 0), 0);
      },

      getPostComments: (postId) => {
        const { posts } = get();
        const post = posts.find(p => p.id === postId);
        return post && post.comments ? post.comments : [];
      },

      hasUserLiked: (postId, userId) => {
        const { posts } = get();
        const post = posts.find(p => p.id === postId);
        // Add null check before accessing post.likes
        return post && post.likes ? post.likes.includes(userId) : false;
      }
    }),
    {
      name: 'blog-storage',
    }
  )
);

// Initialize posts from Supabase on app load
setTimeout(() => {
  useBlogStore.getState().fetchPosts();
}, 0);

