import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { mergeDatasets, loadData } from '../src/app.js';

describe('App Module', () => {
    describe('mergeDatasets', () => {
        it('should merge datasets with overlapping dates', () => {
            const coffeeData = [
                { date: '2023-01', price_usd: 3.45 },
                { date: '2023-02', price_usd: 3.52 }
            ];
            const productivityData = [
                { date: '2023-01', activity_count: 1250 },
                { date: '2023-02', activity_count: 1380 }
            ];

            const merged = mergeDatasets(coffeeData, productivityData);

            expect(merged.dates).toEqual(['2023-01', '2023-02']);
            expect(merged.coffee).toEqual([3.45, 3.52]);
            expect(merged.productivity).toEqual([1250, 1380]);
        });

        it('should merge datasets with non-overlapping dates', () => {
            const coffeeData = [
                { date: '2023-01', price_usd: 3.45 },
                { date: '2023-03', price_usd: 3.60 }
            ];
            const productivityData = [
                { date: '2023-02', activity_count: 1250 },
                { date: '2023-04', activity_count: 1380 }
            ];

            const merged = mergeDatasets(coffeeData, productivityData);

            expect(merged.dates).toEqual(['2023-01', '2023-02', '2023-03', '2023-04']);
            expect(merged.coffee).toEqual([3.45, null, 3.60, null]);
            expect(merged.productivity).toEqual([null, 1250, null, 1380]);
        });

        it('should sort dates chronologically', () => {
            const coffeeData = [
                { date: '2023-03', price_usd: 3.60 },
                { date: '2023-01', price_usd: 3.45 }
            ];
            const productivityData = [
                { date: '2023-02', activity_count: 1250 }
            ];

            const merged = mergeDatasets(coffeeData, productivityData);

            expect(merged.dates).toEqual(['2023-01', '2023-02', '2023-03']);
        });

        it('should handle empty datasets', () => {
            const merged = mergeDatasets([], []);
            expect(merged.dates).toEqual([]);
            expect(merged.coffee).toEqual([]);
            expect(merged.productivity).toEqual([]);
        });

        it('should handle single dataset', () => {
            const coffeeData = [
                { date: '2023-01', price_usd: 3.45 }
            ];

            const merged = mergeDatasets(coffeeData, []);

            expect(merged.dates).toEqual(['2023-01']);
            expect(merged.coffee).toEqual([3.45]);
            expect(merged.productivity).toEqual([null]);
        });
    });

    describe('Property: Data Alignment', () => {
        it('should contain all unique dates from both datasets', () => {
            const dateGen = fc.tuple(
                fc.integer({ min: 2020, max: 2025 }),
                fc.integer({ min: 1, max: 12 })
            ).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`);

            fc.assert(
                fc.property(
                    fc.array(fc.record({
                        date: dateGen,
                        price_usd: fc.float({ min: 0, max: 100 })
                    }), { minLength: 1, maxLength: 50 }),
                    fc.array(fc.record({
                        date: dateGen,
                        activity_count: fc.integer({ min: 0, max: 10000 })
                    }), { minLength: 1, maxLength: 50 }),
                    (coffeeData, productivityData) => {
                        const merged = mergeDatasets(coffeeData, productivityData);
                        const expectedDates = new Set([
                            ...coffeeData.map(d => d.date),
                            ...productivityData.map(d => d.date)
                        ]);
                        
                        expect(new Set(merged.dates)).toEqual(expectedDates);
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should sort dates chronologically', () => {
            const dateGen = fc.tuple(
                fc.integer({ min: 2020, max: 2025 }),
                fc.integer({ min: 1, max: 12 })
            ).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`);

            fc.assert(
                fc.property(
                    fc.array(fc.record({
                        date: dateGen,
                        price_usd: fc.float({ min: 0, max: 100 })
                    }), { minLength: 1, maxLength: 50 }),
                    fc.array(fc.record({
                        date: dateGen,
                        activity_count: fc.integer({ min: 0, max: 10000 })
                    }), { minLength: 1, maxLength: 50 }),
                    (coffeeData, productivityData) => {
                        const merged = mergeDatasets(coffeeData, productivityData);
                        const sorted = [...merged.dates].sort();
                        
                        expect(merged.dates).toEqual(sorted);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Property: Data Preservation', () => {
        it('should preserve all coffee price values', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.record({
                        date: fc.tuple(
                            fc.integer({ min: 2020, max: 2025 }),
                            fc.integer({ min: 1, max: 12 })
                        ).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`),
                        price_usd: fc.float({ min: 0, max: 100 })
                    }), { minLength: 1, maxLength: 50 }),
                    (coffeeData) => {
                        // Remove duplicates - keep only first occurrence of each date
                        const uniqueCoffeeData = [];
                        const seenDates = new Set();
                        coffeeData.forEach(item => {
                            if (!seenDates.has(item.date)) {
                                seenDates.add(item.date);
                                uniqueCoffeeData.push(item);
                            }
                        });

                        const merged = mergeDatasets(uniqueCoffeeData, []);
                        
                        uniqueCoffeeData.forEach(item => {
                            const index = merged.dates.indexOf(item.date);
                            expect(index).not.toBe(-1);
                            expect(merged.coffee[index]).toBe(item.price_usd);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should preserve all developer activity values', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.record({
                        date: fc.tuple(
                            fc.integer({ min: 2020, max: 2025 }),
                            fc.integer({ min: 1, max: 12 })
                        ).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`),
                        activity_count: fc.integer({ min: 0, max: 10000 })
                    }), { minLength: 1, maxLength: 50 }),
                    (productivityData) => {
                        // Remove duplicates - keep only first occurrence of each date
                        const uniqueProductivityData = [];
                        const seenDates = new Set();
                        productivityData.forEach(item => {
                            if (!seenDates.has(item.date)) {
                                seenDates.add(item.date);
                                uniqueProductivityData.push(item);
                            }
                        });

                        const merged = mergeDatasets([], uniqueProductivityData);
                        
                        uniqueProductivityData.forEach(item => {
                            const index = merged.dates.indexOf(item.date);
                            expect(index).not.toBe(-1);
                            expect(merged.productivity[index]).toBe(item.activity_count);
                        });
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    describe('Property: Chart Data Consistency', () => {
        it('should have equal length arrays for dates and values', () => {
            const dateGen = fc.tuple(
                fc.integer({ min: 2020, max: 2025 }),
                fc.integer({ min: 1, max: 12 })
            ).map(([year, month]) => `${year}-${String(month).padStart(2, '0')}`);

            fc.assert(
                fc.property(
                    fc.array(fc.record({
                        date: dateGen,
                        price_usd: fc.float({ min: 0, max: 100 })
                    }), { minLength: 1, maxLength: 50 }),
                    fc.array(fc.record({
                        date: dateGen,
                        activity_count: fc.integer({ min: 0, max: 10000 })
                    }), { minLength: 1, maxLength: 50 }),
                    (coffeeData, productivityData) => {
                        const merged = mergeDatasets(coffeeData, productivityData);
                        
                        expect(merged.coffee.length).toBe(merged.dates.length);
                        expect(merged.productivity.length).toBe(merged.dates.length);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
