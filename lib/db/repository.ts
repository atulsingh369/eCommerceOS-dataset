import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    QueryConstraint,
    DocumentData,
    WithFieldValue,
    DocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Result, Ok, Err } from "../result";
import { AppError, DatabaseError, NotFoundError } from "@/lib/exceptions";

export interface IRepository<T> {
    getById(id: string): Promise<Result<T, AppError>>;
    getAll(): Promise<Result<T[], AppError>>;
    create(id: string, data: T): Promise<Result<void, AppError>>;
    update(id: string, data: Partial<T>): Promise<Result<void, AppError>>;
    delete(id: string): Promise<Result<void, AppError>>;
}

export abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
    protected collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    protected get collectionRef() {
        return collection(db, this.collectionName);
    }

    protected docRef(id: string) {
        return doc(db, this.collectionName, id);
    }

    protected async withRetry<R>(operation: () => Promise<R>, retries = 3, delay = 1000): Promise<Result<R, AppError>> {
        let lastError: any;

        for (let i = 0; i < retries; i++) {
            try {
                const result = await operation();
                return Ok(result);
            } catch (error: any) {
                lastError = error;
                // Only retry on typical transient network errors or internal server errors
                // This is a simplified check; in production, check specific error codes
                if (!error.message?.includes("offline") && !error.message?.includes("unavailable")) {
                    break; // Don't retry logic errors
                }

                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
            }
        }

        return Err(new DatabaseError(
            lastError instanceof Error ? lastError.message : "Operation failed after retries",
            lastError
        ));
    }

    async getById(id: string): Promise<Result<T, AppError>> {
        return this.withRetry(async () => {
            const snapshot = await getDoc(this.docRef(id));
            if (!snapshot.exists()) {
                throw new NotFoundError(`${this.collectionName} with ID ${id} not found`);
            }
            return { id: snapshot.id, ...snapshot.data() } as T;
        });
    }

    async getAll(constraints: QueryConstraint[] = []): Promise<Result<T[], AppError>> {
        return this.withRetry(async () => {
            const q = query(this.collectionRef, ...constraints);
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        });
    }

    async create(id: string, data: T): Promise<Result<void, AppError>> {
        return this.withRetry(async () => {
            // Validate ID consistency if data contains ID
            if (data.id && data.id !== id) {
                // warning or override?
            }
            await setDoc(this.docRef(id), data as WithFieldValue<DocumentData>);
        });
    }

    async update(id: string, data: Partial<T>): Promise<Result<void, AppError>> {
        return this.withRetry(async () => {
            // Check existence first if strictly needed, or just standard update
            await updateDoc(this.docRef(id), data as WithFieldValue<DocumentData>);
        });
    }

    async delete(id: string): Promise<Result<void, AppError>> {
        return this.withRetry(async () => {
            await deleteDoc(this.docRef(id));
        });
    }
}
