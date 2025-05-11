
import React from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import CommentHeader from './CommentHeader';
import { useTheme } from '@/utils/themeContext';

export interface Comment {
  id: string;
  author: string;
  authorImage?: string;
  date: string;
  content: string;
  likes: number;
  userLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  showControls?: boolean;
  onAddComment?: (content: string) => Promise<boolean>;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => Promise<boolean>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  showControls = true,
  onAddComment,
  onLikeComment,
  onReplyComment,
}) => {
  const { theme } = useTheme();

  return (
    <div className={`w-full max-w-4xl mx-auto mb-16 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
      <CommentHeader commentCount={comments.length} />
      
      {showControls && onAddComment && (
        <CommentForm onSubmit={onAddComment} />
      )}
      
      <CommentList 
        comments={comments} 
        onLikeComment={onLikeComment} 
        onReplyComment={onReplyComment}
        showControls={showControls}
      />
    </div>
  );
};

export default CommentSection;
