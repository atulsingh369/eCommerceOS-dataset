import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    deleteDoc,
    increment,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { Product } from "./products";
import { BaseRepository } from "./repository";
import { isOk } from "@/lib/result";

export interface CartItem extends Product {
    quantity: number;
}

// Since cart is a subcollection dependent on userId, we can create a factory or a class that takes userId
export class CartRepository extends BaseRepository<CartItem> {
    private userId: string;

    constructor(userId: string) {
        super(`users/${userId}/cart`);
        this.userId = userId;
    }

    // Override generic methods if needed, but the base ones should work with the collection path passed to super
    // provided the path logic in BaseRepository supports "users/123/cart" which it does (collection(db, path))
}

export const getCart = async (userId: string): Promise<CartItem[]> => {
    const repo = new CartRepository(userId);
    const result = await repo.getAll();
    if (isOk(result)) {
        return result.value;
    }
    console.error("Error fetching cart:", result.error);
    return [];
};

export const subscribeToCart = (
    userId: string,
    callback: (cartItems: CartItem[]) => void
): Unsubscribe => {
    // Subscription still requires raw firestore for now as Repository doesn't wrap onSnapshot
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
};

export const addToCart = async (userId: string, product: Product) => {
    const repo = new CartRepository(userId);
    const existing = await repo.getById(product.id);

    if (isOk(existing)) {
        const currentItem = existing.value;
        const result = await repo.update(product.id, {
            quantity: (currentItem.quantity || 1) + 1
        });
        if (!isOk(result)) throw result.error;
    } else {
        // Assume not found means create
        const result = await repo.create(product.id, {
            ...product,
            quantity: 1
        });
        if (!isOk(result)) throw result.error;
    }
};

export const updateCartQuantity = async (userId: string, productId: string, quantity: number) => {
    const repo = new CartRepository(userId);
    if (quantity <= 0) {
        const result = await repo.delete(productId);
        if (!isOk(result)) throw result.error;
    } else {
        const result = await repo.update(productId, { quantity });
        if (!isOk(result)) throw result.error;
    }
};

export const removeFromCart = async (userId: string, productId: string) => {
    const repo = new CartRepository(userId);
    const result = await repo.delete(productId);
    if (!isOk(result)) throw result.error;
};

export const clearCart = async (userId: string) => {
    const repo = new CartRepository(userId);
    const allItems = await repo.getAll();
    if (isOk(allItems)) {
        const promises = allItems.value.map(item => repo.delete(item.id));
        await Promise.all(promises);
    }
}

