
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { Comment } from './index';
import { useTheme } from '@/utils/themeContext';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious,
  PaginationLink
} from '@/components/ui/pagination';

interface CommentListProps {
  comments: Comment[];
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => Promise<boolean>;
  showControls?: boolean;
  pageSize?: number;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onLikeComment, 
  onReplyComment,
  showControls = true,
  pageSize = 5
}) => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(comments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedComments = comments.slice(startIndex, endIndex);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-premium-light/70'}`}>
            Brak komentarzy. Bądź pierwszy!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {paginatedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={onLikeComment}
                onReply={onReplyComment}
                showControls={showControls}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={handlePrevPage} 
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-white hover:text-black'}`} 
                  />
                </PaginationItem>
                
                {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                  // Show at most 5 page numbers
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className={currentPage !== pageNum ? "hover:bg-white hover:text-black" : ""}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={handleNextPage} 
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-white hover:text-black'}`} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;
