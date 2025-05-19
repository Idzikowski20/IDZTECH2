import React, { useState } from 'react';
import { useAuth } from '@/utils/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import dynamic from 'next/dynamic';
import Confetti from 'react-confetti';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const shimmer = {
  background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

export default function AIPostPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [style, setStyle] = useState('Ekspercki');
  const [length, setLength] = useState('Standardowy');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState('polski');
  const [cta, setCta] = useState(true);
  const [meta, setMeta] = useState(true);
  const [questions, setQuestions] = useState(true);
  const [summary, setSummary] = useState(true);
  const [links, setLinks] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [loadingThumb, setLoadingThumb] = useState(false);
  const [editorValue, setEditorValue] = useState('');

  React.useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  if (loading || !isAuthenticated) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Ładowanie...</div>;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'topic') setTopic(value);
    else if (name === 'keywords') setKeywords(value);
    else if (name === 'style') setStyle(value);
    else if (name === 'length') setLength(value);
    else if (name === 'audience') setAudience(value);
    else if (name === 'language') setLanguage(value);
    else if (name === 'cta') setCta(checked);
    else if (name === 'meta') setMeta(checked);
    else if (name === 'questions') setQuestions(checked);
    else if (name === 'summary') setSummary(checked);
    else if (name === 'links') setLinks(checked);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAI(true);
    setShowConfetti(false);
    setEditorValue('');
    const res = await fetch('/api/generate-blog-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, keywords, style, length, audience, cta, meta, questions, summary, links, language }),
    });
    const data = await res.json();
    setEditorValue(
      `<h1>${data.title}</h1><p>${data.lead}</p>` +
      data.sections.map(s => `<h2>${s.heading}</h2><p>${s.content}</p>`).join('') +
      (data.summary ? `<h3>Podsumowanie</h3><p>${data.summary}</p>` : '')
    );
    setLoadingAI(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleGenerateThumbnail = async () => {
    setLoadingThumb(true);
    setThumbnail('');
    const res = await fetch('/api/generate-thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: topic, keywords }),
    });
    const data = await res.json();
    setThumbnail(data.imageUrl);
    setLoadingThumb(false);
  };

  const handleGenerateKeywords = async () => {
    if (!topic) return;
    setLoadingAI(true);
    const res = await fetch('/api/generate-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const data = await res.json();
    setKeywords(data.keywords || '');
    setLoadingAI(false);
  };

  const handleGenerateAudience = async () => {
    if (!topic) return;
    setLoadingAI(true);
    const res = await fetch('/api/generate-audience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const data = await res.json();
    setAudience(data.audience || '');
    setLoadingAI(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#18181c] to-[#1a1333] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-700 opacity-30 blur-3xl rounded-full top-[-10%] left-[-10%] animate-pulse" />
        <div className="absolute w-80 h-80 bg-blue-400 opacity-20 blur-2xl rounded-full bottom-[-10%] right-[-10%] animate-pulse" />
        <div className="absolute w-60 h-60 bg-fuchsia-500 opacity-20 blur-2xl rounded-full top-[60%] left-[60%] animate-pulse" />
      </div>
      <div className="z-10 flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-5xl">🤖</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">AI Kreator Postów Blogowych</h1>
        <p className="text-gray-300 text-lg text-center mb-6">Wpisz temat, wybierz opcje i wygeneruj gotowy post!</p>
      </div>
      <form onSubmit={handleGenerate} className="z-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl  rounded-2xl ">
        <div className="flex-1 flex flex-col gap-4 w-full">
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
            placeholder="O czym chcesz napisać?"
            name="topic"
            value={topic}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-gradient-to-r from-purple-700 to-black text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:from-purple-500 transition"
              onClick={handleGenerateKeywords}
              disabled={loadingAI}
            >🔑 Słowa kluczowe</button>
            <button
              type="button"
              className="bg-gradient-to-r from-blue-700 to-black text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:from-blue-500 transition"
              onClick={handleGenerateAudience}
              disabled={loadingAI}
            >🎯 Grupa docelowa</button>
          </div>
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Słowa kluczowe (przecinek)"
            name="keywords"
            value={keywords}
            onChange={handleChange}
          />
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Grupa docelowa"
            name="audience"
            value={audience}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 bg-black text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
              value={style}
              onChange={handleChange}
              name="style"
            >
              <option>Ekspercki</option>
              <option>Przyjazny</option>
              <option>Formalny</option>
              <option>Luźny</option>
            </select>
            <select
              className="flex-1 bg-black text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
              value={length}
              onChange={handleChange}
              name="length"
            >
              <option>Standardowy</option>
              <option>Krótki</option>
              <option>Długi</option>
            </select>
          </div>
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Język"
            name="language"
            value={language}
            onChange={handleChange}
          />
          <div className="flex flex-wrap gap-4 text-gray-200 text-sm">
            <label className="flex items-center gap-1"><input type="checkbox" checked={cta} onChange={handleChange} name="cta" /> CTA</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={meta} onChange={handleChange} name="meta" /> Meta</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={questions} onChange={handleChange} name="questions" /> Pytania</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={summary} onChange={handleChange} name="summary" /> Podsumowanie</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={links} onChange={handleChange} name="links" /> Linki do sekcji</label>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 w-full md:w-72">
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 via-black to-fuchsia-700 text-white font-bold text-xl flex items-center justify-center gap-2 shadow-lg hover:from-purple-500 hover:to-fuchsia-500 transition"
            disabled={loadingAI}
          >
            <span>✨ Generuj post z AI</span> <span className="text-2xl">🤖</span>
          </button>
        </div>
      </form>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} />}
    </div>
  );
}
