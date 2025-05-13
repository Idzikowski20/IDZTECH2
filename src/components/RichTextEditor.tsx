
import React, { useMemo, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Don't import highlight.js directly since we're loading it from CDN
// import hljs from 'highlight.js';
// import 'highlight.js/styles/monokai-sublime.css'; // Choose a style that fits your theme

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
  const [editorReady, setEditorReady] = useState(false);
  
  // Check if highlight.js is available before initializing Quill
  useEffect(() => {
    // Wait for highlight.js to be available
    const checkHljsInterval = setInterval(() => {
      if (window.hljs) {
        setEditorReady(true);
        clearInterval(checkHljsInterval);
        console.log('highlight.js is loaded and available');
      }
    }, 100);
    
    // Clean up interval
    return () => clearInterval(checkHljsInterval);
  }, []);
  
  // Quill modules configuration
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
    clipboard: {
      // Allow pasting HTML content
      matchVisual: false
    },
    syntax: true, // Enable syntax highlighting for code
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
    'link', 'image', 'video',
    'clean'
  ];

  const minHeight = rows * 20; // Approximate height based on rows

  return (
    <div className="rich-text-editor border border-premium-light/10 rounded-md overflow-hidden">
      {editorReady ? (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          style={{ height: `${Math.max(minHeight, 200)}px`, backgroundColor: '#0f172a' }}
          className="bg-slate-950 text-white"
          preserveWhitespace={true}
        />
      ) : (
        <div className="flex items-center justify-center p-8 bg-slate-950" style={{ height: `${Math.max(minHeight, 200)}px` }}>
          <div className="animate-spin h-8 w-8 border-4 border-premium-light/20 border-t-premium-light rounded-full"></div>
        </div>
      )}
      <div className="bg-slate-900 p-2 border-t border-premium-light/10">
        <div className="text-sm text-premium-light/60">
          Edytor HTML - wspiera znaczniki formatowania tekstu i kod HTML
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
