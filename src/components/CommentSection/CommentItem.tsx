
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare } from 'lucide-react';
import { Comment } from './index';
import { Button } from '@/components/ui/button';
import CommentForm from './CommentForm';
import { useTheme } from '@/utils/themeContext';

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

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={comment.authorImage} alt={comment.author} />
          <AvatarFallback>{comment.author.slice(0, 2).toUpperCase()}</AvatarFallback>
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
