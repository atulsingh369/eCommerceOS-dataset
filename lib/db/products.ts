import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";

export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    images: string[];
    description: string;
    features: string[];
    isNew: boolean;
}

export const getProducts = async (userInfo?: {
    category?: string;
    sort?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
}) => {
    try {
        const q = collection(db, "products");
        const constraints: QueryConstraint[] = [];

        if (userInfo?.category) {
            constraints.push(where("category", "==", userInfo.category));
        }

        if (userInfo?.featured) {
            constraints.push(where("isNew", "==", true));
            constraints.push(limit(3));
        }

        if (userInfo?.minPrice !== undefined) {
            constraints.push(where("price", ">=", Number(userInfo.minPrice)));
        }

        if (userInfo?.maxPrice !== undefined) {
            constraints.push(where("price", "<=", Number(userInfo.maxPrice)));
        }


        // Simple sort mapping - Note: Firestore requires the field in equality filter (category) to be first in orderBy, or use composite index.
        // For simplicity with multiple filters, we might do client side sorting/filtering if constraints conflict or need indexes.
        // But price range + price sort works fine if price is the inequality field. 
        if (userInfo?.sort === 'price_asc') {
            constraints.push(orderBy("price", "asc"));
        } else if (userInfo?.sort === 'price_desc') {
            constraints.push(orderBy("price", "desc"));
        }

        const finalQuery = query(q, ...constraints);
        const querySnapshot = await getDocs(finalQuery);

        let results = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                slug: data.slug,
                price: Number(data.price),
                category: data.category,
                rating: Number(data.rating),
                reviews: Number(data.reviews),
                image: data.image,
                images: data.images || [],
                description: data.description,
                features: data.features || [],
                isNew: !!data.isNew,
            } as Product;
        });

        if (userInfo?.search) {
            const lowerQuery = userInfo.search.toLowerCase();
            results = results.filter(product =>
                (product.name?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.slug?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.description?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.category?.toLowerCase() ?? "").includes(lowerQuery)
            );
        }

        // Manual Pagination (Client-side style since we don't have total count easily with constraints)
        // ideally we would use limit/startAfter in firestore but for filter flexibility we do it here
        const page = userInfo?.page || 1;
        const limitCount = userInfo?.limit || 100; // Default showing many if not specified

        if (userInfo?.limit) {
            const start = (page - 1) * limitCount;
            results = results.slice(start, start + limitCount);
        }

        return results;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id: string) => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data.name,
                slug: data.slug,
                price: Number(data.price),
                category: data.category,
                rating: Number(data.rating),
                reviews: Number(data.reviews),
                image: data.image,
                images: data.images || [],
                description: data.description,
                features: data.features || [],
                isNew: !!data.isNew,
            } as Product;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting product:", error);
        return null;
    }
}

export const getCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                slug: data.slug,
                image: data.image,
                description: data.description,
            } as Category;
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export const searchProducts = async (queryText: string) => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));

        const allProducts = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name ?? "",
                slug: data.slug ?? "",
                price: Number(data.price ?? 0),
                category: data.category ?? "",
                rating: Number(data.rating ?? 0),
                reviews: Number(data.reviews ?? 0),
                image: data.image ?? "",
                images: data.images ?? [],
                description: data.description ?? "",
                features: data.features ?? [],
                isNew: !!data.isNew,
            } as Product;
        });

        const lowerQuery = (queryText ?? "").toLowerCase();

        const filtered = allProducts.filter(product => {
            return (
                product.name.toLowerCase().includes(lowerQuery) ||
                product.slug.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery)
            );
        });

        const ranked = filtered.sort((a, b) => {
            const aScore =
                (a.name.toLowerCase().startsWith(lowerQuery) ? 3 : 0) +
                (a.name.toLowerCase().includes(lowerQuery) ? 2 : 0) +
                (a.slug.toLowerCase().includes(lowerQuery) ? 2 : 0) +
                (a.category.toLowerCase().includes(lowerQuery) ? 1 : 0);

            const bScore =
                (b.name.toLowerCase().startsWith(lowerQuery) ? 3 : 0) +
                (b.name.toLowerCase().includes(lowerQuery) ? 2 : 0) +
                (b.slug.toLowerCase().includes(lowerQuery) ? 2 : 0) +
                (b.category.toLowerCase().includes(lowerQuery) ? 1 : 0);

            return bScore - aScore;
        });

        console.log("RANKED", ranked);
        return ranked.slice(0, 8);
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};

/**
 * Subscribe to real-time updates for all products
 * 
 * @param callback - Callback function called with products array on updates
 * @param filters - Optional filters (category, featured, minPrice, maxPrice)
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToProducts((products) => {
 *   setProducts(products); // Auto-updates when products change
 * }, { category: 'electronics' });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToProducts(
    callback: (products: Product[]) => void,
    filters?: {
        category?: string;
        featured?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }
): Unsubscribe {
    const q = collection(db, "products");
    const constraints: QueryConstraint[] = [];

    if (filters?.category) {
        constraints.push(where("category", "==", filters.category));
    }

    if (filters?.featured) {
        constraints.push(where("isNew", "==", true));
        constraints.push(limit(3));
    }

    if (filters?.minPrice !== undefined) {
        constraints.push(where("price", ">=", Number(filters.minPrice)));
    }

    if (filters?.maxPrice !== undefined) {
        constraints.push(where("price", "<=", Number(filters.maxPrice)));
    }

    const finalQuery = constraints.length > 0 ? query(q, ...constraints) : q;

    const unsubscribe = onSnapshot(
        finalQuery,
        (snapshot) => {
            const results = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    slug: data.slug,
                    price: Number(data.price),
                    category: data.category,
                    rating: Number(data.rating),
                    reviews: Number(data.reviews),
                    image: data.image,
                    images: data.images || [],
                    description: data.description,
                    features: data.features || [],
                    isNew: !!data.isNew,
                } as Product;
            });
            callback(results);
        },
        (error) => {
            console.error("Error in products subscription:", error);
            callback([]);
        }
    );

    return unsubscribe;
}

/**
 * Subscribe to real-time updates for a single product
 * 
 * @param productId - The product ID
 * @param callback - Callback function called with product data on updates
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToProduct(productId, (product) => {
 *   if (product) {
 *     setProduct(product); // Auto-updates when product changes
 *   }
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToProduct(
    productId: string,
    callback: (product: Product | null) => void
): Unsubscribe {
    const docRef = doc(db, "products", productId);

    const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                callback({
                    id: snapshot.id,
                    name: data.name,
                    slug: data.slug,
                    price: Number(data.price),
                    category: data.category,
                    rating: Number(data.rating),
                    reviews: Number(data.reviews),
                    image: data.image,
                    images: data.images || [],
                    description: data.description,
                    features: data.features || [],
                    isNew: !!data.isNew,
                } as Product);
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error("Error in product subscription:", error);
            callback(null);
        }
    );

    return unsubscribe;
}

/**
 * Subscribe to real-time updates for all categories
 * 
 * @param callback - Callback function called with categories array on updates
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToCategories((categories) => {
 *   setCategories(categories); // Auto-updates when categories change
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToCategories(
    callback: (categories: Category[]) => void
): Unsubscribe {
    const unsubscribe = onSnapshot(
        collection(db, "categories"),
        (snapshot) => {
            const results = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    slug: data.slug,
                    image: data.image,
                    description: data.description,
                } as Category;
            });
            callback(results);
        },
        (error) => {
            console.error("Error in categories subscription:", error);
            callback([]);
        }
    );

    return unsubscribe;
}