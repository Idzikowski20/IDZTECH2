
import React from 'react';
import CommentItem from './CommentItem';
import { Comment } from './index';
import { useTheme } from '@/utils/themeContext';

interface CommentListProps {
  comments: Comment[];
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => Promise<boolean>;
  showControls?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onLikeComment, 
  onReplyComment,
  showControls = true
}) => {
  const { theme } = useTheme();

  return (
    <div className="mt-8 space-y-8">
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
            Brak komentarzy. Bądź pierwszy!
          </p>
        </div>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={onLikeComment}
            onReply={onReplyComment}
            showControls={showControls}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
