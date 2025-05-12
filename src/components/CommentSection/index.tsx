import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import CommentHeader from './CommentHeader';
import { useAuth } from '@/utils/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { addCommentNotification } from '@/utils/notificationHelpers';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
}

interface CommentSectionProps {
  postId: string;
  postTitle: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, postTitle }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Fetch comments with user information
        const { data, error } = await supabase
          .from('blog_comments')
          .select(`
            id, 
            content, 
            created_at, 
            user_id,
            profiles:user_id (name, lastName, profilePicture, role)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching comments:', error);
          setError('Nie udało się pobrać komentarzy');
          setLoading(false);
          return;
        }

        // Transform the data to match our Comment interface
        const transformedComments: Comment[] = data.map(comment => {
          let fullName = 'Użytkownik';
          if (comment.profiles) {
            const profiles = comment.profiles as any;
            if (profiles.name) {
              fullName = profiles.name;
              if (profiles.lastName) {
                fullName += ` ${profiles.lastName}`;
              }
            }
          }
          
          return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.created_at,
            userId: comment.user_id,
            userName: fullName,
            userAvatar: comment.profiles ? (comment.profiles as any).profilePicture || '' : '',
            userRole: comment.profiles ? (comment.profiles as any).role || '' : ''
          };
        });

        setComments(transformedComments);
      } catch (err) {
        console.error('Error in fetchComments:', err);
        setError('Wystąpił problem podczas pobierania komentarzy');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async (content: string) => {
    if (!user) {
      toast({
        title: 'Musisz być zalogowany',
        description: 'Zaloguj się aby dodać komentarz',
      });
      navigate('/login');
      return false;
    }

    try {
      // Insert comment into database
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([
          { content, post_id: postId, user_id: user.id }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się dodać komentarza',
          variant: 'destructive',
        });
        return false;
      }

      // Get user information
      const { data: userData } = await supabase
        .from('profiles')
        .select('name, lastName, profilePicture, role')
        .eq('id', user.id)
        .single();

      // Construct full name
      let fullName = 'Użytkownik';
      if (userData) {
        if (userData.name) {
          fullName = userData.name;
          if (userData.lastName) {
            fullName += ` ${userData.lastName}`;
          }
        } else if (user.email) {
          fullName = user.email.split('@')[0];
        }
      } else if (user.email) {
        fullName = user.email.split('@')[0];
      }

      // Add the new comment to state
      const newComment = {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
        userId: user.id,
        userName: fullName,
        userAvatar: userData?.profilePicture || '',
        userRole: userData?.role || ''
      };

      setComments(prevComments => [newComment, ...prevComments]);

      // Send notification
      await addCommentNotification(
        postId, 
        postTitle, 
        fullName,
        user.id
      );

      toast({
        title: 'Komentarz dodany',
        description: 'Twój komentarz został pomyślnie dodany',
      });
      
      return true;
    } catch (err) {
      console.error('Error in handleAddComment:', err);
      toast({
        title: 'Błąd',
        description: 'Wystąpił problem podczas dodawania komentarza',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleReportComment = (commentId: string) => {
    console.log(`Reporting comment with ID: ${commentId}`);
    toast({
      title: 'Komentarz zgłoszony',
      description: 'Dziękujemy za zgłoszenie. Sprawdzimy ten komentarz.',
    });
  };

  return (
    <div className="py-6">
      <CommentHeader commentCount={comments.length} />
      
      <CommentForm onSubmit={handleAddComment} />
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2">Bądź pierwszym, który skomentuje ten artykuł</p>
        </div>
      ) : (
        <div className="space-y-1 divide-y">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              id={comment.id}
              author={{
                name: comment.userName || 'Użytkownik',
                profilePicture: comment.userAvatar,
                role: comment.userRole
              }}
              content={comment.content}
              createdAt={comment.createdAt}
              onReport={handleReportComment}
              currentUserId={user?.id}
              authorId={comment.userId}
            />
          ))}
        </div>
      )}
      
      {!loading && comments.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="hover:bg-black hover:text-white">
            Załaduj więcej
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
