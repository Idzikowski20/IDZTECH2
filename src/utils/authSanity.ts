
import { sanityClient, fetchSanityData } from '@/lib/sanity';
import { User } from './authTypes';

// Simple in-memory storage for demo purposes
// In a real system, use secure storage and proper authentication
const authTokens: {[key: string]: {userId: string, expires: Date}} = {};

export const loginWithSanity = async (email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}> => {
  try {
    // In a real implementation, we would properly authenticate with password hashing
    // This is a simplified version for demo purposes
    
    // Find user by email
    const query = `*[_type == "user" && email == $email][0]{
      _id,
      name,
      lastName,
      email,
      role,
      profilePicture,
      jobTitle,
      created_at,
      stats
    }`;
    
    const user = await fetchSanityData(query, { email });
    
    if (!user) {
      return { 
        success: false, 
        error: 'Invalid credentials' 
      };
    }
    
    // In a real system we would verify password here
    // if (!bcrypt.compareSync(password, user.passwordHash)) {
    //   return { success: false, error: 'Invalid credentials' };
    // }
    
    // Update last sign in time
    await sanityClient
      .patch(user._id)
      .set({ last_sign_in: new Date().toISOString() })
      .commit();
    
    // Create a token (in a real system use JWT or similar)
    const token = Math.random().toString(36).substring(2);
    
    // Set token expiration (24 hours)
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    
    // Store token
    authTokens[token] = {
      userId: user._id,
      expires
    };
    
    // Format user data for frontend
    const userData: User = {
      id: user._id,
      name: user.name,
      lastName: user.lastName || '',
      email: user.email,
      role: user.role || 'user',
      profilePicture: user.profilePicture ? 
        user.profilePicture.asset._ref.replace('image-', '').replace('-jpg', '.jpg') : 
        undefined,
      jobTitle: user.jobTitle || '',
      created_at: user.created_at,
      last_sign_in: new Date().toISOString(),
      stats: user.stats
    };
    
    return {
      success: true,
      user: userData,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
};

export const validateToken = async (token: string): Promise<{
  valid: boolean;
  user?: User;
}> => {
  try {
    // Check if token exists
    if (!authTokens[token]) {
      return { valid: false };
    }
    
    // Check if token expired
    if (new Date() > authTokens[token].expires) {
      delete authTokens[token];
      return { valid: false };
    }
    
    // Get user by ID
    const userId = authTokens[token].userId;
    const query = `*[_type == "user" && _id == $userId][0]{
      _id,
      name,
      lastName,
      email,
      role,
      profilePicture,
      jobTitle,
      created_at,
      last_sign_in,
      stats
    }`;
    
    const user = await fetchSanityData(query, { userId });
    
    if (!user) {
      return { valid: false };
    }
    
    // Format user data
    const userData: User = {
      id: user._id,
      name: user.name,
      lastName: user.lastName || '',
      email: user.email,
      role: user.role || 'user',
      profilePicture: user.profilePicture ? 
        user.profilePicture.asset._ref.replace('image-', '').replace('-jpg', '.jpg') : 
        undefined,
      jobTitle: user.jobTitle || '',
      created_at: user.created_at,
      last_sign_in: user.last_sign_in || null,
      stats: user.stats
    };
    
    return {
      valid: true,
      user: userData
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false };
  }
};

export const logoutUser = (token: string): boolean => {
  if (authTokens[token]) {
    delete authTokens[token];
    return true;
  }
  return false;
};

export const registerUser = async (userData: {
  name: string;
  lastName?: string;
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}> => {
  try {
    // Check if user already exists
    const existingQuery = `*[_type == "user" && email == $email][0]._id`;
    const existingUser = await fetchSanityData(existingQuery, { email: userData.email });
    
    if (existingUser) {
      return {
        success: false,
        error: 'Email already in use'
      };
    }
    
    // In a real system, hash the password
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user in Sanity
    const result = await sanityClient.create({
      _type: 'user',
      name: userData.name,
      lastName: userData.lastName || '',
      email: userData.email,
      role: 'user', // Default role for new registrations
      created_at: new Date().toISOString(),
      stats: {
        views: 0,
        posts: 0,
        comments: 0,
        likes: 0,
        pointsTotal: 0,
        pointsThisMonth: 0,
        lastUpdated: new Date().toISOString()
      }
    });
    
    // Create token
    const token = Math.random().toString(36).substring(2);
    
    // Set token expiration (24 hours)
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    
    // Store token
    authTokens[token] = {
      userId: result._id,
      expires
    };
    
    // Format user data
    const newUser: User = {
      id: result._id,
      name: result.name,
      lastName: result.lastName || '',
      email: result.email,
      role: result.role || 'user',
      created_at: result.created_at,
      last_sign_in: null,
      stats: result.stats
    };
    
    return {
      success: true,
      user: newUser,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Registration failed'
    };
  }
};
