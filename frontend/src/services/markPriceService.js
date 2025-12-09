import api from "./api";

export const fetchBatchPrices = async (symbols) => {
  try {
    if (!symbols || symbols.length === 0) {
      return {};
    }

    // Create an object to store results
    const priceData = {};
    
    // Fetch prices with delay to avoid rate limiting
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      
      try {
        const res = await api.get(`/analytics/stock/${symbol}`);
        priceData[symbol] = {
          ltp: res.data.ltp,
          percentChange: res.data.fullData?.percentChange,
          loading: false,
          error: null
        };
        
        // Add delay between requests (500ms) to avoid overwhelming the API
        if (i < symbols.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${symbol}:`, error);
        priceData[symbol] = {
          ltp: null,
          percentChange: null,
          loading: false,
          error: error.message
        };
      }
    }
    
    return priceData;
  } catch (error) {
    console.error("Batch price fetch error:", error);
    throw error;
  }
};