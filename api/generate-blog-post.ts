export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
}
