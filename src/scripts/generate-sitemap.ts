import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Skopiuj config z client.ts
const firebaseConfig = {
  apiKey: "AIzaSyBGBbWqNBsSzAPvoX7gY2062V-nOJif6IA",
  authDomain: "idztech-bfeef.firebaseapp.com",
  projectId: "idztech-bfeef",
  storageBucket: "idztech-bfeef.appspot.com",
  messagingSenderId: "535192245227",
  appId: "1:535192245227:web:680958b5cc3bd3d1903fae",
  measurementId: "G-SNPV2N8124"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DOMAIN = 'https://idztech.pl';

const STATIC_PATHS = [
  '/',
  '/tworzenie-stron-www',
  '/tworzenie-sklepow-internetowych',
  '/pozycjonowanie-stron-internetowych',
  '/pozycjonowanie-lokalne',
  '/audyt-seo',
  '/optymalizacja-seo',
  '/copywriting-seo',
  '/content-plan',
  '/blog',
  '/contact',
  '/about-us',
  '/projects'
];

const EXCLUDE_PATHS = [
  '/admin',
  '/admin/ai-post',
  '/login',
  '/register',
  '/panel'
];

async function getAllBlogSlugs(): Promise<string[]> {
  const postsRef = collection(db, 'blog_posts');
  const q = query(postsRef, where('published', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => `/blog/${doc.data().slug}`);
}

function getPriorityAndFreq(url: string) {
  if (url === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (url.startsWith('/blog/')) return { priority: '0.8', changefreq: 'weekly' };
  if (url === '/blog') return { priority: '0.9', changefreq: 'weekly' };
  return { priority: '0.7', changefreq: 'monthly' };
}

async function generateSitemap() {
  const blogUrls = await getAllBlogSlugs();

  const allPaths = [
    ...STATIC_PATHS,
    ...blogUrls
  ].filter(
    (url, i, arr) =>
      !EXCLUDE_PATHS.includes(url) && arr.indexOf(url) === i
  );

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allPaths
      .map((url) => {
        const { priority, changefreq } = getPriorityAndFreq(url);
        return `  <url>\n    <loc>${DOMAIN}${url}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
      })
      .join('\n') +
    '\n</urlset>\n';

  fs.writeFileSync(path.join(__dirname, '../../public/sitemap.xml'), sitemap, 'utf8');
  console.log('Sitemap wygenerowana!');
}

generateSitemap();
