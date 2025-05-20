import React, { useState } from 'react';
import { useAuth } from '@/utils/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import dynamic from 'next/dynamic';
import Confetti from 'react-confetti';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const shimmer = {
  background: 'linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:10000';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
  const [aiPost, setAiPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');

  React.useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  // Dodaj efekt do automatycznego pobierania słów kluczowych i grupy docelowej na podstawie tytułu
  React.useEffect(() => {
    if (!topic) {
      setKeywords('');
      setAudience('');
      return;
    }
    const timeout = setTimeout(() => {
      // Pobierz słowa kluczowe
      fetch(`${API_BASE}/api/generate-keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
        .then(res => res.json())
        .then(data => setKeywords(data.keywords || ''));
      // Pobierz grupę docelową
      fetch(`${API_BASE}/api/generate-audience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
        .then(res => res.json())
        .then(data => setAudience(data.audience || ''));
    }, 500); // 500ms opóźnienia
    return () => clearTimeout(timeout);
  }, [topic]);

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
    else if (name === 'tags') setTags(value);
    else if (name === 'status') setStatus(value);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAI(true);
    setShowConfetti(false);
    setAccepted(false);
    setIsEditing(false);
    setAiPost(null);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/api/generate-blog-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, style, length, audience, cta, meta, questions, summary, links, language }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Błąd generowania posta przez AI');
        setLoadingAI(false);
        return;
      }
      const data = await res.json();
      setAiPost(data);
      setEditedPost(
        `<h1>${data.title || ''}</h1><p>${data.lead || ''}</p>` +
        (Array.isArray(data.sections) ? data.sections.map(s => `<h2>${s.heading}</h2><p>${s.content}</p>`).join('') : '') +
        (data.summary ? `<h3>Podsumowanie</h3><p>${data.summary}</p>` : '')
      );
      setLoadingAI(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (e) {
      setError('Błąd połączenia z API');
      setLoadingAI(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    setLoadingThumb(true);
    setThumbnail('');
    try {
      const res = await fetch(`${API_BASE}/api/generate-thumbnail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic, keywords }),
      });
      const data = await res.json();
      setThumbnail(data.imageUrl);
    } catch (e) {
      setThumbnail('');
    }
    setLoadingThumb(false);
  };

  const handleGenerateKeywords = async () => {
    if (!topic) return;
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate-keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setKeywords(data.keywords || '');
    } catch (e) {}
    setLoadingAI(false);
  };

  const handleGenerateAudience = async () => {
    if (!topic) return;
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate-audience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setAudience(data.audience || '');
    } catch (e) {}
    setLoadingAI(false);
  };

  const handleGenerateTags = async () => {
    if (!topic) return;
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate-tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setTags(data.tags || '');
    } catch (e) {}
    setLoadingAI(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleAccept = async () => {
    setAccepted(true);
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (!aiPost) return;
    if (!user || !user.uid) {
      setError('Musisz być zalogowany, aby zapisać post!');
      return;
    }
    try {
      await addDoc(collection(db, "blog_posts"), {
        title: aiPost?.title || "",
        lead: typeof aiPost?.lead === 'string' ? aiPost.lead : "",
        sections: Array.isArray(aiPost?.sections) ? aiPost.sections : [],
        summary: typeof aiPost?.summary === 'string' ? aiPost.summary : "",
        tags: Array.isArray(aiPost?.tags) ? aiPost.tags : [],
        created_at: serverTimestamp(),
        slug: aiPost?.title ? slugify(aiPost.title) : '',
        featured_image: thumbnail || '',
        excerpt: typeof aiPost?.lead === 'string' ? aiPost.lead : "",
        author: user?.email || "anonim",
        author_id: user?.uid || "",
        status: status,
        content: isEditing ? editedPost : null,
        published: true
      });
      setSuccess('Post zapisany w bazie!');
    } catch (e) {
      setError('Błąd zapisu do bazy: ' + (e.message || e));
      // Dodatkowo loguj błąd do konsoli
      console.error('Błąd zapisu do Firestore:', e);
    }
  };

  const handleReject = () => {
    setAiPost(null);
    setIsEditing(false);
    setAccepted(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#18181c] to-[#1a1333] relative overflow-hidden">
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
            <button
              type="button"
              className="bg-gradient-to-r from-pink-700 to-black text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:from-pink-500 transition"
              onClick={handleGenerateTags}
              disabled={loadingAI}
            >🏷️ Tagi</button>
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
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            placeholder="Tagi (przecinek)"
            name="tags"
            value={tags}
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
          <select
            className="bg-black text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none"
            value={status}
            onChange={e => setStatus(e.target.value)}
            name="status"
          >
            <option value="published">Opublikowany</option>
            <option value="draft">Szkic</option>
          </select>
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
      {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}
      {success && <div className="mt-4 text-green-600 font-bold">{success}</div>}
      {aiPost && !accepted && (
        <div className="mt-8 w-full max-w-3xl  rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Podgląd wygenerowanego posta</h2>
          {isEditing ? (
            <ReactQuill
              className="w-full h-64 mb-4 "
              theme="snow"
              value={editedPost}
              onChange={setEditedPost}
            />
          ) : (
            <div>
              <h3 className="text-2xl font-bold mb-2">{aiPost.title}</h3>
              <p className="mb-4">{aiPost.lead}</p>
              {Array.isArray(aiPost.sections) && aiPost.sections.map((s, i) => (
                <div key={i}>
                  <h4 className="font-semibold mt-4">{s.heading}</h4>
                  <p>{s.content}</p>
                </div>
              ))}
              {aiPost.summary && (
                <>
                  <h4 className="font-semibold mt-4">Podsumowanie</h4>
                  <p>{aiPost.summary}</p>
                </>
              )}
            </div>
          )}
          <div className="flex gap-4 mt-6">
            {!isEditing && <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Edytuj</button>}
            {isEditing && <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAccept}>Akceptuj</button>}
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleReject}>Odrzuć</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={handleGenerateThumbnail} disabled={loadingThumb}>Generuj miniaturę</button>
          </div>
          {thumbnail && <img src={thumbnail} alt="Miniatura" className="mt-4 rounded-lg w-full max-w-md mx-auto" />}
        </div>
      )}
      {accepted && (
        <div className="mt-8 text-green-700 font-bold">Post zaakceptowany i zapisany w bazie!</div>
      )}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} />}
    </div>
  );
}
