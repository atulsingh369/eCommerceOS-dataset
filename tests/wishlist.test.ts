
import { addToWishlist, WishlistItem } from '@/lib/wishlist';
import { Product } from '@/lib/db/products';

describe('Wishlist Logic', () => {
    const mockProduct: Product = {
        id: 'p1',
        name: 'Test Product',
        slug: 'test',
        price: 100,
        category: 'cat',
        rating: 5,
        reviews: 10,
        image: 'img.jpg',
        images: [],
        description: 'desc',
        features: [],
        isNew: false
    };

    it('adds item if not present', () => {
        const list: WishlistItem[] = [];
        const result = addToWishlist(list, mockProduct);
        expect(result).toHaveLength(1);
        expect(result[0].product.id).toBe('p1');
    });

    it('prevents duplicates', () => {
        const list: WishlistItem[] = [
            { id: 'w1', product: mockProduct, addedAt: 123 }
        ];
        const result = addToWishlist(list, mockProduct);
        expect(result).toHaveLength(1); // Should still be 1
    });
});
