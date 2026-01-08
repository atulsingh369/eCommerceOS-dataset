/**
 * @deprecated This file is kept for backward compatibility.
 * Please import from '@/lib/firebase' or specific modules like '@/lib/firebase/auth'
 * 
 * New structure:
 * - lib/firebase/config.ts - Firebase initialization
 * - lib/firebase/auth.ts - Authentication functions
 * - lib/firebase/firestore.ts - Firestore utilities
 * - lib/firebase/index.ts - Barrel exports
 */

// Re-export from new modular structure
export { auth, db, googleProvider } from './firebase/config';
export {
  signupWithEmailPassword,
  loginWithEmailPassword,
  loginWithGoogle,
  logout,
  resetPassword,
  type SignupResult
} from './firebase/auth';
export {
  createOrUpdateUserDocument,
  type UserData
} from './firebase/firestore';
export {
  getFriendlyErrorMessage,
  logAndGetFriendlyError,
  isAuthError,
  isFirestoreError
} from './firebase/errors';