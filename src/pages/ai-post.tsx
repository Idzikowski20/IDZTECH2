import React, { useState } from 'react';
import { useAuth } from '@/utils/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import dynamic from 'next/dynamic';
import Confetti from 'react-confetti';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styled from 'styled-components';

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

function aiPostToHtml(aiPost) {
  return (
    `<h1>${aiPost.title || ''}</h1><p>${aiPost.lead || ''}</p>` +
    (Array.isArray(aiPost.sections) ? aiPost.sections.map(s => `<h2>${s.heading}</h2><p>${s.content}</p>`).join('') : '') +
    (aiPost.summary ? `<h3>Podsumowanie</h3><p>${aiPost.summary}</p>` : '')
  );
}

const StyledWrapper = styled.div`
  .sparkle-button {
    --active: 0;
    --bg: radial-gradient(
        40% 50% at center 100%,
        hsl(270 calc(var(--active) * 97%) 72% / var(--active)),
        transparent
      ),
      radial-gradient(
        80% 100% at center 120%,
        hsl(260 calc(var(--active) * 97%) 70% / var(--active)),
        transparent
      ),
      hsl(260 calc(var(--active) * 97%) calc((var(--active) * 44%) + 12%));
    background: var(--bg);
    font-size: 1.2rem;
    font-weight: 500;
    border: 0;
    cursor: pointer;
    padding: 1em 1em;
    display: flex;
    align-items: center;
    gap: 0.25em;
    white-space: nowrap;
    border-radius: 100px;
    position: relative;
    box-shadow: 0 0 calc(var(--active) * 3em) calc(var(--active) * 1em) hsl(260 97% 61% / 0.75),
      0 0em 0 0 hsl(260 calc(var(--active) * 97%) calc((var(--active) * 50%) + 30%)) inset,
      0 -0.05em 0 0 hsl(260 calc(var(--active) * 97%) calc(var(--active) * 60%)) inset;
    transition: box-shadow var(--transition), scale var(--transition), background var(--transition);
    scale: calc(1 + (var(--active) * 0.1));
    transition: .3s;
  }
  .sparkle-button:active {
    scale: 1;
    transition: .3s;
  }
  .sparkle path {
    color: hsl(0 0% calc((var(--active, 0) * 70%) + var(--base)));
    transform-box: fill-box;
    transform-origin: center;
    fill: currentColor;
    stroke: currentColor;
    animation-delay: calc((var(--transition) * 1.5) + (var(--delay) * 1s));
    animation-duration: 0.6s;
    transition: color var(--transition);
  }
  .sparkle-button:is(:hover, :focus-visible) path {
    animation-name: bounce;
  }
  @keyframes bounce {
    35%, 65% {
      scale: var(--scale);
    }
  }
  .sparkle path:nth-of-type(1) {
    --scale: 0.5;
    --delay: 0.1;
    --base: 40%;
  }
  .sparkle path:nth-of-type(2) {
    --scale: 1.5;
    --delay: 0.2;
    --base: 20%;
  }
  .sparkle path:nth-of-type(3) {
    --scale: 2.5;
    --delay: 0.35;
    --base: 30%;
  }
  .sparkle-button:before {
    content: "";
    position: absolute;
    inset: -0.2em;
    z-index: -1;
    border: 0.25em solid hsl(260 97% 50% / 0.5);
    border-radius: 100px;
    opacity: var(--active, 0);
    transition: opacity var(--transition);
  }
  .spark {
    position: absolute;
    inset: 0;
    border-radius: 100px;
    rotate: 0deg;
    overflow: hidden;
    mask: linear-gradient(white, transparent 50%);
    animation: flip calc(var(--spark) * 2) infinite steps(2, end);
  }
  @keyframes flip {
    to {
      rotate: 360deg;
    }
  }
  .spark:before {
    content: "";
    position: absolute;
    width: 200%;
    aspect-ratio: 1;
    top: 0%;
    left: 50%;
    z-index: -1;
    translate: -50% -15%;
    rotate: 0;
    transform: rotate(-90deg);
    opacity: calc((var(--active)) + 0.4);
    background: conic-gradient(
      from 0deg,
      transparent 0 340deg,
      white 360deg
    );
    transition: opacity var(--transition);
    animation: rotate var(--spark) linear infinite both;
  }
  .spark:after {
    content: "";
    position: absolute;
    inset: var(--cut);
    border-radius: 100px;
  }
  .backdrop {
    position: absolute;
    inset: var(--cut);
    background: var(--bg);
    border-radius: 100px;
    transition: background var(--transition);
  }
  @keyframes rotate {
    to {
      transform: rotate(90deg);
    }
  }
  @supports(selector(:has(:is(+ *)))) {
    body:has(button:is(:hover, :focus-visible)) {
      --active: 1;
      --play-state: running;
    }
    .bodydrop {
      display: none;
    }
  }
  .sparkle-button:is(:hover, :focus-visible) ~ :is(.bodydrop, .particle-pen) {
    --active: 1;
    --play-state: runnin;
  }
  .sparkle-button:is(:hover, :focus-visible) {
    --active: 1;
    --play-state: running;
  }
  .sp {
    position: relative;
  }
  .particle-pen {
    position: absolute;
    width: 200%;
    aspect-ratio: 1;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    -webkit-mask: radial-gradient(white, transparent 65%);
    z-index: -1;
    opacity: var(--active, 0);
    transition: opacity var(--transition);
  }
  .particle {
    fill: white;
    width: calc(var(--size, 0.25) * 1rem);
    aspect-ratio: 1;
    position: absolute;
    top: calc(var(--y) * 1%);
    left: calc(var(--x) * 1%);
    opacity: var(--alpha, 1);
    animation: float-out calc(var(--duration, 1) * 1s) calc(var(--delay) * -1s) infinite linear;
    transform-origin: var(--origin-x, 1000%) var(--origin-y, 1000%);
    z-index: -1;
    animation-play-state: var(--play-state, paused);
  }
  .particle path {
    fill: hsl(0 0% 90%);
    stroke: none;
  }
  .particle:nth-of-type(even) {
    animation-direction: reverse;
  }
  @keyframes float-out {
    to {
      rotate: 360deg;
    }
  }
  .text {
    translate: 2% -6%;
    letter-spacing: 0.01ch;
    background: linear-gradient(90deg, hsl(0 0% calc((var(--active) * 100%) + 65%)), hsl(0 0% calc((var(--active) * 100%) + 26%)));
    -webkit-background-clip: text;
    color: transparent;
    transition: background var(--transition);
  }
  .sparkle-button svg {
    inline-size: 1.25em;
    translate: -25% -5%;
  }
`;

