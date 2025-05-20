
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/AuthProvider';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = React.useState('');

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Wymagane logowanie",
        description: "Musisz być zalogowany, aby dodać komentarz",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Pusty komentarz",
        description: "Komentarz nie może być pusty",
        variant: "destructive"
      });
      return;
    }

    // Simplified for now
    toast({
      title: "Komentarz dodany",
      description: "Twój komentarz został dodany"
    });
    setComment('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Komentarze</h3>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Napisz komentarz..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button 
          onClick={handleSubmitComment}
          disabled={!comment.trim()}
        >
          Dodaj komentarz
        </Button>
      </div>
      
      <div className="pt-4">
        <p className="text-premium-light/70 italic">Brak komentarzy. Bądź pierwszy!</p>
      </div>
    </div>
  );
};

export default CommentSection;
