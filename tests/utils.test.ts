import { cn, formatPrice } from '@/lib/utils'

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            expect(cn('c1', 'c2')).toBe('c1 c2')
        })

        it('handles conditional classes', () => {
            expect(cn('c1', false && 'c2', 'c3')).toBe('c1 c3')
        })

        it('merges tailwind classes', () => {
            expect(cn('p-4', 'p-2')).toBe('p-2')
        })
    })

    describe('formatPrice', () => {
        it('formats number to currency string', () => {
            // Note: The specific output depends on the locale and currency.
            // Based on utils.ts it uses en-US and INR.
            const price = 1000
            const formatted = formatPrice(price)
            expect(formatted).toContain('₹')
            expect(formatted).toContain('1,000.00')
        })

        it('handles undefined input gracefully', () => {
            expect(formatPrice(undefined)).toContain('0.00');
        });

        it('handles null input gracefully', () => {
            expect(formatPrice(null)).toContain('0.00');
        });

        it('handles NaN gracefully', () => {
            expect(formatPrice(NaN)).toContain('0.00');
        });
    })
})
