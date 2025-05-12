
import React, { useEffect, useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import CommentHeader from './CommentHeader';
import { useTheme } from '@/utils/themeContext';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/utils/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { addCommentNotification } from '@/utils/notificationHelpers';

export interface Comment {
  id: string;
  author: string;
  authorId?: string;
  authorImage?: string;
  date: string;
  content: string;
  likes: number;
  userLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments?: Comment[];
  showControls?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments: initialComments,
  showControls = true
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [loading, setLoading] = useState(true);

  // Pobierz komentarze z Supabase
  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Pobierz komentarze dla posta
      const { data: commentsData, error } = await supabase
        .from('blog_comments')
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      // Pobierz polubienia komentarzy dla zalogowanego użytkownika
      let userLikes: Record<string, boolean> = {};
      if (user) {
        const { data: likesData } = await supabase
          .from('blog_likes')
          .select('id, post_id')
          .eq('user_id', user.id);

        if (likesData) {
          userLikes = likesData.reduce((acc, like) => {
            if (like.post_id) {
              acc[like.post_id] = true;
            }
            return acc;
          }, {} as Record<string, boolean>);
        }
      }

      // Pobierz liczbę polubień dla każdego komentarza
      const commentLikeCounts: Record<string, number> = {};
      for (const comment of commentsData || []) {
        const { count } = await supabase
          .from('blog_likes')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', comment.id);
        
        commentLikeCounts[comment.id] = count || 0;
      }

      // Pobierz dane użytkowników, którzy napisali komentarze
      const userProfiles: Record<string, { name: string, profilePicture: string }> = {};
      
      for (const comment of commentsData || []) {
        if (comment.user_id && !userProfiles[comment.user_id]) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, profilePicture')
            .eq('id', comment.user_id)
            .single();
          
          if (profile) {
            userProfiles[comment.user_id] = {
              name: profile.name || 'Użytkownik anonimowy',
              profilePicture: profile.profilePicture || null
            };
          }
        }
      }

      // Przekształć dane z Supabase na format używany przez nasz komponent
      const formattedComments: Comment[] = (commentsData || []).map(comment => {
        const userData = comment.user_id ? userProfiles[comment.user_id] : null;
        
        return {
          id: comment.id,
          authorId: comment.user_id,
          author: userData?.name || 'Użytkownik anonimowy',
          authorImage: userData?.profilePicture || null,
          content: comment.content,
          date: new Date(comment.created_at).toLocaleDateString('pl-PL'),
          likes: commentLikeCounts[comment.id] || 0,
          userLiked: !!userLikes[comment.id],
          replies: []
        };
      });

      setComments(formattedComments);
    } catch (error) {
      console.error('Error in fetchComments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dodaj nowy komentarz
  const handleAddComment = async (content: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany, aby dodawać komentarze',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // Pobierz tytuł posta dla powiadomienia
      const { data: postData } = await supabase
        .from('blog_posts')
        .select('title')
        .eq('id', postId)
        .single();

      // Dodaj komentarz do bazy danych
      const { data: commentData, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select('id, created_at')
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się dodać komentarza',
          variant: 'destructive'
        });
        return false;
      }

      // Dodaj powiadomienie o nowym komentarzu
      if (postData) {
        await addCommentNotification(
          postId,
          postData.title,
          user.name || 'Użytkownik',
          user.id
        );
      }

      // Dodaj nowy komentarz do lokalnego stanu
      const newComment: Comment = {
        id: commentData.id,
        author: user.name || 'Użytkownik',
        authorId: user.id,
        authorImage: user.profilePicture || undefined,
        content,
        date: new Date(commentData.created_at).toLocaleDateString('pl-PL'),
        likes: 0,
        userLiked: false
      };

      setComments(prevComments => [...prevComments, newComment]);
      
      toast({
        title: 'Sukces',
        description: 'Komentarz został dodany',
      });
      
      return true;
    } catch (error) {
      console.error('Error in handleAddComment:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać komentarza',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Dodaj like do komentarza
  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany, aby polubić komentarz',
        variant: 'destructive'
      });
      return;
    }

    try {
      const comment = comments.find(c => c.id === commentId);
      
      if (!comment) return;

      if (comment.userLiked) {
        // Usuń polubienie
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', commentId);

        if (error) {
          console.error('Error removing like:', error);
          toast({
            title: 'Błąd',
            description: 'Nie udało się usunąć polubienia',
            variant: 'destructive'
          });
          return;
        }

        // Aktualizuj lokalny stan
        setComments(prevComments => 
          prevComments.map(c => 
            c.id === commentId 
              ? { ...c, likes: c.likes - 1, userLiked: false }
              : c
          )
        );
      } else {
        // Dodaj polubienie
        const { error } = await supabase
          .from('blog_likes')
          .insert({
            user_id: user.id,
            post_id: commentId
          });

        if (error) {
          console.error('Error adding like:', error);
          toast({
            title: 'Błąd',
            description: 'Nie udało się dodać polubienia',
            variant: 'destructive'
          });
          return;
        }

        // Aktualizuj lokalny stan
        setComments(prevComments => 
          prevComments.map(c => 
            c.id === commentId 
              ? { ...c, likes: c.likes + 1, userLiked: true }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Error in handleLikeComment:', error);
    }
  };

  // Dodaj odpowiedź do komentarza
  const handleReplyComment = async (commentId: string, content: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Błąd',
        description: 'Musisz być zalogowany, aby odpowiedzieć na komentarz',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // W przyszłości można zaimplementować strukturę odpowiedzi,
      // na razie dodajemy jako zwykły komentarz
      return handleAddComment(content);
    } catch (error) {
      console.error('Error in handleReplyComment:', error);
      return false;
    }
  };

  // Pobierz komentarze przy montowaniu komponentu
  useEffect(() => {
    fetchComments();
    
    // Utwórz subskrypcję na zmiany komentarzy
    const channel = supabase
      .channel('comment-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'blog_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return (
    <div className={`w-full max-w-4xl mx-auto mb-16 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
      <CommentHeader commentCount={comments.length} />
      
      {showControls && user && (
        <CommentForm onSubmit={handleAddComment} />
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-premium-light/70">Ładowanie komentarzy...</p>
        </div>
      ) : (
        <CommentList 
          comments={comments} 
          onLikeComment={handleLikeComment} 
          onReplyComment={handleReplyComment}
          showControls={showControls}
        />
      )}
    </div>
  );
};

export default CommentSection;
