let mergedData = null;

async function loadData() {
    try {
        const coffeeResponse = await fetch('data/coffee_prices.json');
        const coffeeData = await coffeeResponse.json();

        const productivityResponse = await fetch('data/developer_activity.json');
        const productivityData = await productivityResponse.json();

        return {
            coffee: coffeeData.data,
            productivity: productivityData.data
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function mergeDatasets(coffeeData, productivityData) {
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
        coffee: sortedDates.map(date => dateMap.get(date).coffee || null),
        productivity: sortedDates.map(date => dateMap.get(date).productivity || null)
    };

    return merged;
}

async function initializeDashboard() {
    const data = await loadData();

    if (!data) {
        console.error('Failed to load data');
        return;
    }

    mergedData = mergeDatasets(data.coffee, data.productivity);

    renderCoffeeChart(mergedData, document.getElementById('coffeeChart'));
    renderProductivityChart(mergedData, document.getElementById('productivityChart'));
}

document.addEventListener('DOMContentLoaded', initializeDashboard);
