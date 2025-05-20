require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json());

// Uniwersalna funkcja do pobierania odpowiedzi z LLM z fallbackami
async function fetchFromLLM({ prompt, system, extractJson = false, extractLine = false }) {
  const apiKeyGroq = process.env.GROQ_API_KEY;
  const apiKeyGemini = process.env.GEMINI_API_KEY;
  const apiKeyOpenAI = process.env.OPENAI_API_KEY;
  // 1. Groq
  if (apiKeyGroq) {
    try {
      console.log('[AI Fallback] Próbuję Groq...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyGroq}`
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (extractJson) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi Groq');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return text.replace(/\n/g, '').trim();
      }
      return text;
    } catch (e) {
      console.error('[AI Fallback] Błąd Groq:', e);
      // Próbuj dalej
    }
  }
  // 2. Gemini
  if (apiKeyGemini) {
    try {
      console.log('[AI Fallback] Próbuję Gemini...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKeyGemini}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (extractJson) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi Gemini');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return text.replace(/\n/g, '').trim();
      }
      return text;
    } catch (e) {
      console.error('[AI Fallback] Błąd Gemini:', e);
      // Próbuj dalej
    }
  }
  // 3. OpenAI
  if (apiKeyOpenAI) {
    try {
      console.log('[AI Fallback] Próbuję OpenAI...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyOpenAI}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (extractJson) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi OpenAI');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return text.replace(/\n/g, '').trim();
      }
      return text;
    } catch (e) {
      console.error('[AI Fallback] Błąd OpenAI:', e);
      // Próbuj dalej
    }
  }
  console.error('[AI Fallback] Brak dostępnych kluczy API lub wszystkie modele zawiodły.');
  throw new Error('Brak dostępnych kluczy API lub wszystkie modele zawiodły.');
}

// --- /api/generate-keywords ---
app.post('/api/generate-keywords', async (req, res) => {
  const { topic } = req.body || {};
  const prompt = `Wygeneruj listę słów kluczowych (po przecinku, bez numeracji, bez dodatkowego tekstu) do artykułu na temat: "${topic}". Odpowiedz tylko listą słów kluczowych po przecinku.`;
  try {
    const keywords = await fetchFromLLM({ prompt, system: 'Jesteś ekspertem SEO.', extractLine: true });
    res.status(200).json({ keywords });
  } catch (err) {
    res.status(500).json({ error: 'Błąd generowania słów kluczowych przez AI', details: err.message });
  }
});

// --- /api/generate-audience ---
app.post('/api/generate-audience', async (req, res) => {
  const { topic } = req.body || {};
  const prompt = `Wymień grupy docelowe (po przecinku, bez numeracji, bez dodatkowego tekstu) dla artykułu na temat: "${topic}". Odpowiedz tylko listą grup docelowych po przecinku.`;
  try {
    const audience = await fetchFromLLM({ prompt, system: 'Jesteś ekspertem od marketingu.', extractLine: true });
    res.status(200).json({ audience });
  } catch (err) {
    res.status(500).json({ error: 'Błąd generowania grupy docelowej przez AI', details: err.message });
  }
});

// --- /api/generate-blog-post ---
app.post('/api/generate-blog-post', async (req, res) => {
  const { topic, keywords, style, length, audience, cta, meta, questions, summary, links, language } = req.body;
  const prompt = `\nNapisz ekspercki artykuł blogowy na temat: "${topic}".\nUżyj słów kluczowych: ${keywords}.\nStyl: ${style}. Długość: ${length}.\nGrupa docelowa: ${audience}.\n${cta ? 'Dodaj sekcję z wezwaniem do działania.' : ''}\n${meta ? 'Dodaj meta description.' : ''}\n${questions ? 'Dodaj listę pytań, które artykuł odpowiada.' : ''}\n${summary ? 'Dodaj podsumowanie na końcu.' : ''}\n${links ? 'Na początku artykułu wygeneruj listę sekcji (h2) z linkami do nich.' : ''}\nJęzyk: ${language || 'polski'}.\nZwróć wynik w formacie JSON: { "title": "...", "meta": "...", "lead": "...", "sections": [{ "heading": "...", "content": "..." }], "summary": "...", "cta": "...", "tags": ["..."] }\n`;
  try {
    const result = await fetchFromLLM({ prompt, system: 'Jesteś ekspertem od blogowania i SEO.', extractJson: true });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Błąd generowania posta przez AI', details: err.message });
  }
});

// --- /api/cron-generate-daily-post ---
app.post('/api/cron-generate-daily-post', async (req, res) => {
  const topic = "Nowoczesne trendy w marketingu internetowym 2024";
  try {
    const aiResponse = await fetch('http://localhost:10000/api/generate-blog-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const post = await aiResponse.json();
    res.status(200).json({ status: "OK, post wygenerowany i zapisany jako draft", post });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
});

// --- /api/generate-tags ---
app.post('/api/generate-tags', async (req, res) => {
  const { topic } = req.body || {};
  const prompt = `Wygeneruj listę tagów (po przecinku, bez numeracji, bez dodatkowego tekstu) do artykułu na temat: "${topic}". Odpowiedz tylko listą tagów po przecinku.`;
  try {
    const tags = await fetchFromLLM({ prompt, system: 'Jesteś ekspertem od blogowania i SEO.', extractLine: true });
    res.status(200).json({ tags });
  } catch (err) {
    res.status(500).json({ error: 'Błąd generowania tagów przez AI', details: err.message });
  }
});

// --- Obsługa frontendu Vite (statyczne pliki) ---
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all tylko dla NIE-API
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next(); // NIE obsługuj API przez frontend!
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
