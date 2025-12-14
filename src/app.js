import { fetchCoffeePrices, fetchDeveloperActivity, validateCoffeePriceData, validateDeveloperActivityData } from './api.js';
import { renderCoffeeChart, renderProductivityChart, renderComparisonChart, renderNormalizedChart } from './charts.js';

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

export function calculateStatistics(data) {
    const coffeeValues = data.coffee.filter(v => v !== null);
    const productivityValues = data.productivity.filter(v => v !== null);

    const calculateStats = (values) => {
        if (values.length === 0) return null;
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const trend = values[values.length - 1] - values[0];
        return { min, max, avg, trend };
    };

    return {
        coffee: calculateStats(coffeeValues),
        productivity: calculateStats(productivityValues)
    };
}

export function calculateCorrelation(data) {
    const coffeeValues = data.coffee.filter((v, i) => v !== null && data.productivity[i] !== null);
    const productivityValues = data.productivity.filter((v, i) => v !== null && data.coffee[i] !== null);

    if (coffeeValues.length < 2) return 0;

    const meanCoffee = coffeeValues.reduce((a, b) => a + b, 0) / coffeeValues.length;
    const meanProductivity = productivityValues.reduce((a, b) => a + b, 0) / productivityValues.length;

    let numerator = 0;
    let denomCoffee = 0;
    let denomProductivity = 0;

    for (let i = 0; i < coffeeValues.length; i++) {
        const diffCoffee = coffeeValues[i] - meanCoffee;
        const diffProductivity = productivityValues[i] - meanProductivity;
        numerator += diffCoffee * diffProductivity;
        denomCoffee += diffCoffee * diffCoffee;
        denomProductivity += diffProductivity * diffProductivity;
    }

    const correlation = numerator / Math.sqrt(denomCoffee * denomProductivity);
    return isNaN(correlation) ? 0 : correlation;
}

export function normalizeData(data) {
    const normalize = (values) => {
        const validValues = values.filter(v => v !== null);
        if (validValues.length === 0) return values;
        
        const min = Math.min(...validValues);
        const max = Math.max(...validValues);
        const range = max - min || 1;

        return values.map(v => v === null ? null : ((v - min) / range) * 100);
    };

    return {
        dates: data.dates,
        coffee: normalize(data.coffee),
        productivity: normalize(data.productivity)
    };
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
    const chartsSection2 = document.getElementById('chartsSection2');
    const chartsSection3 = document.getElementById('chartsSection3');
    const statsSection = document.getElementById('statsSection');
    const insightsSection = document.getElementById('insightsSection');
    const loadingContainer = document.getElementById('loadingContainer');
    
    chartsSection.style.display = 'grid';
    chartsSection2.style.display = 'grid';
    chartsSection3.style.display = 'grid';
    statsSection.style.display = 'block';
    insightsSection.style.display = 'block';
    loadingContainer.style.display = 'none';
}

export async function initializeDashboard() {
    try {
        const data = await loadData();
        mergedData = mergeDatasets(data.coffee, data.productivity);

        // Render individual charts
        renderCoffeeChart(mergedData, document.getElementById('coffeeChart'));
        renderProductivityChart(mergedData, document.getElementById('productivityChart'));
        
        // Render comparison chart
        renderComparisonChart(mergedData, document.getElementById('comparisonChart'));
        
        // Render normalized chart
        const normalizedData = normalizeData(mergedData);
        renderNormalizedChart(normalizedData, document.getElementById('normalizedChart'));
        
        // Calculate and display statistics
        const stats = calculateStatistics(mergedData);
        const correlation = calculateCorrelation(mergedData);
        
        displayStatistics(stats, correlation);
        
        showCharts();
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showError('Failed to load data from APIs. Please refresh the page and try again.');
    }
}

function displayStatistics(stats, correlation) {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;

    const formatValue = (val) => typeof val === 'number' ? val.toFixed(2) : 'N/A';

    const html = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Coffee Prices</h3>
                <div class="stat-item">
                    <span class="stat-label">Min:</span>
                    <span class="stat-value">$${formatValue(stats.coffee?.min)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Max:</span>
                    <span class="stat-value">$${formatValue(stats.coffee?.max)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average:</span>
                    <span class="stat-value">$${formatValue(stats.coffee?.avg)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Trend:</span>
                    <span class="stat-value ${stats.coffee?.trend >= 0 ? 'positive' : 'negative'}">
                        ${stats.coffee?.trend >= 0 ? '+' : ''}${formatValue(stats.coffee?.trend)}
                    </span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Developer Activity</h3>
                <div class="stat-item">
                    <span class="stat-label">Min:</span>
                    <span class="stat-value">${formatValue(stats.productivity?.min)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Max:</span>
                    <span class="stat-value">${formatValue(stats.productivity?.max)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Average:</span>
                    <span class="stat-value">${formatValue(stats.productivity?.avg)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Trend:</span>
                    <span class="stat-value ${stats.productivity?.trend >= 0 ? 'positive' : 'negative'}">
                        ${stats.productivity?.trend >= 0 ? '+' : ''}${formatValue(stats.productivity?.trend)}
                    </span>
                </div>
            </div>
            
            <div class="stat-card">
                <h3>Correlation Analysis</h3>
                <div class="stat-item">
                    <span class="stat-label">Correlation:</span>
                    <span class="stat-value">${formatValue(correlation)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Interpretation:</span>
                    <span class="stat-value">
                        ${Math.abs(correlation) < 0.3 ? 'Weak' : Math.abs(correlation) < 0.7 ? 'Moderate' : 'Strong'}
                        ${correlation > 0 ? 'Positive' : 'Negative'}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
