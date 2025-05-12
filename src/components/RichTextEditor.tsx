
import React, { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Link, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor = ({ value, onChange, placeholder = '', rows = 15 }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  
  const insertAtCursor = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };
  
  const formatText = (format: 'bold' | 'italic' | 'code') => {
    const formats = {
      bold: ['<strong>', '</strong>'],
      italic: ['<em>', '</em>'],
      code: ['<code>', '</code>']
    };
    
    insertAtCursor(formats[format][0], formats[format][1]);
  };
  
  const insertList = (ordered: boolean) => {
    const listTag = ordered ? 'ol' : 'ul';
    insertAtCursor(`<${listTag}>\n  <li>`, `</li>\n</${listTag}>`);
  };
  
  const insertImage = () => {
    if (!imageUrl) return;
    insertAtCursor(`<img src="${imageUrl}" alt="Image" class="my-4 rounded-md w-full max-w-lg mx-auto" />`);
    setImageUrl('');
  };
  
  const insertLink = () => {
    if (!linkUrl) return;
    const text = linkText || linkUrl;
    insertAtCursor(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-premium-purple hover:underline">`, `${text}</a>`);
    setLinkUrl('');
    setLinkText('');
  };
  
  return (
    <div className="border rounded-md border-gray-200 dark:border-premium-light/10">
      <div className="p-2 border-b border-gray-200 dark:border-premium-light/10 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          title="Pogrubienie (Bold)"
        >
          <Bold size={16} />
        </Button>
        <Button
          type="button" 
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          title="Kursywa (Italic)"
        >
          <Italic size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertList(false)}
          title="Lista punktowana"
        >
          <List size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertList(true)}
          title="Lista numerowana"
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('code')}
          title="Kod"
        >
          <Code size={16} />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Wstaw obrazek"
            >
              <ImageIcon size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Wstaw obrazek</h4>
                <p className="text-sm text-muted-foreground">
                  Podaj URL obrazka, który chcesz wstawić.
                </p>
              </div>
              <div className="grid gap-2">
                <Input 
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button onClick={insertImage} disabled={!imageUrl}>
                  Wstaw obrazek
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Wstaw link"
            >
              <Link size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Wstaw link</h4>
              </div>
              <div className="grid gap-2">
                <Input 
                  placeholder="URL: https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <Input 
                  placeholder="Tekst linku (opcjonalnie)"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
                <Button onClick={insertLink} disabled={!linkUrl}>
                  Wstaw link
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Textarea 
        ref={textareaRef}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        rows={rows}
        className="font-mono text-sm border-0 rounded-t-none bg-slate-950"
      />
    </div>
  );
};

export default RichTextEditor;
