
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'ahdhzkts',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  token: 'skTF5r9c24CVENM4D5qnb749SwBFZfgxmWZ5A1SM3tNqkWx0ICkIoKeY935mW6JcY0RvMs1G0efCQ7OmsE47m2UvuHb5exbz6SY0Y82CGOPzTB1MhZ2xzDiZKPQScdIDPZb5YcFWQUn1bU9zVoZQ41U1GnJnqw2UK27A9KaeNKGRqMpFkDX', // Using the token provided
});

export async function fetchSanityData(query: string, params = {}) {
  try {
    return await sanityClient.fetch(query, params);
  } catch (error) {
    console.error('Error fetching data from Sanity:', error);
    return null;
  }
}

// Helper function to create or update a document
export async function createOrUpdateDocument(doc: any, type: string) {
  try {
    // If document has an _id, it's an update
    if (doc._id) {
      return await sanityClient.patch(doc._id).set(doc).commit();
    }
    
    // Otherwise create a new document
    return await sanityClient.create({
      _type: type,
      ...doc
    });
  } catch (error) {
    console.error('Error creating or updating document:', error);
    throw error;
  }
}

// Helper function to delete a document
export async function deleteDocument(id: string) {
  try {
    return await sanityClient.delete(id);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

// Function to check if a user has admin role
export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const query = `*[_type == "user" && _id == $userId][0]{role}`;
    const user = await sanityClient.fetch(query, { userId });
    return user?.role === 'administrator' || user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Funkcja do pobierania treści strony z Sanity
export async function fetchPageContent(slug: string) {
  try {
    const query = `*[_type == "page" && slug.current == $slug][0]{
      title,
      content,
      sections,
      seo
    }`;
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}

// Funkcja do pobierania postów blogowych z Sanity
export async function fetchBlogPosts(limit = 10, offset = 0) {
  try {
    const query = `*[_type == "blogPost"] | order(publishedAt desc) [$offset...$limit] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{name, profilePicture},
      categories,
      tags,
      views
    }`;
    
    return await sanityClient.fetch(query, { limit: offset + limit, offset });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Funkcja do pobierania pojedynczego posta blogowego z Sanity
export async function fetchBlogPost(slug: string) {
  try {
    const query = `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      author->{
        _id,
        name,
        profilePicture,
        jobTitle
      },
      categories,
      tags,
      content,
      views,
      likes,
      comments
    }`;
    
    return await sanityClient.fetch(query, { slug });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Funkcja do aktualizacji liczby wyświetleń posta
export async function incrementPostViews(postId: string) {
  try {
    return await sanityClient
      .patch(postId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();
  } catch (error) {
    console.error('Error incrementing post views:', error);
    return null;
  }
}

// Funkcja do dodawania polubienia do posta
export async function addLikeToPost(postId: string, userId: string | null) {
  try {
    if (userId) {
      // Dodawanie polubienia zalogowanego użytkownika
      return await sanityClient
        .patch(postId)
        .setIfMissing({ likes: [] })
        .append('likes', [{ _ref: userId, _type: 'reference' }])
        .commit();
    } else {
      // Dodawanie polubienia anonimowego - przechowujemy tylko ID sesji
      const guestId = `guest-${Date.now()}`;
      return await sanityClient
        .patch(postId)
        .setIfMissing({ guestLikes: [] })
        .append('guestLikes', [guestId])
        .commit();
    }
  } catch (error) {
    console.error('Error adding like to post:', error);
    return null;
  }
}

// Funkcja do dodawania komentarza do posta
export async function addCommentToPost(postId: string, comment: any) {
  try {
    return await sanityClient
      .patch(postId)
      .setIfMissing({ comments: [] })
      .append('comments', [comment])
      .commit();
  } catch (error) {
    console.error('Error adding comment to post:', error);
    return null;
  }
}
