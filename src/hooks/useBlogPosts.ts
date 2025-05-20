import { useState, useEffect } from 'react';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  slug: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_at?: string;
  author_id?: string;
}

// Sample fallback data - used when Firebase connection fails
const fallbackPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Przykładowy post',
    content: 'To jest przykładowy post.',
    excerpt: 'Krótki opis posta',
    slug: 'przykladowy-post',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published: true,
    published_at: new Date().toISOString()
  }
];

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsCollection = collection(db, 'blog_posts');
      const postsQuery = query(postsCollection, orderBy('created_at', 'desc'));
      const postsSnapshot = await getDocs(postsQuery);
      const postsList = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsList);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
      setPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPost = {
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'blog_posts'), newPost);
      const createdPost = { ...newPost, id: docRef.id };
      setPosts(prevPosts => [createdPost, ...prevPosts]);
      return createdPost;
    } catch (err) {
      console.error('Error creating post:', err);
      throw new Error('Failed to create post');
    }
  };

  const updatePost = async (postId: string, postData: Partial<BlogPost>) => {
    try {
      const postRef = doc(db, 'blog_posts', postId);
      const updateData = {
        ...postData,
        updated_at: new Date().toISOString()
      };
      await updateDoc(postRef, updateData);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, ...updateData } : post
        )
      );
    } catch (err) {
      console.error('Error updating post:', err);
      throw new Error('Failed to update post');
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw new Error('Failed to delete post');
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refreshPosts: fetchPosts
  };
}
