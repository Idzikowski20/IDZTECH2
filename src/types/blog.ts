export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  summary: string | null;
  excerpt: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_at: string | null;
} 