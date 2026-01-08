import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    doc,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";
import { BaseRepository } from "./repository";
import { Result, Ok, Err, isOk } from "@/lib/result";
import { AppError } from "@/lib/exceptions";

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

class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super("products");
    }

    async findBySlug(slug: string): Promise<Result<Product | null, AppError>> {
        return this.withRetry(async () => {
            const q = query(this.collectionRef, where("slug", "==", slug), limit(1));
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Product;
        });
    }
}

export const productRepository = new ProductRepository();

// Backwards compatibility layer (wrapping Repository)

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

        if (userInfo?.sort === 'price_asc') {
            constraints.push(orderBy("price", "asc"));
        } else if (userInfo?.sort === 'price_desc') {
            constraints.push(orderBy("price", "desc"));
        }

        const result = await productRepository.getAll(constraints);

        if (!isOk(result)) {
            console.error("Error fetching products:", result.error);
            return [];
        }

        let results = result.value;

        if (userInfo?.search) {
            const lowerQuery = userInfo.search.toLowerCase();
            results = results.filter(product =>
                (product.name?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.slug?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.description?.toLowerCase() ?? "").includes(lowerQuery) ||
                (product.category?.toLowerCase() ?? "").includes(lowerQuery)
            );
        }

        const page = userInfo?.page || 1;
        const limitCount = userInfo?.limit || 100;

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
        const result = await productRepository.getById(id);
        if (isOk(result)) {
            return result.value;
        }
        return null; // Maintain legacy return type of null on failure
    } catch (error) {
        console.error("Error getting product:", error);
        return null;
    }
}

// Categories don't need a full repository yet unless we expand them
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

// Keep searchProducts mostly as is but cleaner types
export const searchProducts = async (queryText: string) => {
    try {
        const result = await productRepository.getAll();

        if (!isOk(result)) return [];

        const allProducts = result.value;
        const lowerQuery = (queryText ?? "").toLowerCase();

        const filtered = allProducts.filter(product => {
            return (
                (product.name || "").toLowerCase().includes(lowerQuery) ||
                (product.slug || "").toLowerCase().includes(lowerQuery) ||
                (product.category || "").toLowerCase().includes(lowerQuery)
            );
        });

        const ranked = filtered.sort((a, b) => {
            const aScore =
                ((a.name || "").toLowerCase().startsWith(lowerQuery) ? 3 : 0) +
                ((a.name || "").toLowerCase().includes(lowerQuery) ? 2 : 0) +
                ((a.slug || "").toLowerCase().includes(lowerQuery) ? 2 : 0) +
                ((a.category || "").toLowerCase().includes(lowerQuery) ? 1 : 0);

            const bScore =
                ((b.name || "").toLowerCase().startsWith(lowerQuery) ? 3 : 0) +
                ((b.name || "").toLowerCase().includes(lowerQuery) ? 2 : 0) +
                ((b.slug || "").toLowerCase().includes(lowerQuery) ? 2 : 0) +
                ((b.category || "").toLowerCase().includes(lowerQuery) ? 1 : 0);

            return bScore - aScore;
        });

        console.log("RANKED", ranked);
        return ranked.slice(0, 8);
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};

// Subscriptions remain using raw Firestore onSnapshot as Repository pattern doesn't naturally fit observables
// without more complex abstraction (e.g. Observable pattern)
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
                    name: data.name, // ... spread would be cleaner if sure of types
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