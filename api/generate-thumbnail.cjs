export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  const { title, keywords } = req.body;

  const prompt = `A modern, bright, flat design web illustration for a blog post about ${title}. Keywords: ${keywords}. No text. 16:9 aspect ratio.`;

  // Wywołanie DALL-E (OpenAI)
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
}
