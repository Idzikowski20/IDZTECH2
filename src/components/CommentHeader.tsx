
import React from 'react';

export interface CommentHeaderProps {
  commentCount: number;
}

const CommentHeader = ({ commentCount }: CommentHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold">
        Komentarze{" "}
        <span className="text-muted-foreground text-sm font-normal">
          ({commentCount})
        </span>
      </h3>
    </div>
  );
};

export default CommentHeader;
