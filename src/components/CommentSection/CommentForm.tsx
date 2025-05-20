
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/utils/themeContext';
import { useToast } from '@/hooks/use-toast';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  placeholder?: string;
  buttonText?: string;
  isReply?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "Napisz komentarz...",
  buttonText = "Dodaj komentarz",
  isReply = false,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that content is not empty
    if (!content.trim()) {
      toast({
        title: "Błąd",
        description: "Komentarz nie może być pusty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(content);
      if (success) {
        setContent('');
        toast({
          title: isReply ? "Odpowiedź dodana" : "Komentarz dodany",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się dodać komentarza",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-32"
        required
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className={isReply ? 'bg-premium-blue hover:bg-premium-blue/90' : ''}
        >
          {isSubmitting ? 'Wysyłanie...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
