import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditorWhiteText.css';
import { useTheme } from '@/utils/themeContext';

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
  const { theme } = useTheme();
  // Quill modules configuration - all available features
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  // Quill formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'align',
    'list', 'bullet', 'indent',
    'direction',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const minHeight = rows * 20; // Approximate height based on rows

  return (
    <div className="rich-text-editor border border-premium-light/10 rounded-md overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ height: `${Math.max(minHeight, 200)}px`, backgroundColor: '#0f172a', color: '#fff' }}
        className={theme === 'light' ? 'bg-slate-950 text-white' : 'bg-slate-950 text-white'}
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
