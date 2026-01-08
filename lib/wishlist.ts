import { Product } from "./db/products";

export interface WishlistItem {
    id: string;
    product: Product;
    addedAt: number;
}

export const addToWishlist = (currentWishlist: WishlistItem[], product: Product): WishlistItem[] => {
    // Fix: Prevent duplicates
    if (currentWishlist.some(item => item.product.id === product.id)) {
        return currentWishlist;
    }

    const newItem: WishlistItem = {
        id: crypto.randomUUID(),
        product,
        addedAt: Date.now()
    };

    return [...currentWishlist, newItem];
};

export const removeFromWishlist = (currentWishlist: WishlistItem[], productId: string): WishlistItem[] => {
    return currentWishlist.filter(item => item.product.id !== productId);
};
