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
import { Result, Ok, Err } from "../result";
import { AppError, DatabaseError, ValidationError, NotFoundError } from "../exceptions";

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
 * Returns a Result indicating success or failure.
 */
export async function createOrUpdateUserDocument(user: User): Promise<Result<void, AppError>> {
    if (!user) {
        return Err(new ValidationError("No user provided"));
    }

    if (!user.email) {
        return Err(new ValidationError("Cannot create user document: Missing email"));
    }

    if (!user.displayName) {
        return Err(new ValidationError("Cannot create user document: Missing displayName"));
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
        }

        // Step 2: Create subcollections for new users
        if (isNewUser) {
            await initializeUserSubcollections(user.uid);
        }

        return Ok(undefined);

    } catch (error) {
        console.error("Error in createOrUpdateUserDocument:", error);
        return Err(new DatabaseError(error instanceof Error ? error.message : "Unknown database error"));
    }
}

/**
 * Initializes cart and orders subcollections for a new user
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

    } catch (error) {
        console.error("Error initializing subcollections:", error);
        // Don't propagate here as it's non-critical
    }
}
