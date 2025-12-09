// hooks/useCurrentPrices.js
import { useState, useEffect, useContext } from "react";
import { HoldingsContext } from "../context/HoldingsContext";
import { fetchBatchPrices } from "../services/priceService";

export const useCurrentPrices = () => {
  const [holdings] = useContext(HoldingsContext);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPrices = async () => {
    if (!holdings || holdings.length === 0) {
      setPrices({});
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Extract unique symbols from holdings
      const symbols = [...new Set(holdings.map(h => h.symbol))];
      
      // Fetch prices
      const priceData = await fetchBatchPrices(symbols);
      setPrices(priceData);
    } catch (err) {
      console.error("Failed to load prices:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on mount and when holdings change
  useEffect(() => {
    loadPrices();
  }, [holdings.length]); // Only reload when number of holdings changes

  // Manual refresh function
  const refreshPrices = () => {
    loadPrices();
  };

  return {
    prices,
    loading,
    error,
    refreshPrices
  };
};

/**
 * Get current price for a specific symbol
 * @param {Object} prices - Prices object from useCurrentPrices
 * @param {string} symbol - Stock symbol
 * @returns {number|null} - Current price or null
 */
export const getCurrentPrice = (prices, symbol) => {
  return prices[symbol]?.ltp || null;
};

/**
 * Calculate P&L for a holding
 * @param {Object} holding - Holding object with avgBuyPrice and quantity
 * @param {number} currentPrice - Current market price
 * @returns {Object} - P&L details
 */
export const calculatePnL = (holding, currentPrice) => {
  if (!currentPrice || !holding.avgBuyPrice) {
    return {
      absolute: 0,
      percentage: 0,
      isProfit: false
    };
  }

  const absolute = (currentPrice - holding.avgBuyPrice) * holding.quantity;
  const percentage = ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;

  return {
    absolute: absolute.toFixed(2),
    percentage: percentage.toFixed(2),
    isProfit: absolute >= 0
  };
};