const ShimmerDiv = styled.div`
  width: 100%;
  height: 32px;
  margin-top: 32px;
  border-radius: 16px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

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
    setAiPost(null);
    setError('');
    setSuccess('');
    // Ustal zakres słów dla długości
    let lengthPrompt = '';
    if (length === 'Krótki') lengthPrompt = 'Długość: 300-500 słów.';
    else if (length === 'Średni') lengthPrompt = 'Długość: 500-900 słów.';
    else if (length === 'Długi') lengthPrompt = 'Długość: 900-1500 słów.';
    try {
      const res = await fetch(`${API_BASE}/api/generate-blog-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, style, length, audience, cta, meta, questions, summary, links, language, lengthPrompt }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Błąd generowania posta przez AI');
        setLoadingAI(false);
        return;
      }
      const data = await res.json();
      setAiPost(data);
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

  const handleEdit = () => {
    if (aiPost) setEditedPost(aiPostToHtml(aiPost));
    setIsEditing(true);
  };

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

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          setThumbnail(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="z-10 flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-5xl">🤖</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">AI Kreator Postów Blogowych</h1>
        <p className="text-gray-300 text-lg text-center mb-6">Wpisz temat, wybierz opcje i wygeneruj gotowy post!</p>
      </div>
      <form onSubmit={handleGenerate} className="z-10 flex flex-col md:flex-column items-center gap-8 w-full max-w-4xl  rounded-2xl ">
        <div className="flex-1 flex flex-col gap-4 w-full">
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-black-700 rounded-3xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
            placeholder="O czym chcesz napisać?"
            name="topic"
            value={topic}
            onChange={handleChange}
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-gradient-to-r from-purple-700 to-black text-white rounded-3xl px-4 py-2 flex items-center gap-2 hover:from-purple-500 transition"
              onClick={handleGenerateKeywords}
              disabled={loadingAI}
            >🔑 Słowa kluczowe</button>
            <button
              type="button"
              className="bg-gradient-to-r from-blue-700 to-black text-white rounded-3xl px-4 py-2 flex items-center gap-2 hover:from-blue-500 transition"
              onClick={handleGenerateAudience}
              disabled={loadingAI}
            >🎯 Grupa docelowa</button>
            <button
              type="button"
              className="bg-gradient-to-r from-pink-700 to-black text-white rounded-3xl px-4 py-2 flex items-center gap-2 hover:from-pink-500 transition"
              onClick={handleGenerateTags}
              disabled={loadingAI}
            >🏷️ Tagi</button>
          </div>
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
            placeholder="Słowa kluczowe (przecinek)"
            name="keywords"
            value={keywords}
            onChange={handleChange}
          />
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
            placeholder="Grupa docelowa"
            name="audience"
            value={audience}
            onChange={handleChange}
          />
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
            placeholder="Tagi (przecinek)"
            name="tags"
            value={tags}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 bg-black text-white border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
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
              className="flex-1 bg-black text-white border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
              value={length}
              onChange={handleChange}
              name="length"
            >
              <option>Krótki</option>
              <option>Średni</option>
              <option>Długi</option>
            </select>
          </div>
          <input
            type="text"
            className="bg-black text-white placeholder-gray-400 border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
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
            className="bg-black text-white border border-black-700 rounded-3xl px-4 py-2 focus:outline-none"
            value={status}
            onChange={e => setStatus(e.target.value)}
            name="status"
          >
            <option value="published">Opublikowany</option>
            <option value="draft">Szkic</option>
          </select>
        </div>
        <div className="flex flex-col items-center gap-4 w-full md:w-72">
          <StyledWrapper>
            <div className="sp">
              <button
                type="submit"
                className="sparkle-button"
                disabled={loadingAI}
              >
                <span className="spark" />
                <span className="backdrop" />
                <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text">Generuj z AI</span>
              </button>
            </div>
          </StyledWrapper>
        </div>
      </form>
      {loadingAI && <ShimmerDiv />}
      {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}
      {success && <div className="mt-4 text-green-600 font-bold">{success}</div>}
      {aiPost && !accepted && (
        <div className="mt-8 w-full max-w-3xl  rounded-xl shadow-lg p-6">
          {/* Spis treści */}
          {Array.isArray(aiPost.sections) && aiPost.sections.length > 0 && (
            <div className="mb-8 p-4 bg-white/10 rounded-2xl">
              <div className="font-bold text-lg mb-2 text-white">Spis treści</div>
              <ul className="flex flex-col gap-2">
                {aiPost.sections.map((s, i) => (
                  <li key={i}>
                    <a
                      href={`#${s.heading ? s.heading.replace(/\s+/g, '-').toLowerCase() : `section-${i}`}`}
                      className="text-purple-300 hover:text-white transition-colors underline cursor-pointer"
                      onClick={e => {
                        e.preventDefault();
                        const el = document.getElementById(s.heading ? s.heading.replace(/\s+/g, '-').toLowerCase() : `section-${i}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <h2 className="text-xl font-bold mb-4">Podgląd wygenerowanego posta</h2>
          {isEditing ? (
            <ReactQuill
              className="w-full min-h-[400px] h-[400px] md:min-h-[500px] md:h-[500px] mb-8 text-white bg-black rounded-xl"
              theme="snow"
              value={editedPost}
              onChange={setEditedPost}
              style={{ minHeight: '400px', height: '500px', background: '#18181c', color: 'white', borderRadius: '0.75rem', marginBottom: '2rem', fontSize: '1.1rem' }}
            />
          ) : (
            <div>
              <h3 className="text-3xl font-bold mb-6">{aiPost.title}</h3>
              <p className="mb-6 text-lg">{aiPost.lead}</p>
              {Array.isArray(aiPost.sections) && aiPost.sections.map((s, i) => (
                <div key={i}>
                  <h2
                    id={s.heading ? s.heading.replace(/\s+/g, '-').toLowerCase() : `section-${i}`}
                    className="text-2xl font-bold mt-10 mb-4 scroll-mt-24"
                  >
                    {s.heading}
                  </h2>
                  <p className="mb-6 text-base">{s.content}</p>
                </div>
              ))}
              {aiPost.summary && (
                <>
                  <h2 className="text-2xl font-bold mt-10 mb-4">Podsumowanie</h2>
                  <p className="mb-6 text-base">{aiPost.summary}</p>
                </>
              )}
            </div>
          )}
          <div className="flex gap-4 mt-[70px]">
            {!isEditing && <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleEdit}>Edytuj</button>}
            {isEditing && <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAccept}>Akceptuj</button>}
            <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleReject}>Odrzuć</button>
            <label className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer flex items-center justify-center">
              Dodaj miniaturę
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
            </label>
          </div>
          {thumbnail && <img src={thumbnail} alt="Miniatura" className="mt-4 rounded-3xl w-full max-w-md mx-auto" />}
        </div>
      )}
      {accepted && (
        <div className="mt-8 text-green-700 font-bold">Post zaakceptowany i zapisany w bazie!</div>
      )}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={500} recycle={true} style={{ position: 'fixed', top: 0, left: 0 }} />}
    </div>
  );
}
