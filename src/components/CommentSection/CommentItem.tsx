
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Check, Flag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentItemProps {
  id: string;
  author: {
    name: string;
    profilePicture?: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  onReport?: (commentId: string) => void;
  currentUserId?: string;
  authorId?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  author,
  content,
  createdAt,
  onReport,
  currentUserId,
  authorId,
}) => {
  const formattedDate = formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true,
    locale: pl 
  });

  // Check if user has a special role to display verification badge
  const hasVerificationBadge = author.role && ['admin', 'blogger', 'moderator'].includes(author.role.toLowerCase());

  return (
    <div className="flex gap-3 py-4">
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10">
          {author.profilePicture ? (
            <AvatarImage src={author.profilePicture} alt={author.name} />
          ) : (
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          )}
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <p className="font-medium text-sm">{author.name}</p>
          {hasVerificationBadge && (
            <div className="ml-1 bg-blue-500 text-white rounded-full p-0.5" title={`Zweryfikowany ${author.role}`}>
              <Check className="h-3 w-3" />
            </div>
          )}
          <span className="text-xs text-slate-500 ml-2">{formattedDate}</span>
        </div>
        <p className="text-sm mt-1">{content}</p>
        {onReport && currentUserId !== authorId && (
          <button 
            onClick={() => onReport(id)} 
            className="text-xs text-slate-500 mt-2 flex items-center hover:text-slate-700 hover:underline"
          >
            <Flag className="h-3 w-3 mr-1" /> Zgłoś
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
