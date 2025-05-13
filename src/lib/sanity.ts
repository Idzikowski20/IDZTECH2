
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
