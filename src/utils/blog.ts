import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addPost: (post: Omit<BlogPost, 'id' | 'views' | 'date' | 'comments' | 'likes' | 'guestLikes' | 'deviceLikes'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  incrementView: (id: string) => void; 
  incrementViews: (id: string) => void; // Alias for incrementView
  resetStats: () => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  addComment: (postId: string, userId: string, userName: string, userAvatar: string | undefined, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  addReplyToComment: (postId: string, commentId: string, userId: string, userName: string, userAvatar: string | undefined, content: string) => void;
  deleteReplyFromComment: (postId: string, commentId: string, replyId: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  addGuestLike: (postId: string, guestId: string, guestName: string) => void;
  removeGuestLike: (postId: string, guestId: string) => void;
  hasDeviceLiked: (postId: string) => boolean;
  toggleDeviceLike: (postId: string) => void;
  getTotalComments: () => number;
  getTotalLikes: () => number;
  getPostComments: (postId: string) => BlogComment[];
  hasUserLiked: (postId: string, userId: string) => boolean;
  isPostLikedByUser: (postId: string) => boolean; // Simplified version
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
  }
];

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      posts: initialPosts || [], // Ensure posts is never undefined
      deviceId: generateDeviceId(),
      
      addPost: (post) => {
        const newPost: BlogPost = {
          ...post,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          views: 0,
          comments: [],
          likes: [],
          guestLikes: [],
          deviceLikes: []
        };
        
        set((state) => ({
          posts: [...state.posts, newPost]
        }));
      },
      
      updatePost: (id, updatedPost) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === id ? { ...post, ...updatedPost } : post
          )
        }));
      },
      
      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id)
        }));
      },
      
      incrementView: (id) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === id ? { ...post, views: post.views + 1 } : post
          )
        }));
      },
      
      // Alias for incrementView to handle renamed method
      incrementViews: (id) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === id ? { ...post, views: post.views + 1 } : post
          )
        }));
      },
      
      resetStats: () => {
        set((state) => ({
          posts: state.posts.map(post => ({
            ...post,
            views: 0,
            likes: [],
            guestLikes: [],
            deviceLikes: []
          }))
        }));
      },
      
      getPostBySlug: (slug: string) => {
        const { posts } = get();
        return (posts || []).find((post) => post.slug === slug);
      },

      addComment: (postId, userId, userName, userAvatar, content) => {
        set((state) => {
          const post = state.posts.find(p => p.id === postId);
          if (!post) return state;

          const newComment: BlogComment = {
            id: Date.now().toString(),
            postId,
            userId,
            userName,
            userAvatar,
            content,
            date: new Date().toISOString(),
            replies: []
          };
          
          return {
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { ...p, comments: [...(p.comments || []), newComment] } 
                : p
            )
          };
        });
      },

      deleteComment: (postId, commentId) => {
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId 
              ? { ...post, comments: post.comments && post.comments.filter(comment => comment.id !== commentId) } 
              : post
          )
        }));
      },
      
      addReplyToComment: (postId, commentId, userId, userName, userAvatar, content) => {
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
      
      deleteReplyFromComment: (postId, commentId, replyId) => {
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

      toggleLike: (postId, userId) => {
        set((state) => {
          const post = state.posts.find(p => p.id === postId);
          if (!post) return state;

          // Ensure post.likes exists before accessing it
          const likes = post.likes || [];
          const hasLiked = likes.includes(userId);
          
          const updatedLikes = hasLiked
            ? likes.filter(id => id !== userId)
            : [...likes, userId];
          
          return {
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { ...p, likes: updatedLikes } 
                : p
            )
          };
        });
      },
      
      addGuestLike: (postId, guestId, guestName) => {
        set((state) => {
          const post = state.posts.find(p => p.id === postId);
          if (!post) return state;

          const newGuestLike: GuestLike = {
            id: guestId,
            name: guestName
          };
          
          // Ensure post.guestLikes exists before accessing it
          const guestLikes = post.guestLikes || [];
          
          return {
            posts: state.posts.map((p) => 
              p.id === postId 
                ? { ...p, guestLikes: [...guestLikes, newGuestLike] } 
                : p
            )
          };
        });
      },
      
      removeGuestLike: (postId, guestId) => {
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
      
      toggleDeviceLike: (postId) => {
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
      },
      
      // Simplified version that just returns false for compatibility
      isPostLikedByUser: (postId) => {
        const { posts, deviceId } = get();
        const post = posts.find(p => p.id === postId);
        return post?.deviceLikes ? post.deviceLikes.includes(deviceId) : false;
      }
    }),
    {
      name: 'blog-storage',
    }
  )
);
