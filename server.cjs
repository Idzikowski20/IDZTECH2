require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json());

// --- /api/generate-keywords ---
app.post('/api/generate-keywords', (req, res) => {
  const { topic } = req.body || {};
  res.status(200).json({
    keywords: "seo,pozycjonowanie,strona internetowa,marketing"
  });
});

// --- /api/generate-audience ---
app.post('/api/generate-audience', (req, res) => {
  const { topic } = req.body || {};
  res.status(200).json({
    audience: "właściciele firm, marketerzy, przedsiębiorcy"
  });
});

// --- /api/generate-blog-post ---
app.post('/api/generate-blog-post', async (req, res) => {
  const apiKeyGemini = process.env.GEMINI_API_KEY;
  const apiKeyOpenAI = process.env.OPENAI_API_KEY;
  const { topic, keywords, style, length, audience, cta, meta, questions, summary, links, language } = req.body;

  const prompt = `
Napisz ekspercki artykuł blogowy na temat: "${topic}".
Użyj słów kluczowych: ${keywords}.
Styl: ${style}. Długość: ${length}.
Grupa docelowa: ${audience}.
${cta ? 'Dodaj sekcję z wezwaniem do działania.' : ''}
${meta ? 'Dodaj meta description.' : ''}
${questions ? 'Dodaj listę pytań, które artykuł odpowiada.' : ''}
${summary ? 'Dodaj podsumowanie na końcu.' : ''}
${links ? 'Na początku artykułu wygeneruj listę sekcji (h2) z linkami do nich.' : ''}
Język: ${language || 'polski'}.
Zwróć wynik w formacie JSON: { "title": "...", "meta": "...", "lead": "...", "sections": [{ "heading": "...", "content": "..." }], "summary": "...", "cta": "...", "tags": ["..."] }
`;

  // Najpierw próbuj Gemini
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKeyGemini}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    let result;
    try {
      result = JSON.parse(data.candidates[0].content.parts[0].text);
      const sections = data.sections || [];
      result.sections = sections.map(section => ({
        heading: section.heading,
        content: section.content
      }));
      return res.status(200).json(result);
    } catch (e) {
      console.error('Gemini parse error:', e, data);
      // Jeśli nie uda się sparsować, przejdź do OpenAI
    }
  } catch (err) {
    console.error('Gemini fetch error:', err);
    // Jeśli błąd, przejdź do OpenAI
  }

  // Fallback: OpenAI
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyOpenAI}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Jesteś ekspertem od blogowania i SEO.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
      const sections = data.sections || [];
      result.sections = sections.map(section => ({
        heading: section.heading,
        content: section.content
      }));
      return res.status(200).json(result);
    } catch (e) {
      console.error('OpenAI parse error:', e, data);
      return res.status(500).json({ error: 'AI response parse error (OpenAI)', raw: data });
    }
  } catch (err) {
    console.error('OpenAI fetch error:', err);
    return res.status(500).json({ error: 'Request failed (OpenAI)', details: err.message });
  }
});

// --- /api/generate-thumbnail ---
app.post('/api/generate-thumbnail', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const { title, keywords } = req.body;

  const prompt = `A modern, bright, flat design web illustration for a blog post about ${title}. Keywords: ${keywords}. No text. 16:9 aspect ratio.`;

  try {
    const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '1024x576',
        response_format: 'url'
      })
    });

    const dalleData = await dalleResponse.json();
    const imageUrl = dalleData.data && dalleData.data[0] ? dalleData.data[0].url : null;

    if (!imageUrl) {
      return res.status(500).json({ error: 'Image generation failed', raw: dalleData });
    }

    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
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
