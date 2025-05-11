
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '@/utils/themeContext';

interface CommentHeaderProps {
  commentCount: number;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ commentCount }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <MessageSquare className="h-5 w-5 text-premium-purple" />
      <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
        Komentarze {commentCount > 0 && `(${commentCount})`}
      </h3>
    </div>
  );
};

export default CommentHeader;
