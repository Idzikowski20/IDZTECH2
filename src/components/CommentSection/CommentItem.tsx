
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare } from 'lucide-react';
import { Comment } from './index';
import { Button } from '@/components/ui/button';
import CommentForm from './CommentForm';
import { useTheme } from '@/utils/themeContext';
import { supabase } from '@/utils/supabaseClient';

interface CommentItemProps {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => Promise<boolean>;
  showControls?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onReply,
  showControls = true
}) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const { theme } = useTheme();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  // Fetch user profile picture from Supabase profiles
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (comment.authorId) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('profilePicture, name')
            .eq('id', comment.authorId)
            .single();
            
          if (!error && data) {
            setProfilePicture(data.profilePicture);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [comment.authorId]);
  
  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
    }
  };
  
  const handleReplySubmit = async (content: string) => {
    if (onReply) {
      const success = await onReply(comment.id, content);
      if (success) {
        setReplyOpen(false);
        return true;
      }
      return false;
    }
    return false;
  };

  // Use profile picture from Supabase if available, otherwise fall back to the one provided in the comment
  const avatarSrc = profilePicture || comment.authorImage;
  const authorInitials = comment.author.slice(0, 2).toUpperCase();

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={avatarSrc || ''} alt={comment.author} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-medium">{comment.author}</span>
              <span className={`text-xs ml-2 ${theme === 'light' ? 'text-gray-500' : 'text-premium-light/50'}`}>{comment.date}</span>
            </div>
          </div>
          
          <p className={`${theme === 'light' ? 'text-gray-800' : 'text-premium-light/90'}`}>
            {comment.content}
          </p>
          
          {showControls && (
            <div className="flex items-center mt-3 space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs ${
                  comment.userLiked 
                    ? 'text-red-500' 
                    : `${theme === 'light' ? 'text-gray-600 hover:text-black' : 'text-premium-light/70 hover:text-white'}`
                }`}
              >
                <Heart size={14} className={comment.userLiked ? 'fill-red-500' : ''} />
                <span>{comment.likes}</span>
              </button>
              
              {onReply && (
                <button
                  onClick={() => setReplyOpen(!replyOpen)}
                  className={`flex items-center gap-1 text-xs ${theme === 'light' ? 'text-gray-600 hover:text-black' : 'text-premium-light/70 hover:text-white'}`}
                >
                  <MessageSquare size={14} />
                  <span>Odpowiedz</span>
                </button>
              )}
            </div>
          )}
          
          {replyOpen && onReply && (
            <div className="mt-4">
              <CommentForm 
                onSubmit={handleReplySubmit} 
                placeholder="Napisz odpowiedź..."
                buttonText="Odpowiedz"
                isReply
              />
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-2 pl-4 border-l border-gray-200 dark:border-gray-800 space-y-6">
              {comment.replies.map((reply) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  onLike={onLike} 
                  showControls={showControls}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
