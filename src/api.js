const COFFEE_API_URL = 'https://api.api-ninjas.com/v1/commodities?name=coffee';
const DEVELOPER_API_URL = 'https://api.github.com/repos/github/gitignore/commits?per_page=100';

const MAX_RETRIES = 1;
const RETRY_DELAY = 500;

async function fetchWithRetry(url, options = {}, retries = 0) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retries)));
            return fetchWithRetry(url, options, retries + 1);
        }
        throw error;
    }
}

export async function fetchCoffeePrices() {
    try {
        const data = await fetchWithRetry(COFFEE_API_URL);
        
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid coffee prices data format');
        }

        const prices = data.map(item => ({
            date: item.month || new Date().toISOString().slice(0, 7),
            price_usd: parseFloat(item.price) || 0
        }));

        return prices.length > 0 ? prices : generateMockCoffeePrices();
    } catch (error) {
        console.error('Error fetching coffee prices:', error);
        return generateMockCoffeePrices();
    }
}

export async function fetchDeveloperActivity() {
    try {
        const data = await fetchWithRetry(DEVELOPER_API_URL);
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid developer activity data format');
        }

        const activityMap = new Map();
        
        data.forEach(commit => {
            const date = commit.commit.author.date.slice(0, 7);
            activityMap.set(date, (activityMap.get(date) || 0) + 1);
        });

        const activity = Array.from(activityMap.entries())
            .map(([date, count]) => ({
                date,
                activity_count: count
            }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return activity.length > 0 ? activity : generateMockDeveloperActivity();
    } catch (error) {
        console.error('Error fetching developer activity:', error);
        return generateMockDeveloperActivity();
    }
}

function generateMockCoffeePrices() {
    const prices = [];
    const baseDate = new Date(2023, 0, 1);
    
    for (let i = 0; i < 12; i++) {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() + i);
        const dateStr = date.toISOString().slice(0, 7);
        const price = 3.45 + (Math.sin(i / 12 * Math.PI * 2) * 0.5) + Math.random() * 0.2;
        
        prices.push({
            date: dateStr,
            price_usd: parseFloat(price.toFixed(2))
        });
    }
    
    return prices;
}

function generateMockDeveloperActivity() {
    const activity = [];
    const baseDate = new Date(2023, 0, 1);
    
    for (let i = 0; i < 12; i++) {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() + i);
        const dateStr = date.toISOString().slice(0, 7);
        const count = 1250 + (Math.sin(i / 12 * Math.PI * 2) * 400) + Math.floor(Math.random() * 100);
        
        activity.push({
            date: dateStr,
            activity_count: Math.max(1000, count)
        });
    }
    
    return activity;
}

export function validateCoffeePriceData(data) {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
        item.date && 
        typeof item.date === 'string' && 
        item.date.match(/^\d{4}-\d{2}$/) &&
        typeof item.price_usd === 'number' &&
        item.price_usd >= 0
    );
}

export function validateDeveloperActivityData(data) {
    if (!Array.isArray(data)) return false;
    return data.every(item => 
        item.date && 
        typeof item.date === 'string' && 
        item.date.match(/^\d{4}-\d{2}$/) &&
        typeof item.activity_count === 'number' &&
        item.activity_count >= 0
    );
}
