import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    increment,
    getDoc,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { Product } from "./products";

export interface CartItem extends Product {
    quantity: number;
}

export const getCart = async (userId: string): Promise<CartItem[]> => {
    try {
        const cartRef = collection(db, "users", userId, "cart");
        const snapshot = await getDocs(cartRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
    } catch (error) {
        console.error("Error fetching cart:", error);
        return [];
    }
};

/**
 * Subscribe to real-time cart updates
 * 
 * @param userId - The user's UID
 * @param callback - Callback function called with cart items on updates
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToCart(userId, (cartItems) => {
 *   setCart(cartItems); // Auto-updates when cart changes!
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToCart(
    userId: string,
    callback: (cartItems: CartItem[]) => void
): Unsubscribe {
    const cartRef = collection(db, "users", userId, "cart");

    const unsubscribe = onSnapshot(
        cartRef,
        (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CartItem));
            callback(items);
        },
        (error) => {
            console.error("Error in cart subscription:", error);
            callback([]);
        }
    );

    return unsubscribe;
}

export const addToCart = async (userId: string, product: Product) => {
    try {
        const cartItemRef = doc(db, "users", userId, "cart", product.id);
        const cartItemSnap = await getDoc(cartItemRef);

        if (cartItemSnap.exists()) {
            await updateDoc(cartItemRef, {
                quantity: increment(1)
            });
        } else {
            await setDoc(cartItemRef, {
                ...product,
                quantity: 1
            });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

export const updateCartQuantity = async (userId: string, productId: string, quantity: number) => {
    try {
        const cartItemRef = doc(db, "users", userId, "cart", productId);
        if (quantity <= 0) {
            await deleteDoc(cartItemRef);
        } else {
            await updateDoc(cartItemRef, { quantity });
        }
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        throw error;
    }
};

export const removeFromCart = async (userId: string, productId: string) => {
    try {
        const cartItemRef = doc(db, "users", userId, "cart", productId);
        await deleteDoc(cartItemRef);
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
};

export const clearCart = async (userId: string) => {
    try {
        const cartRef = collection(db, "users", userId, "cart");
        const snapshot = await getDocs(cartRef);
        const batchPromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(batchPromises);
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}
