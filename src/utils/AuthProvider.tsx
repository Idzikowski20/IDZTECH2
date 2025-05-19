
import { useAuth as useFirebaseAuth } from './firebaseAuth';

// Re-export the Firebase auth hook as the main auth hook
export const useAuth = useFirebaseAuth;

// Re-export the AuthProvider component from firebaseAuth to maintain backward compatibility
export { AuthProvider } from './firebaseAuth';
