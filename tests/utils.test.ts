import { cn, formatPrice, formatDate, truncate, slugify } from '@/lib/utils'

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

    describe('formatDate', () => {
        it('formats Date object correctly', () => {
            const date = new Date('2023-01-01T00:00:00.000Z');
            const result = formatDate(date);
            expect(result).toMatch(/January 1, 2023|December 31, 2022/);
        });

        it('formats string date correctly', () => {
            const result = formatDate('2023-01-01');
            expect(result).toMatch(/January 1, 2023|December 31, 2022/);
        });

        it('handles Firestore-like Timestamp', () => {
            const mockTimestamp = { toDate: () => new Date('2023-01-01T00:00:00.000Z') };
            const result = formatDate(mockTimestamp);
            expect(result).toMatch(/January 1, 2023|December 31, 2022/);
        });

        it('returns empty string for invalid date', () => {
            expect(formatDate(undefined)).toBe('');
            expect(formatDate(null)).toBe('');
            expect(formatDate('invalid-date')).toBe('');
        });
    });

    describe('truncate', () => {
        it('truncates string longer than length', () => {
            expect(truncate('hello world', 5)).toBe('hello...');
        });

        it('does not truncate string shorter than length', () => {
            expect(truncate('hello', 10)).toBe('hello');
        });

        it('handles null/undefined', () => {
            expect(truncate(null, 10)).toBe('');
            expect(truncate(undefined, 10)).toBe('');
        });
    });

    describe('slugify', () => {
        it('converts string to slug', () => {
            expect(slugify('Hello World')).toBe('hello-world');
            expect(slugify('  Spaced  String  ')).toBe('spaced-string');
            expect(slugify('Special @#$ Characters')).toBe('special-characters');
        });
    });
})
