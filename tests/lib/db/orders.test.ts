// Mock firebase config BEFORE imports
jest.mock('@/lib/firebase/config', () => ({
    auth: {},
    db: {},
    googleProvider: {},
}));

import { createOrder } from '@/lib/firebase/orders';

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    serverTimestamp: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
}));

describe('Order DB Helpers', () => {
    it('createOrder creates document', async () => {
        const { addDoc } = require('firebase/firestore');
        addDoc.mockResolvedValue({ id: 'order-123' });

        const orderData = {
            items: [],
            priceBreakdown: { total: 100 },
            userId: 'user-1'
        };

        const result = await createOrder('user-1', orderData as any);
        expect(result.orderId).toBe('order-123');
        expect(addDoc).toHaveBeenCalled();
    });
});
