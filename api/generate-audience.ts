export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
    const { topic } = req.body;
    // Tu możesz podpiąć AI, na razie zwracamy przykładowe słowa kluczowe
    res.status(200).json({
      keywords: "seo,pozycjonowanie,strona internetowa,marketing"
    });
  }
   