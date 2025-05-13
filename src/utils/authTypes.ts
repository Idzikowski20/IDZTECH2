
// This file defines types used with Sanity.io auth integration

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  lastName?: string;
  jobTitle?: string;
  created_at?: string;
  last_sign_in?: string;
  stats?: {
    views: number;
    posts: number;
    comments: number;
    likes: number;
    pointsTotal: number;
    pointsThisMonth: number;
    lastUpdated: string;
  };
}

export interface User extends UserProfile {
  // Added properties needed across the app
  profilePicture?: string;
  lastName?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalLogins: number;
}

export type UserRole = 'user' | 'admin' | 'moderator' | 'blogger';

// Function to calculate points
export const calculatePoints = (views: number, posts: number, comments: number, likes: number): number => {
  return views + (posts * 50) + (comments * 10) + (likes * 5);
};

// Mock users array for temporary use
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    profilePicture: '',
    created_at: new Date().toISOString(),
    stats: {
      views: 100,
      posts: 5,
      comments: 10,
      likes: 15,
      pointsTotal: 500,
      pointsThisMonth: 150,
      lastUpdated: new Date().toISOString()
    }
  }
];

// Interface for Sanity page content
export interface PageContent {
  title: string;
  content?: any[];
  sections?: PageSection[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
  };
}

// Types for page sections
export type PageSection = 
  | HeroSection
  | TextWithImageSection
  | ServicesSection;

export interface HeroSection {
  _type: 'hero';
  heading: string;
  subheading?: string;
  bgImage?: any;
  ctaText?: string;
  ctaUrl?: string;
}

export interface TextWithImageSection {
  _type: 'textWithImage';
  heading: string;
  text?: any[];
  image?: any;
  imagePosition?: 'left' | 'right';
}

export interface ServicesSection {
  _type: 'services';
  heading: string;
  services: Array<{
    title: string;
    description: string;
    icon?: string;
    url?: string;
  }>;
}

// Blog post interface
export interface BlogPostSanity {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  publishedAt: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: any;
    jobTitle?: string;
  };
  categories: string[];
  tags: string[];
  content?: any[];
  views: number;
  likes?: Array<{ _ref: string }>;
  guestLikes?: string[];
  comments?: Array<{
    author?: { _ref: string };
    text: string;
    postedAt: string;
    guestName?: string;
  }>;
}
