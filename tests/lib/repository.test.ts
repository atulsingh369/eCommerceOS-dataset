import { BaseRepository } from "@/lib/db/repository";
import { Ok, Err, isOk, isErr } from "@/lib/result";
import { NotFoundError } from "@/lib/exceptions";
import { NotFoundError } from "@/lib/exceptions";

jest.mock("@/lib/firebase", () => ({
    db: {}
}));
jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
}));

// Mock implementation of BaseRepository for testing logic without Firebase
// Mock implementation of BaseRepository for testing logic without Firebase
class MockRepository extends BaseRepository<{ id: string, name: string }> {
    private storage = new Map<string, { id: string, name: string }>();

    constructor() {
        super("mock_items");
    }

    // Override generic methods to use memory storage
    async getById(id: string) {
        return this.withRetry(async () => {
            if (!this.storage.has(id)) throw new NotFoundError("Not found");
            return this.storage.get(id)!;
        }, 1, 0);
    }

    async create(id: string, data: { id: string, name: string }) {
        return this.withRetry(async () => {
            this.storage.set(id, data);
        }, 1, 0);
    }

    // Helper to simulate failure for retry testing
    async unstableOperation(shouldFailTimes: number) {
        let attempts = 0;
        return this.withRetry(async () => {
            attempts++;
            if (attempts <= shouldFailTimes) {
                throw new Error("Network offline");
            }
            return "Success";
        }, 5, 0); // 5 retries
    }
}

describe("BaseRepository", () => {
    let repo: MockRepository;

    beforeEach(() => {
        repo = new MockRepository();
    });

    it("should create and get item", async () => {
        const createResult = await repo.create("1", { id: "1", name: "Test" });
        expect(isOk(createResult)).toBe(true);

        const getResult = await repo.getById("1");
        expect(isOk(getResult)).toBe(true);
        if (isOk(getResult)) {
            expect(getResult.value.name).toBe("Test");
        }
    });

    it("should return generic error when not found", async () => {
        const result = await repo.getById("999");
        expect(isErr(result)).toBe(true);
        if (isErr(result)) {
            expect(result.error).toBeInstanceOf(Error);
        }
    });

    it("should retry on failure", async () => {
        const result = await repo.unstableOperation(2); // Fail twice, then succeed
        expect(isOk(result)).toBe(true);
        if (isOk(result)) {
            expect(result.value).toBe("Success");
        }
    });

    it("should fail after max retries", async () => {
        const result = await repo.unstableOperation(10); // Fail 10 times (more than 5 retries)
        expect(isErr(result)).toBe(true);
    });
});
