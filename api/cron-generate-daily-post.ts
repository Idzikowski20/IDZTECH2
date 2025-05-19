// import { db } from 'ścieżka/do/firestore/init'; // dodaj inicjalizację Firestore

export default async function handler(req, res) {
  // Przykład: generuj post na zadany temat lub losowy
  const topic = "Nowoczesne trendy w marketingu internetowym 2024";

  // Wywołanie funkcji generate-blog-post
  const aiResponse = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/generate-blog-post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  const post = await aiResponse.json();

  // Tutaj dodaj zapis do Firestore jako draft (published: false)
  // await db.collection('blog_posts').add({ ...post, published: false });

  res.status(200).json({ status: "OK, post wygenerowany i zapisany jako draft", post });
}
