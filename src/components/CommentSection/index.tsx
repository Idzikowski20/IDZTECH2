
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/utils/notifications';
import { Button } from '@/components/ui/button';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import CommentHeader from './CommentHeader';
import { CommentSectionProps } from '../CommentSection';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string | null;
  author: string;
  avatar: string | null;
  status: string;
  isGuest: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, postTitle }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestComment, setGuestComment] = useState('');

  // Fetch comments whenever postId changes
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // Query comments for this post
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          id, 
          content, 
          created_at, 
          user_id, 
          guest_name,
          status,
          profiles:user_id (
            name,
            lastName,
            profilePicture
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to fit our Comment interface
      const transformedComments: Comment[] = data.map(comment => {
        let fullName = 'Użytkownik';
        let avatar = null;
        let isGuest = false;

        if (comment.profiles) {
          const profile = comment.profiles as any;
          if (profile.name) {
            fullName = profile.name;
            if (profile.lastName) {
              fullName += ` ${profile.lastName}`;
            }
          }
          avatar = profile.profilePicture || null;
        } else if (comment.guest_name) {
          fullName = comment.guest_name;
          isGuest = true;
        }
        
        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user_id: comment.user_id,
          author: fullName,
          avatar: avatar,
          status: comment.status || 'approved',
          isGuest
        };
      });
      
      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Nie udało się załadować komentarzy.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding new comment
  const handleAddComment = async (content: string) => {
    if (!content.trim()) {
      toast.error('Komentarz nie może być pusty');
      return;
    }
    
    try {
      // Build comment data based on user authentication state
      let commentData: any = {
        post_id: postId,
        content,
        status: 'approved' // Default status
      };
      
      if (user) {
        commentData.user_id = user.id;
      } else {
        // For guest comments
        if (!guestName.trim()) {
          toast.error('Podaj swoje imię');
          return;
        }
        commentData.guest_name = guestName;
      }
      
      // Insert comment into database
      const { data, error } = await supabase
        .from('blog_comments')
        .insert(commentData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Add notification about the new comment
      useNotifications.getState().addNotification({
        title: 'Nowy komentarz',
        message: `${user ? user.name : guestName} dodał komentarz do "${postTitle || 'postu'}"`,
        type: 'comment_added',
        status: 'unread',
        fromUserId: user ? user.id : 'guest',
        fromUserName: user ? user.name : guestName,
        targetId: postId,
        targetType: 'post'
      });
      
      // Refresh comments list
      fetchComments();
      
      // Reset form
      setGuestComment('');
      
      toast.success('Komentarz dodany pomyślnie');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Nie udało się dodać komentarza.');
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      fetchComments();
      toast.success('Komentarz usunięty');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Nie udało się usunąć komentarza.');
    }
  };
  
  // Check if user has admin rights
  const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');

  return (
    <div className="mt-12 pt-8 border-t border-premium-light/10">
      <CommentHeader commentsCount={comments.length} />
      
      <CommentForm 
        onSubmit={user ? handleAddComment : undefined}
        guestName={guestName}
        setGuestName={setGuestName}
        guestComment={guestComment}
        setGuestComment={setGuestComment}
        onGuestSubmit={handleAddComment}
        user={user}
      />
      
      <CommentList 
        comments={comments} 
        isAdmin={isAdmin}
        currentUserId={user?.id}
        onDeleteComment={handleDeleteComment}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CommentSection;
