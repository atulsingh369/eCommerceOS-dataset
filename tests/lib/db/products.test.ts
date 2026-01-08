// Mock firebase config BEFORE imports
jest.mock('@/lib/firebase/config', () => ({
    auth: {},
    db: {},
    googleProvider: {},
}));

import { getProducts, getProduct } from '@/lib/db/products';

// Mock firebase
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    limit: jest.fn(),
    startAfter: jest.fn(),
    orderBy: jest.fn(),
}));

describe('Product DB Helpers', () => {
    it('getProducts returns array', async () => {
        const { getDocs } = require('firebase/firestore');
        getDocs.mockResolvedValue({
            docs: [{
                id: '1',
                data: () => ({ name: 'Test Product', price: 100 })
            }]
        });

        const products = await getProducts();
        expect(products).toHaveLength(1);
        expect(products[0].name).toBe('Test Product');
    });

    it('getProduct returns single item', async () => {
        const { getDoc } = require('firebase/firestore');
        getDoc.mockResolvedValue({
            exists: () => true,
            id: '1',
            data: () => ({ name: 'Test Product', price: 100 })
        });

        const product = await getProduct('1');
        expect(product).toBeDefined();
        expect(product?.name).toBe('Test Product');
    });
});
