import { processOrder } from '@/lib/db/orders';

// Mock firebase
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    serverTimestamp: jest.fn(),
}));

describe('Order DB Helpers', () => {
    it('processOrder creates document', async () => {
        const { addDoc } = require('firebase/firestore');
        addDoc.mockResolvedValue({ id: 'order-123' });

        const orderData = {
            items: [],
            total: 100,
            userId: 'user-1'
        };

        const result = await processOrder(orderData as any);
        expect(result).toBe('order-123');
        expect(addDoc).toHaveBeenCalled();
    });
});
