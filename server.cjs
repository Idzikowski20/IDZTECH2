require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

// Dodaj obsługę CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
      console.log('[AI RAW DATA]', data);
      const text = data.choices?.[0]?.message?.content || '';
      let cleanText = text.replace(/```json|```/g, '').trim();
      // Zamień znaki nowej linii i tabulatory w stringach na spacje
      cleanText = cleanText.replace(/\\n|\\t|\\r/g, ' ');
      if (extractJson) {
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi Groq');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return cleanText;
      }
      return cleanText;
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
      console.log('[AI RAW DATA]', data);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let cleanText = text.replace(/```json|```/g, '').trim();
      // Zamień znaki nowej linii i tabulatory w stringach na spacje
      cleanText = cleanText.replace(/\\n|\\t|\\r/g, ' ');
      if (extractJson) {
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi Gemini');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return cleanText;
      }
      return cleanText;
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
      console.log('[AI RAW DATA]', data);
      const text = data.choices?.[0]?.message?.content || '';
      let cleanText = text.replace(/```json|```/g, '').trim();
      // Zamień znaki nowej linii i tabulatory w stringach na spacje
      cleanText = cleanText.replace(/\\n|\\t|\\r/g, ' ');
      if (extractJson) {
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi OpenAI');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return cleanText;
      }
      return cleanText;
    } catch (e) {
      console.error('[AI Fallback] Błąd OpenAI:', e);
      // Próbuj dalej
    }
  }
  // 4. Mistral
  const apiKeyMistral = process.env.MISTRAL_API_KEY;
  if (apiKeyMistral) {
    try {
      console.log('[AI Fallback] Próbuję Mistral...');
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyMistral}`
        },
        body: JSON.stringify({
          model: 'mistral-medium',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });
      const data = await response.json();
      console.log('[AI RAW DATA]', data);
      const text = data.choices?.[0]?.message?.content || '';
      let cleanText = text.replace(/```json|```/g, '').trim();
      cleanText = cleanText.replace(/\\n|\\t|\\r/g, ' ');
      if (extractJson) {
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Nie znaleziono fragmentu JSON w odpowiedzi Mistral');
        return JSON.parse(jsonMatch[0]);
      }
      if (extractLine) {
        return cleanText;
      }
      return cleanText;
    } catch (e) {
      console.error('[AI Fallback] Błąd Mistral:', e);
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
  const { topic, keywords, style, length, audience, cta, meta, questions, summary, links, language, lengthPrompt } = req.body;
  const prompt = `
Napisz ekspercki artykuł blogowy na temat: "${topic}".
Użyj słów kluczowych: ${keywords}.
Styl: ${style}.
${lengthPrompt ? lengthPrompt : `Długość: ${length}.`}
Grupa docelowa: ${audience}.
${cta ? 'Dodaj sekcję z wezwaniem do działania.' : ''}
${meta ? 'Dodaj meta description.' : ''}
${questions ? 'Dodaj listę pytań, które artykuł odpowiada.' : ''}
${summary ? 'Dodaj podsumowanie na końcu.' : ''}
${links ? 'Na początku artykułu wygeneruj listę sekcji (h2) z linkami do nich, ale NIE twórz sekcji o nazwie "Spis treści".' : ''}
Język: ${language || 'polski'}.

Dla każdej sekcji (h2) wygeneruj diagram w formacie napkin.ai. Diagram powinien być zapisany jako JSON w następującym formacie:
{
  "diagram": {
    "nodes": [
      {"id": "1", "text": "Tytuł węzła", "type": "rectangle"},
      {"id": "2", "text": "Inny węzeł", "type": "circle"}
    ],
    "edges": [
      {"from": "1", "to": "2", "text": "Opis połączenia"}
    ]
  }
}

WAŻNE: Nie twórz sekcji ani nagłówka o nazwie "Spis treści" w treści artykułu. Nie generuj dodatkowego spisu treści w żadnej sekcji. Jeśli w artykule pojawia się sekcja porównawcza (np. "Porównanie WordPress vs dedykowana strona"), wygeneruj ją jako dwie osobne podsekcje: najpierw zalety i wady WordPressa (każda lista z emoji: ✅ zalety, ❌ wady, ⚠️ ostrzeżenia), potem zalety i wady strony dedykowanej (również z emoji). Użyj <div class="comparison-list">...</div> bez nagłówków h2/h3. Przykład:\n<div class="comparison-list">\n  <div><b>Zalety WordPressa:</b><ul><li>✅ Łatwy w obsłudze</li><li>✅ Duża społeczność</li></ul></div>\n  <div><b>Wady WordPressa:</b><ul><li>❌ Ograniczona elastyczność</li><li>⚠️ Wymaga aktualizacji</li></ul></div>\n  <div><b>Zalety strony dedykowanej:</b><ul><li>✅ Pełna elastyczność</li></ul></div>\n  <div><b>Wady strony dedykowanej:</b><ul><li>❌ Wyższy koszt</li></ul></div>\n</div>\nDodawaj emoji i emocje w całym artykule.
Artykuł ma być zoptymalizowany pod SEO, dobierz słowa i frazy pod wybrane słowa kluczowe, tak aby uzyskać SEO rating score 65-90.
Odpowiedz TYLKO poprawnym JSON, bez żadnych wyjaśnień, komentarzy, tekstu przed ani po. Nie dodawaj żadnych słów poza JSON-em!
Format odpowiedzi:
{
  "title": "...",
  "meta": "...",
  "lead": "...",
  "sections": [
    { 
      "heading": "...", 
      "content": "...",
      "diagram": {
        "nodes": [...],
        "edges": [...]
      }
    }
  ],
  "summary": "...",
  "cta": "...",
  "tags": ["..."]
}
`;
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
    const aiResponse = await fetch(`${process.env.RENDER_EXTERNAL_URL || 'http://localhost:10000'}/api/generate-blog-post`, {
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

// Obsługa statycznych plików
app.use(express.static(path.join(__dirname, 'dist')));

// Przekierowanie wszystkich pozostałych zapytań do index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
