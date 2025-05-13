
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
import { addCommentNotification, sendApprovalRequest } from '@/utils/notificationHelpers';

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
  const [isGuestCommentDialogOpen, setIsGuestCommentDialogOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestComment, setGuestComment] = useState('');

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
      // Show dialog for guest comment instead of redirecting to login
      setGuestComment(content);
      setIsGuestCommentDialogOpen(true);
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

  const handleGuestComment = async () => {
    if (!guestName.trim() || !guestComment.trim()) {
      toast({
        title: 'Błąd',
        description: 'Imię i komentarz są wymagane',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Send approval request notification to admin
      await sendApprovalRequest(
        'guest', // fromUserId
        guestName, // fromUserName
        postId, // targetId
        'comment', // targetType
        'Prośba o zatwierdzenie komentarza gościa',
        `${guestName} chce dodać komentarz do postu "${postTitle}": "${guestComment}"`
      );
      
      toast({
        title: 'Komentarz wysłany',
        description: 'Twój komentarz został wysłany do zatwierdzenia przez administratora',
      });
      
      // Reset form
      setGuestName('');
      setGuestComment('');
      setIsGuestCommentDialogOpen(false);
    } catch (err) {
      console.error('Error sending guest comment:', err);
      toast({
        title: 'Błąd',
        description: 'Wystąpił problem podczas wysyłania komentarza',
        variant: 'destructive',
      });
    }
  };

  const handleReportComment = (commentId: string) => {
    console.log(`Reporting comment with ID: ${commentId}`);
    toast({
      title: 'Komentarz zgłoszony',
      description: 'Dziękujemy za zgłoszenie. Sprawdzimy ten komentarz.',
    });
  };

  // Dialog for guest comments
  const GuestCommentDialog = () => {
    if (!isGuestCommentDialogOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-premium-dark border border-premium-light/20 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">Dodaj komentarz jako gość</h3>
          <p className="mb-4 text-premium-light/70">
            Twój komentarz zostanie wysłany do zatwierdzenia przez administratora.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium mb-1">
                Twoje imię
              </label>
              <input
                id="guestName"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-2 bg-premium-light/5 border border-premium-light/20 rounded-md text-white hover:bg-black hover:text-white"
                placeholder="Imię"
              />
            </div>
            <div>
              <label htmlFor="guestComment" className="block text-sm font-medium mb-1">
                Twój komentarz
              </label>
              <textarea
                id="guestComment"
                value={guestComment}
                onChange={(e) => setGuestComment(e.target.value)}
                className="w-full p-2 bg-premium-light/5 border border-premium-light/20 rounded-md text-white min-h-20 hover:bg-black hover:text-white"
                placeholder="Twój komentarz..."
                readOnly
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsGuestCommentDialogOpen(false)}
                className="hover:bg-black hover:text-white"
              >
                Anuluj
              </Button>
              <Button onClick={handleGuestComment} className="hover:bg-black hover:text-white">
                Wyślij
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
      
      {/* Guest comment dialog */}
      <GuestCommentDialog />
    </div>
  );
};

export default CommentSection;
