// Mock firebase config BEFORE imports
jest.mock('@/lib/firebase/config', () => ({
    auth: {},
    db: {},
    googleProvider: {},
}));

import { createOrder } from '@/lib/firebase/orders';
import { setDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    serverTimestamp: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    Timestamp: {
        now: jest.fn(() => ({ toDate: () => new Date() })),
        fromDate: jest.fn(),
    },
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await createOrder('user-1', orderData as any);
        expect(result.orderId).toMatch(/^ORD-/);
        expect(setDoc).toHaveBeenCalled();
    });
});
