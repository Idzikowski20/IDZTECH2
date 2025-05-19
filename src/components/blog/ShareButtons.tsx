
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title }) => {
  const { toast } = useToast();
  const currentUrl = window.location.href;
  
  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook size={16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter size={16} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={16} />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`
    },
    {
      name: 'Email',
      icon: <Mail size={16} />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(currentUrl)}`
    }
  ];
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Skopiowano!",
        description: "Link został skopiowany do schowka"
      });
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Udostępnij</h3>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              {link.icon}
              {link.name}
            </Button>
          </a>
        ))}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={copyToClipboard}
        >
          <LinkIcon size={16} />
          Kopiuj link
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
