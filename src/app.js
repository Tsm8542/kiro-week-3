import { fetchCoffeePrices, fetchDeveloperActivity, validateCoffeePriceData, validateDeveloperActivityData } from './api.js';
import { renderCoffeeChart, renderProductivityChart } from './charts.js';

let mergedData = null;

export function mergeDatasets(coffeeData, productivityData) {
    const dateMap = new Map();

    coffeeData.forEach(item => {
        if (!dateMap.has(item.date)) {
            dateMap.set(item.date, {});
        }
        dateMap.get(item.date).coffee = item.price_usd;
    });

    productivityData.forEach(item => {
        if (!dateMap.has(item.date)) {
            dateMap.set(item.date, {});
        }
        dateMap.get(item.date).productivity = item.activity_count;
    });

    const sortedDates = Array.from(dateMap.keys()).sort();

    const merged = {
        dates: sortedDates,
        coffee: sortedDates.map(date => dateMap.get(date).coffee !== undefined ? dateMap.get(date).coffee : null),
        productivity: sortedDates.map(date => dateMap.get(date).productivity !== undefined ? dateMap.get(date).productivity : null)
    };

    return merged;
}

export async function loadData() {
    try {
        const [coffeeData, productivityData] = await Promise.all([
            fetchCoffeePrices(),
            fetchDeveloperActivity()
        ]);

        if (!validateCoffeePriceData(coffeeData)) {
            throw new Error('Invalid coffee prices data');
        }

        if (!validateDeveloperActivityData(productivityData)) {
            throw new Error('Invalid developer activity data');
        }

        return {
            coffee: coffeeData,
            productivity: productivityData
        };
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const loadingContainer = document.getElementById('loadingContainer');
    
    errorContainer.textContent = `Error: ${message}`;
    errorContainer.style.display = 'block';
    loadingContainer.style.display = 'none';
}

function showCharts() {
    const chartsSection = document.getElementById('chartsSection');
    const insightsSection = document.getElementById('insightsSection');
    const loadingContainer = document.getElementById('loadingContainer');
    
    chartsSection.style.display = 'grid';
    insightsSection.style.display = 'block';
    loadingContainer.style.display = 'none';
}

export async function initializeDashboard() {
    try {
        const data = await loadData();
        mergedData = mergeDatasets(data.coffee, data.productivity);

        renderCoffeeChart(mergedData, document.getElementById('coffeeChart'));
        renderProductivityChart(mergedData, document.getElementById('productivityChart'));
        
        showCharts();
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showError('Failed to load data from APIs. Please refresh the page and try again.');
    }
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
