
describe('Cart Logic', () => {
    it('enforces min quantity', () => {
        const update = (qty: number) => {
            if (qty < 1) return 'ignored';
            return 'updated';
        };
        expect(update(0)).toBe('ignored');
        expect(update(1)).toBe('updated');
    });
});
