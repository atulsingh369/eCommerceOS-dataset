import { db } from "./config";
import {
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    Unsubscribe,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

/**
 * User profile interface
 */
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
    photoURL?: string;
    createdAt?: Timestamp | unknown;
    updatedAt?: Timestamp | unknown;
}

/**
 * Get user profile from Firestore
 * 
 * @param userId - The user's UID
 * @returns User profile data or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log(`User profile not found: ${userId}`);
            return null;
        }

        return userSnap.data() as UserProfile;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile.");
    }
}

/**
 * Update user profile in Firestore
 * 
 * @param userId - The user's UID
 * @param profileData - Profile data to update
 */
export async function updateUserProfile(
    userId: string,
    profileData: Partial<Omit<UserProfile, "uid" | "email" | "createdAt" | "updatedAt">>
): Promise<void> {
    try {
        const userRef = doc(db, "users", userId);

        await setDoc(
            userRef,
            {
                ...profileData,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        console.log(`User profile updated: ${userId}`);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile.");
    }
}

/**
 * Subscribe to real-time user profile updates
 * 
 * @param userId - The user's UID
 * @param callback - Callback function called with profile data on updates
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToUserProfile(userId, (profile) => {
 *   if (profile) {
 *     setUserProfile(profile); // Auto-updates!
 *   }
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToUserProfile(
    userId: string,
    callback: (profile: UserProfile | null) => void
): Unsubscribe {
    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
        userRef,
        (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as UserProfile);
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error("Error in user profile subscription:", error);
            callback(null);
        }
    );

    return unsubscribe;
}

/**
 * Create initial user profile
 * 
 * @param userId - The user's UID
 * @param email - User's email
 * @param displayName - User's display name
 */
export async function createUserProfile(
    userId: string,
    email: string,
    displayName: string,
    photoURL?: string
): Promise<void> {
    try {
        const userRef = doc(db, "users", userId);

        // Check if profile already exists
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            console.log(`User profile already exists: ${userId}`);
            return;
        }

        const userProfile: UserProfile = {
            uid: userId,
            email,
            displayName,
            photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(userRef, userProfile);
        console.log(`User profile created: ${userId}`);
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw new Error("Failed to create user profile.");
    }
}
