import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchCoffeePrices, fetchDeveloperActivity, validateCoffeePriceData, validateDeveloperActivityData } from '../src/api.js';

describe('API Module', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('validateCoffeePriceData', () => {
        it('should validate correct coffee price data', () => {
            const validData = [
                { date: '2023-01', price_usd: 3.45 },
                { date: '2023-02', price_usd: 3.52 }
            ];
            expect(validateCoffeePriceData(validData)).toBe(true);
        });

        it('should reject non-array data', () => {
            expect(validateCoffeePriceData({ date: '2023-01', price_usd: 3.45 })).toBe(false);
        });

        it('should reject data with invalid date format', () => {
            const invalidData = [
                { date: '01-2023', price_usd: 3.45 }
            ];
            expect(validateCoffeePriceData(invalidData)).toBe(false);
        });

        it('should reject data with negative prices', () => {
            const invalidData = [
                { date: '2023-01', price_usd: -3.45 }
            ];
            expect(validateCoffeePriceData(invalidData)).toBe(false);
        });

        it('should reject data with missing fields', () => {
            const invalidData = [
                { date: '2023-01' }
            ];
            expect(validateCoffeePriceData(invalidData)).toBe(false);
        });

        it('should accept zero price', () => {
            const validData = [
                { date: '2023-01', price_usd: 0 }
            ];
            expect(validateCoffeePriceData(validData)).toBe(true);
        });
    });

    describe('validateDeveloperActivityData', () => {
        it('should validate correct developer activity data', () => {
            const validData = [
                { date: '2023-01', activity_count: 1250 },
                { date: '2023-02', activity_count: 1380 }
            ];
            expect(validateDeveloperActivityData(validData)).toBe(true);
        });

        it('should reject non-array data', () => {
            expect(validateDeveloperActivityData({ date: '2023-01', activity_count: 1250 })).toBe(false);
        });

        it('should reject data with invalid date format', () => {
            const invalidData = [
                { date: '01-2023', activity_count: 1250 }
            ];
            expect(validateDeveloperActivityData(invalidData)).toBe(false);
        });

        it('should reject data with negative activity counts', () => {
            const invalidData = [
                { date: '2023-01', activity_count: -1250 }
            ];
            expect(validateDeveloperActivityData(invalidData)).toBe(false);
        });

        it('should reject data with missing fields', () => {
            const invalidData = [
                { date: '2023-01' }
            ];
            expect(validateDeveloperActivityData(invalidData)).toBe(false);
        });

        it('should accept zero activity count', () => {
            const validData = [
                { date: '2023-01', activity_count: 0 }
            ];
            expect(validateDeveloperActivityData(validData)).toBe(true);
        });
    });

    describe('fetchCoffeePrices', () => {
        it('should return mock data when API fails', async () => {
            const data = await fetchCoffeePrices();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);
            expect(validateCoffeePriceData(data)).toBe(true);
        });

        it('should return data with correct structure', async () => {
            const data = await fetchCoffeePrices();
            data.forEach(item => {
                expect(item).toHaveProperty('date');
                expect(item).toHaveProperty('price_usd');
                expect(item.date).toMatch(/^\d{4}-\d{2}$/);
                expect(typeof item.price_usd).toBe('number');
            });
        });
    });

    describe('fetchDeveloperActivity', () => {
        it('should return mock data when API fails', async () => {
            const data = await fetchDeveloperActivity();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThan(0);
            expect(validateDeveloperActivityData(data)).toBe(true);
        });

        it('should return data with correct structure', async () => {
            const data = await fetchDeveloperActivity();
            data.forEach(item => {
                expect(item).toHaveProperty('date');
                expect(item).toHaveProperty('activity_count');
                expect(item.date).toMatch(/^\d{4}-\d{2}$/);
                expect(typeof item.activity_count).toBe('number');
            });
        });
    });
});
