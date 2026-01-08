import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    User,
    AuthError,
    EmailAuthProvider,
    linkWithCredential,
    fetchSignInMethodsForEmail,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithRedirect
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { createOrUpdateUserDocument } from "./firestore";
import { logAndGetFriendlyError } from "./errors";

/**
 * Result type for signup operations that may involve account linking
 */
export interface SignupResult {
    user: User;
    message?: string;
    wasLinked?: boolean;
}

/**
 * Helper function to link email/password credential to existing Google account
 * This is called when a user tries to sign up with email/password but already has a Google account
 */
async function linkEmailPasswordToGoogle(email: string, password: string, name: string): Promise<SignupResult> {
    try {
        // Step 1: Sign in with Google to get the existing account
        const googleCredential = await signInWithPopup(auth, googleProvider);
        const user = googleCredential.user;

        // Step 2: Create email/password credential
        const emailCredential = EmailAuthProvider.credential(email, password);

        // Step 3: Link the email/password credential to the Google account
        await linkWithCredential(user, emailCredential);

        // Step 4: Update profile with name if not already set
        if (!user.displayName || user.displayName !== name) {
            await updateProfile(user, {
                displayName: name
            });
            await user.reload();
        }

        // Step 5: Update Firestore document
        const updatedUser = auth.currentUser || user;
        await createOrUpdateUserDocument(updatedUser);

        return {
            user: updatedUser,
            message: "Successfully linked your Google account with email/password login!",
            wasLinked: true
        };
    } catch (error) {
        const friendlyMessage = logAndGetFriendlyError(error, "Account Linking");
        throw new Error(friendlyMessage);
    }
}

/**
 * Sign up with email and password
 * Handles account linking if email already exists from Google OAuth
 */
export async function signupWithEmailPassword(
    email: string,
    password: string,
    name: string
): Promise<SignupResult> {
    try {
        // Attempt normal signup
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name immediately so it's available for Firestore creation
        await updateProfile(user, {
            displayName: name
        });

        // Refresh user object to get the updated displayName locally
        await user.reload();
        const updatedUser = auth.currentUser || user;

        await createOrUpdateUserDocument(updatedUser);

        return {
            user: updatedUser,
            message: "Account created successfully!",
            wasLinked: false
        };
    } catch (error: unknown) {
        const authError = error as AuthError;

        // Handle email-already-in-use error
        if (authError.code === "auth/email-already-in-use") {
            try {
                // Check what sign-in methods exist for this email
                const signInMethods = await fetchSignInMethodsForEmail(auth, email);

                // If Google is one of the sign-in methods, attempt to link
                if (signInMethods.includes("google.com")) {
                    console.log("Email exists with Google account. Attempting to link...");
                    return await linkEmailPasswordToGoogle(email, password, name);
                } else {
                    // Email exists with email/password already
                    throw new Error("This email is already registered. Please log in instead.");
                }
            } catch (linkError: unknown) {
                // If linking fails, throw a user-friendly error
                const authLinkError = linkError as AuthError;
                if (authLinkError.code === "auth/popup-closed-by-user") {
                    throw new Error("Account linking cancelled. Please try again.");
                }
                throw linkError;
            }
        }

        // For other errors, convert to friendly message
        const friendlyMessage = logAndGetFriendlyError(error, "Signup");
        throw new Error(friendlyMessage);
    }
}

/**
 * Log in with email and password
 */
export async function loginWithEmailPassword(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Run after ANY sign-in method to ensure Firestore is up to date
        await createOrUpdateUserDocument(userCredential.user);
        return userCredential.user;
    } catch (error) {
        const friendlyMessage = logAndGetFriendlyError(error, "Login");
        throw new Error(friendlyMessage);
    }
}


/**
 * Log in with Google OAuth
 * Uses signInWithPopup for desktop and signInWithRedirect for mobile.
 */
export async function loginWithGoogle(): Promise<User | null> {
    try {
        const provider = new GoogleAuthProvider();

        // Simple mobile detection
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // For mobile, use redirect. This doesn't return a user immediately.
            // The result will be handled by getRedirectResult() in AuthContext.
            await signInWithRedirect(auth, provider);
            return null;
        } else {
            // For desktop, use popup. This returns the user immediately.
            const result = await signInWithPopup(auth, provider);
            return result.user;
        }
    } catch (error) {
        // If the user closes the popup, we don't need to throw a massive error
        const authError = error as AuthError;
        if (authError.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in cancelled by user');
        }

        const friendlyMessage = logAndGetFriendlyError(error, "Google Login");
        throw new Error(friendlyMessage);
    }
}

export async function resetPassword(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        const friendlyMessage = logAndGetFriendlyError(error, "Password Reset");
        throw new Error(friendlyMessage);
    }
}

export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        const friendlyMessage = logAndGetFriendlyError(error, "Logout");
        throw new Error(friendlyMessage);
    }
}
