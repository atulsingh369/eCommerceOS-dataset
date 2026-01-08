import { db } from "./config";
import {
    doc,
    setDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs,
    deleteDoc
} from "firebase/firestore";
import { User } from "firebase/auth";

export interface UserData {
    uid: string;
    displayName: string;
    email: string;
    provider: string;
    photoURL?: string | null;
    createdAt?: unknown;
    updatedAt?: unknown;
}

/**
 * Creates or updates a user document in Firestore.
 * 
 * Logic:
 * 1. Validates that user has both email and displayName
 * 2. Checks if a user document with the same EMAIL already exists (prevents duplicates)
 * 3. If email exists, updates that document (merges accounts)
 * 4. If not, creates a new document under users/{uid}
 * 5. Creates cart and orders subcollections if this is a new user
 * 
 * This ensures:
 * - Google OAuth and email/password accounts with same email share one Firestore document
 * - No duplicate user documents
 * - Subcollections are initialized for new users
 */
export async function createOrUpdateUserDocument(user: User): Promise<void> {
    if (!user) {
        console.error("createOrUpdateUserDocument: No user provided");
        return;
    }

    // Requirement 3: Validation - No user document unless name and email exist
    if (!user.email) {
        console.error("Cannot create user document: Missing email");
        return;
    }

    if (!user.displayName) {
        console.error("Cannot create user document: Missing displayName");
        return;
    }

    const userEmail = user.email;
    const userName = user.displayName;

    try {
        // Step 1: Check if a user with this EMAIL already exists (regardless of UID)
        const emailQuery = query(
            collection(db, "users"),
            where("email", "==", userEmail)
        );
        const emailQuerySnapshot = await getDocs(emailQuery);

        let userDocRef;
        let isNewUser = false;

        if (!emailQuerySnapshot.empty) {
            // Found existing user with this email - use that document
            const existingUserDoc = emailQuerySnapshot.docs[0];
            userDocRef = doc(db, "users", existingUserDoc.id);

            console.log(`Found existing user by email. Using document: ${existingUserDoc.id}`);

            // Update the existing document with latest info
            await setDoc(userDocRef, {
                displayName: userName,
                email: userEmail,
                provider: user.providerData[0]?.providerId || 'password',
                photoURL: user.photoURL || null,
                updatedAt: serverTimestamp(),
            }, { merge: true });

        } else {
            // No existing user with this email - create new document
            userDocRef = doc(db, "users", user.uid);
            isNewUser = true;

            const userData: UserData = {
                uid: user.uid,
                displayName: userName,
                email: userEmail,
                provider: user.providerData[0]?.providerId || 'password',
                photoURL: user.photoURL || null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(userDocRef, userData);
            console.log(`Created new user document: ${user.uid}`);
        }

        // Step 2: Create subcollections for new users (Requirement 5)
        if (isNewUser) {
            await initializeUserSubcollections(user.uid);
        }

    } catch (error) {
        console.error("Error in createOrUpdateUserDocument:", error);
        throw error;
    }
}

/**
 * Initializes cart and orders subcollections for a new user
 * Creates placeholder documents to ensure subcollections exist
 */
async function initializeUserSubcollections(uid: string): Promise<void> {
    try {
        // Create a placeholder document in cart subcollection
        const cartRef = doc(collection(db, `users/${uid}/cart`), '_placeholder');
        await setDoc(cartRef, {
            _placeholder: true,
            createdAt: serverTimestamp()
        });

        await deleteDoc(cartRef);

        // Create a placeholder document in orders subcollection
        const ordersRef = doc(collection(db, `users/${uid}/orders`), '_placeholder');
        await setDoc(ordersRef, {
            _placeholder: true,
            createdAt: serverTimestamp()
        });

        await deleteDoc(ordersRef);

        console.log(`Initialized subcollections for user: ${uid}`);
    } catch (error) {
        console.error("Error initializing subcollections:", error);
        // Don't throw - subcollection creation is not critical
    }
}
