import { MetalPrice, HistoricalDataPoint } from '../types';
import { METAL_DEFINITIONS } from '../constants';

// This service is designed to simulate a real API service.
// In a real-world scenario, the simulation logic inside each function
// would be replaced with an actual `fetch` call to a backend proxy
// which would then call the respective data sources (IME, LME, BrsApi.ir).

// --- Base prices for a more realistic, continuous simulation ---
const basePrices: { [key: string]: number } = {
    COPPER_WIRE: 7367454,
    GOLD_COIN_EMAMI: 410000000,
    GOLD_GLOBAL: 2350,
    COPPER_LME: 9619.00,
    SILVER_GLOBAL: 30.5,
    ALUMINUM_LME: 2500,
};

// --- A pseudo-random number generator for deterministic but dynamic results ---
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// --- Generates a price for a given metal, making it dynamic based on the current time ---
const getDynamicPrice = (metalKey: string): { current: number, previous: number } => {
    const basePrice = basePrices[metalKey] || 1000;
    
    // Use current time to make the price dynamic on each fetch
    const now = new Date();
    const todaySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const timeSeed = now.getHours() * 60 + now.getMinutes(); // Changes throughout the day

    const volatility = (metalKey.includes('GLOBAL') || metalKey.includes('LME')) ? 0.02 : 0.01;
    
    // Today's price simulation
    const randomFactorToday = (seededRandom(todaySeed + timeSeed) - 0.5) * volatility;
    const currentPrice = basePrice * (1 + randomFactorToday);

    // Yesterday's price simulation (for change calculation)
    const yesterdaySeed = todaySeed - 1; // Seed for the previous day
    const randomFactorYesterday = (seededRandom(yesterdaySeed) - 0.5) * volatility;
    const previousPrice = basePrice * (1 + randomFactorYesterday);

    return {
        current: Math.round(currentPrice),
        previous: Math.round(previousPrice),
    };
};

/**
 * Fetches the latest prices for all metals except the specially scheduled ones.
 * This function would be called every 10 minutes.
 */
export const fetchGeneralPrices = async (): Promise<MetalPrice[]> => {
    console.log(`[${new Date().toLocaleTimeString()}] Fetching general metal prices...`);
    const generalMetals = METAL_DEFINITIONS.filter(m => m.key !== 'COPPER_WIRE');
    
    const prices: MetalPrice[] = generalMetals.map(metal => {
        const { current, previous } = getDynamicPrice(metal.key);
        const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;
        
        return {
            ...metal,
            price: current,
            change: change,
        };
    });

    return Promise.resolve(prices);
};

/**
 * Fetches the latest price specifically for IME Copper.
 * This function is designed to be called on a daily schedule (e.g., 5 PM Tehran time).
 */
export const fetchImePrice = async (): Promise<MetalPrice> => {
    console.log(`[${new Date().toLocaleTimeString()}] Fetching daily IME Copper price...`);
    const metal = METAL_DEFINITIONS.find(m => m.key === 'COPPER_WIRE')!;
    
    // In a real scenario, you'd fetch today's and yesterday's closing price from IME.
    const { current, previous } = getDynamicPrice(metal.key);
    const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;

    const price: MetalPrice = {
        ...metal,
        price: current,
        change: change,
    };
    
    return Promise.resolve(price);
};


/**
 * Fetches historical data for a given metal.
 * In a real application, this would call a dedicated historical data API endpoint.
 */
export const fetchHistoricalData = (metalKey: string, range: string): Promise<HistoricalDataPoint[]> => {
    return new Promise(resolve => {
        console.log(`Fetching historical data for ${metalKey} over ${range}`);
        const data: HistoricalDataPoint[] = [];
        let days = 30;
        switch (range) {
            case '6m': days = 180; break;
            case '1y': days = 365; break;
            default: days = 30; break;
        }

        const basePrice = basePrices[metalKey] || 1000;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
            const volatility = (metalKey.includes('GLOBAL') || metalKey.includes('LME')) ? 0.05 : 0.02;
            const randomFactor = (seededRandom(seed) - 0.5) * volatility;
            const trendFactor = (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 365) * 0.05;

            data.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(basePrice * (1 + randomFactor + trendFactor)),
            });
        }
        resolve(data);
    });
};
