
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Wpisz treść...',
  rows = 10
}: RichTextEditorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="rich-text-editor border border-premium-light/10 rounded-md overflow-hidden">
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-950 resize-y min-h-[200px] p-4 focus:ring-1 focus:ring-premium-purple"
      />
      <div className="bg-slate-900 p-2 border-t border-premium-light/10">
        <div className="text-xs text-premium-light/60">
          Edytor HTML - wspiera znaczniki formatowania tekstu
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
