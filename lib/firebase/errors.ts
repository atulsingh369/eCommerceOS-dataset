import { AuthError } from "firebase/auth";
import { FirestoreError } from "firebase/firestore";

/**
 * Mapping of Firebase Auth error codes to user-friendly messages
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    // Authentication errors
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled. Please contact support.",
    "auth/user-not-found": "No account found with this email. Please sign up.",
    "auth/wrong-password": "Invalid email or password. Please try again.",
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/email-already-in-use": "This email is already registered. Please log in instead.",
    "auth/weak-password": "Password is too weak. Please use at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
    "auth/popup-blocked": "Sign-in popup was blocked by your browser. Please allow popups and try again.",
    "auth/credential-already-in-use": "This credential is already associated with a different account.",
    "auth/account-exists-with-different-credential": "An account already exists with the same email but different sign-in method. Please use your original sign-in method.",
    "auth/operation-not-allowed": "This sign-in method is not enabled. Please contact support.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later or reset your password.",
    "auth/network-request-failed": "Network error. Please check your connection and try again.",
    "auth/internal-error": "An internal error occurred. Please try again.",
    "auth/requires-recent-login": "This operation requires recent authentication. Please log in again.",

    // Additional common errors
    "auth/missing-password": "Please enter a password.",
    "auth/missing-email": "Please enter an email address.",
    "auth/invalid-action-code": "This link is invalid or has expired. Please request a new one.",
    "auth/expired-action-code": "This link has expired. Please request a new one.",
    "auth/unauthorized-domain": "This domain is not authorized for OAuth operations.",
    "auth/cancelled-popup-request": "Only one popup request is allowed at a time.",
};

/**
 * Mapping of Firestore error codes to user-friendly messages
 */
const FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
    "permission-denied": "You don't have permission to access this data.",
    "not-found": "The requested data was not found.",
    "already-exists": "This data already exists.",
    "unavailable": "Service is temporarily unavailable. Please try again.",
    "deadline-exceeded": "Request took too long. Please try again.",
    "failed-precondition": "Operation cannot be completed. Please check your data and try again.",
    "cancelled": "Operation was cancelled.",
    "data-loss": "Data loss detected. Please contact support.",
    "unauthenticated": "You must be logged in to perform this action.",
    "resource-exhausted": "Too many requests. Please try again later.",
    "invalid-argument": "Invalid data provided. Please check your input.",
    "out-of-range": "Value is out of acceptable range.",
    "unimplemented": "This feature is not yet implemented.",
    "aborted": "Operation was aborted. Please try again.",
};

/**
 * Default fallback message for unknown errors
 */
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/**
 * Extracts the error code from various error formats
 */
function getErrorCode(error: unknown): string | null {
    if (!error) return null;

    // Firebase Auth error
    if (typeof error === "object" && "code" in error) {
        return (error as AuthError | FirestoreError).code;
    }

    // Error message string that contains the code
    if (error instanceof Error && error.message) {
        // Match patterns like "Firebase: Error (auth/invalid-email)"
        const match = error.message.match(/\(([^)]+)\)/);
        if (match) return match[1];
    }

    return null;
}

/**
 * Converts Firebase Auth and Firestore errors into user-friendly messages
 * 
 * @param error - The error object from Firebase or any other source
 * @returns A user-friendly error message string
 * 
 * @example
 * ```typescript
 * try {
 *   await signInWithEmailAndPassword(auth, email, password);
 * } catch (error) {
 *   const message = getFriendlyErrorMessage(error);
 *   toast.error(message); // "Invalid email or password. Please try again."
 * }
 * ```
 */
export function getFriendlyErrorMessage(error: unknown): string {
    // If error is already a string, return it
    if (typeof error === "string") {
        return error;
    }

    // If error is an Error object with a custom message (not Firebase format)
    if (error instanceof Error && !error.message.includes("Firebase:")) {
        // Check if it's one of our custom error messages
        if (error.message && !error.message.startsWith("auth/") && !error.message.startsWith("firestore/")) {
            return error.message;
        }
    }

    // Extract error code
    const errorCode = getErrorCode(error);

    if (!errorCode) {
        // If we have an Error object but no code, use its message
        if (error instanceof Error && error.message) {
            return error.message;
        }
        return DEFAULT_ERROR_MESSAGE;
    }

    // Check Auth errors first
    if (errorCode.startsWith("auth/")) {
        return AUTH_ERROR_MESSAGES[errorCode] || DEFAULT_ERROR_MESSAGE;
    }

    // Check Firestore errors
    if (FIRESTORE_ERROR_MESSAGES[errorCode]) {
        return FIRESTORE_ERROR_MESSAGES[errorCode];
    }

    // Fallback
    return DEFAULT_ERROR_MESSAGE;
}

/**
 * Type guard to check if an error is a Firebase Auth error
 */
export function isAuthError(error: unknown): error is AuthError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as AuthError).code === "string" &&
        (error as AuthError).code.startsWith("auth/")
    );
}

/**
 * Type guard to check if an error is a Firestore error
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as FirestoreError).code === "string" &&
        !((error as FirestoreError).code.startsWith("auth/"))
    );
}

/**
 * Logs error details for debugging while returning user-friendly message
 * 
 * @param error - The error to log and convert
 * @param context - Optional context string for debugging (e.g., "Login", "Signup")
 * @returns User-friendly error message
 */
export function logAndGetFriendlyError(error: unknown, context?: string): string {
    const friendlyMessage = getFriendlyErrorMessage(error);

    // Log detailed error for debugging
    if (context) {
        console.error(`[${context}] Error:`, error);
    } else {
        console.error("Error:", error);
    }

    return friendlyMessage;
}
