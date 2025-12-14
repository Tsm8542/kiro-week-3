import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderCoffeeChart, renderProductivityChart } from '../src/charts.js';

describe('Charts Module', () => {
    let mockCanvas;

    beforeEach(() => {
        mockCanvas = document.createElement('canvas');
        mockCanvas.id = 'testChart';
        document.body.appendChild(mockCanvas);

        global.Chart = vi.fn(function(ctx, config) {
            this.config = config;
            this.ctx = ctx;
        });
    });

    afterEach(() => {
        if (mockCanvas && mockCanvas.parentNode) {
            mockCanvas.parentNode.removeChild(mockCanvas);
        }
    });

    describe('renderCoffeeChart', () => {
        it('should render chart with valid data', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            renderCoffeeChart(data, mockCanvas);

            expect(global.Chart).toHaveBeenCalled();
        });

        it('should handle null canvas gracefully', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            expect(() => renderCoffeeChart(data, null)).not.toThrow();
        });

        it('should create chart with correct label', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            renderCoffeeChart(data, mockCanvas);

            const callArgs = global.Chart.mock.calls[0];
            expect(callArgs[1].data.datasets[0].label).toBe('Coffee Price (USD)');
        });

        it('should use correct color for coffee chart', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            renderCoffeeChart(data, mockCanvas);

            const callArgs = global.Chart.mock.calls[0];
            expect(callArgs[1].data.datasets[0].borderColor).toBe('#8B4513');
        });
    });

    describe('renderProductivityChart', () => {
        it('should render chart with valid data', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            renderProductivityChart(data, mockCanvas);

            expect(global.Chart).toHaveBeenCalled();
        });

        it('should handle null canvas gracefully', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            expect(() => renderProductivityChart(data, null)).not.toThrow();
        });

        it('should create chart with correct label', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            renderProductivityChart(data, mockCanvas);

            const callArgs = global.Chart.mock.calls[0];
            expect(callArgs[1].data.datasets[0].label).toBe('Developer Activity');
        });

        it('should use correct color for productivity chart', () => {
            const data = {
                dates: ['2023-01', '2023-02'],
                coffee: [3.45, 3.52],
                productivity: [1250, 1380]
            };

            renderProductivityChart(data, mockCanvas);

            const callArgs = global.Chart.mock.calls[0];
            expect(callArgs[1].data.datasets[0].borderColor).toBe('#2E86AB');
        });
    });

    describe('Property: Chart Data Consistency', () => {
        it('should render charts with matching date arrays', () => {
            const data = {
                dates: ['2023-01', '2023-02', '2023-03'],
                coffee: [3.45, 3.52, 3.60],
                productivity: [1250, 1380, 1420]
            };

            renderCoffeeChart(data, mockCanvas);
            const coffeeCallArgs = global.Chart.mock.calls[0];

            global.Chart.mockClear();

            renderProductivityChart(data, mockCanvas);
            const productivityCallArgs = global.Chart.mock.calls[0];

            expect(coffeeCallArgs[1].data.labels).toEqual(productivityCallArgs[1].data.labels);
        });
    });
});
