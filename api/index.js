const express = require('express');
const serverless = require('serverless-http');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json());

// --- Twoje endpointy Express ---
app.post('/api/generate-keywords', (req, res) => {
  const { topic } = req.body || {};
  res.status(200).json({
    keywords: "seo,pozycjonowanie,strona internetowa,marketing"
  });
});

app.post('/api/generate-audience', (req, res) => {
  const { topic } = req.body || {};
  res.status(200).json({
    audience: "właściciele firm, marketerzy, przedsiębiorcy"
  });
});

app.post('/api/generate-blog-post', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
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

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
    } catch (e) {
      return res.status(500).json({ error: 'AI response parse error', raw: data });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
});

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

app.post('/api/cron-generate-daily-post', async (req, res) => {
  const topic = "Nowoczesne trendy w marketingu internetowym 2024";
  try {
    const aiResponse = await fetch('premium-digital-harvest.vercel.app/api/generate-blog-post', {
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

// --- Eksportuj handler Expressa jako funkcję serverless ---
module.exports = serverless(app);
